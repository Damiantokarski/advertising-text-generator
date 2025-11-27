import express from "express";

import loginRoutes from "./routes/login";
import projectRoutes from "./routes/projects";
import compress from "./routes/compress";

import cors from "cors";
import multer from "multer";

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 25 * 1024 * 1024, files: 50 },
});

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api/login", loginRoutes);

server.use("/api/projects", projectRoutes);

server.use("/api/compress-download", upload.any(), compress);

const PORT = process.env.BACKEND_PORT || 4000;

server.get("/", (_req, res) => {
	res.status(200).json({
		status: "ok",
		message: "Backend is running correctly",
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
		console.error("Server error:", err);
		if (!res.headersSent) {
			res.status(500).json({
				error: "Internal Server Error",
				message:
					process.env.NODE_ENV === "production"
						? "Something went wrong"
						: err.message,
			});
		}
	}
);

server.use((req, res) => {
	res.status(404).json({
		error: "Unknown Endpoint",
		message: `Path ${req.originalUrl} not found`,
	});
});

server.listen(PORT, () => {
	console.log(`✅ Server running on http://localhost:${PORT}`);
});
