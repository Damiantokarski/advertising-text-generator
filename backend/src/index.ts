import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";

import multer from "multer";

import projectRoutes from "./routes/projects";
import fontsRoutes from "./routes/google-fonts";
import authRoutes from "./routes/auth";
import { requireAccessToken } from "./middleware/auth";
import compress from "./routes/compress";

const allowedOrigins = [
	process.env.FRONTEND_URL,
	"http://localhost:3001",
	"http://127.0.0.1:3001",
	"http://localhost:5173",
	"http://127.0.0.1:5173",
].filter(Boolean) as string[];

const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin) return callback(null, true); // allow same-origin requests without an Origin header
		if (allowedOrigins.includes(origin)) return callback(null, true);
		callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 25 * 1024 * 1024, files: 50 },
});

const server = express();
server.use(cors(corsOptions));
server.options("*", cors(corsOptions));
server.use(cookieParser());

server.use(express.json());

server.use(express.urlencoded({ extended: true }));

server.use("/api/projects", requireAccessToken, projectRoutes);
server.use("/api/fonts", requireAccessToken, fontsRoutes);

server.use("/api/auth", authRoutes);

server.use("/api/compress-download", upload.any(), compress);

const PORT = process.env.BACKEND_PORT || 4000;

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
				error: "A server error occurred",
				message:
					process.env.NODE_ENV === "production"
						? "Something went wrong"
						: err.message,
			});
		}
	}
);

// Wrong path handler
server.use("*", (req, res) => {
	res.status(404).json({
		error: "Unknown route",
		message: `Route ${req.originalUrl} does not exist`,
	});
});

server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
