import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import rideRoutes from "./routes/ride.routes";
import userRoutes from "./routes/user.routes";
import { env } from "./config/env";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static Uploads Folder (To serve images)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/users", userRoutes);

// Health Check
app.get("/", (req, res) => {
    res.send("NebengIts API is Running 🚀");
});

export default app;
