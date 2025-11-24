import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env";

// Import Routes
import authRoutes from "./routes/auth.routes";
import rideRoutes from "./routes/ride.routes";
import userRoutes from "./routes/user.routes";

const app = express();

// 1. Middleware
app.use(cors()); // Allow Frontend to talk to Backend
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// 2. Static Files (Images)
app.use(
    `/${env.UPLOAD_DIR}`,
    express.static(path.join(__dirname, `../${env.UPLOAD_DIR}`))
);

// 3. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/users", userRoutes);

// 4. Health Check
app.get("/", (req, res) => {
    res.json({
        message: "NebengIts API is Running 🚀",
        environment: process.env.NODE_ENV || "development",
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

export default app;
