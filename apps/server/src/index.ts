import "dotenv/config";
import cors from "cors";
import express from "express";
import redditAuthRoutes from "./config/reddit-oauth-simple";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:3001",
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	}),
);

// Routes
app.use(redditAuthRoutes);

app.get("/", (_req, res) => {
	res.status(200).json({ message: "RedCircle API is running" });
});

// Health check
app.get("/health", (_req, res) => {
	res.status(200).json({ status: "healthy" });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response) => {
	console.error("\n❌ === Global Error Handler ===");
	console.error("Error:", err);
	console.error("Path:", req.path);
	console.error("Method:", req.method);
	console.error("❌ === End of Error ===\n");
	
	res.status(500).json({
		error: "Internal server error",
		message: err.message,
	});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`\n🚀 Server running on port ${port}\n`);
});
