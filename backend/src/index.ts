import express from "express";

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const PORT = process.env.BACKEND_PORT || 4000;

server.get("/", (_req, res) => {
	res.status(200).json({
		status: "ok",
		message: "Backend działa poprawnie",
		time: new Date().toISOString(),
	});
});

server.use(
	(
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.error("Błąd serwera:", err);
		if (!res.headersSent) {
			res.status(500).json({
				error: "Wystąpił błąd serwera",
				message:
					process.env.NODE_ENV === "production"
						? "Coś poszło nie tak"
						: err.message,
			});
		}
	}
);

server.use((req, res) => {
	res.status(404).json({
		error: "Nieznana trasa",
		message: `Trasa ${req.originalUrl} nie istnieje`,
	});
});

server.listen(PORT, () => {
	console.log(`✅ Server running on http://localhost:${PORT}`);
});
