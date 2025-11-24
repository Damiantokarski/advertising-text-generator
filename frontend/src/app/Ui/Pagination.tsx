import { useState } from "react";
import { Icon } from "./Icon";

type PaginationProps = {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	nextPage: () => void;
	prevPage: () => void;
	goToPage: (p: number) => void;
	setPageSize: (size: number) => void;
};

export const Pagination = ({
	page,
	pageSize,
	totalPages,
	nextPage,
	prevPage,
	goToPage,
	setPageSize,
}: PaginationProps) => {
	const pages: number[] = [];
	if (page > 1) pages.push(page - 1);
	pages.push(page);
	if (page < totalPages) pages.push(page + 1);
	const [showPageSize, setShowPageSize] = useState(false);

	const handlePageSizeClick = () => {
		setShowPageSize(!showPageSize);
	};

	const handleSetPageSize = (size: number) => {
		setPageSize(size);
		setShowPageSize(false);
	};

	return (
		<div className="absolute bottom-4 right-8  flex items-center gap-2">
			<button
				onClick={prevPage}
				disabled={page <= 1}
				className="px-2 py-1  rounded disabled:opacity-50 cursor-pointer text-lg"
			>
				<Icon type="arrowLeft" />
			</button>

			<div className="flex gap-1">
				{pages.map((p) => (
					<button
						key={p}
						onClick={() => goToPage(p)}
						className={`px-3 text-sm py-1 rounded ${
							p === page ? "bg-primary-blue-sky text-white" : "bg-gray-100"
						}`}
						aria-current={p === page ? "page" : undefined}
					>
						{p}
					</button>
				))}
			</div>

			<button
				onClick={nextPage}
				disabled={page >= totalPages}
				className="px-2 py-1  rounded disabled:opacity-50  cursor-pointer text-lg"
			>
				<Icon type="arrowRight" />
			</button>
			<button
				className="border border-primary-blue-sky px-3 py-1 rounded text-sm flex items-center gap-1 bg-surface text-primary-blue-sky cursor-pointer w-20 justify-center "
				onClick={handlePageSizeClick}
			>
				<span>{pageSize}/str</span>
				<Icon type={showPageSize ? "arrowDown" : "arrowUp"} />
			</button>
			{showPageSize && (
				<div className=" flex flex-col bg-surface z-10 absolute right-0 -top-33  shadow rounded w-20  border border-primary-blue-sky">
					{[5, 10, 20, 50].map((n) => (
						<button
							key={n}
							onClick={() => handleSetPageSize(n)}
							className="px-4 py-2 hover:bg-gray-100 text-left text-xs text-primary-text cursor-pointer rounded"
						>
							{n}
						</button>
					))}
				</div>
			)}
		</div>
	);
};
