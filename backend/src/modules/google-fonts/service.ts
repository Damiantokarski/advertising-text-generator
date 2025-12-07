import dotenv from "dotenv";
dotenv.config();

export interface GoogleFontsOptions {
	apiKey?: string;
	cacheTtlMs?: number;
	sort?: "alpha" | "date" | "popularity" | "style" | "trending";
	fetchImpl?: typeof fetch;
	debug?: boolean;
	signal?: AbortSignal;
}

export interface FontItem {
	family: string;
	category: string;
	variants: string[];
	subsets: string[];
	files: Record<string, string>;
}

interface GoogleFontsApiResponse {
	kind: string;
	items: FontItem[];
}

type CacheShape = {
	timestamp: number;
	items: FontItem[];
	etag?: string | null;
};

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24h
let cache: CacheShape = { timestamp: 0, items: [], etag: undefined };
let inFlight: Promise<FontItem[]> | null = null;

const sleep = (ms: number) =>
	new Promise((r) => setTimeout(r, ms + Math.floor(Math.random() * 50)));

function getApiKey(explicit?: string): string {
	const key = explicit ?? process.env.GOOGLE_FONTS_API_KEY;
	if (!key)
		throw new Error("Missing GOOGLE_FONTS_API_KEY (env or option.apiKey)");
	return key;
}

async function fetchFontsFromApi(
	opts: Required<
		Pick<GoogleFontsOptions, "apiKey" | "fetchImpl" | "sort" | "debug">
	> & { signal?: AbortSignal; ifNoneMatch?: string | null }
): Promise<{ items: FontItem[] | null; etag: string | null; status: number }> {
	const { apiKey, fetchImpl, sort, debug, signal, ifNoneMatch } = opts;

	const url = new URL("https://www.googleapis.com/webfonts/v1/webfonts");
	url.searchParams.set("key", apiKey);
	if (sort) url.searchParams.set("sort", sort);

	const headers: Record<string, string> = {};
	if (ifNoneMatch) headers["If-None-Match"] = ifNoneMatch;

	const res = await fetchImpl(url.toString(), { headers, signal });

	if (debug) console.debug(`[Google Fonts] response: ${res.status}`);

	if (res.status === 304) {
		return { items: null, etag: ifNoneMatch ?? null, status: 304 };
	}

	if (!res.ok) {
		const text = await res.text().catch(() => "");
		const err = new Error(
			`Google Fonts API ${res.status} ${res.statusText} ${text}`
		);

		(err as any).status = res.status;
		throw err;
	}

	const etag = res.headers.get("etag");
	const json = (await res.json()) as GoogleFontsApiResponse;

	if (!json || !Array.isArray(json.items)) {
		throw new Error("Unexpected Google Fonts API response shape");
	}

	return { items: json.items, etag, status: res.status };
}

export async function getGoogleFonts(
	options: GoogleFontsOptions = {}
): Promise<FontItem[]> {
	const {
		apiKey = getApiKey(options.apiKey),
		cacheTtlMs = DEFAULT_TTL,
		sort,
		debug = false,
		fetchImpl = (globalThis as any).fetch as typeof fetch,
		signal,
	} = options;

	if (!fetchImpl) {
		throw new Error(
			"Global fetch is undefined. For Node < 18 podaj options.fetchImpl (np. node-fetch)."
		);
	}

	const now = Date.now();
	const expired = now - cache.timestamp > cacheTtlMs;
	const needsRefresh = expired || cache.items.length === 0;

	if (!needsRefresh) return cache.items;

	if (inFlight) return inFlight;

	inFlight = (async () => {
		const maxRetries = 3;
		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				const { items, etag } = await fetchFontsFromApi({
					apiKey,
					fetchImpl,
					sort: sort || "popularity",
					debug,
					signal,
					ifNoneMatch: cache.etag ?? null,
				});

				if (items === null) {
					cache.timestamp = now;
					if (debug)
						console.debug(
							"[Google Fonts] 304 Not Modified, using cached items"
						);
				} else {
					cache = {
						timestamp: now,
						items,
						etag: etag ?? null,
					};
					if (debug)
						console.debug(
							`[Google Fonts] cache updated: ${cache.items.length} fonts, etag=${etag ?? "none"}`
						);
				}

				return cache.items;
			} catch (err: any) {
				const status = err?.status as number | undefined;
				const retryable =
					err?.name === "FetchError" ||
					err?.code === "ECONNRESET" ||
					err?.code === "ETIMEDOUT" ||
					status === 429 ||
					(typeof status === "number" && status >= 500);

				if (!retryable || attempt === maxRetries) {
					if (debug) console.error("[Google Fonts] fetch failed", err);
					if (cache.items.length > 0) {
						return cache.items;
					}

					throw err;
				}

				await sleep(300 * Math.pow(2, attempt));
			}
		}

		return cache.items;
	})();

	try {
		return await inFlight;
	} finally {
		inFlight = null;
	}
}

export async function refreshGoogleFonts(options?: GoogleFontsOptions) {
	return getGoogleFonts({ ...options, cacheTtlMs: 0 });
}

export function clearGoogleFontsCache() {
	cache = { timestamp: 0, items: [], etag: undefined };
}
