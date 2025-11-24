import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as rideService from "../services/ride.service";
import { CreateRideInput, ApiRideQuery } from "@web-nebengits/shared";
import { env } from "../config/env";
import { validateRideData } from "../utils/validation";

/**
 * GET /api/rides
 * Fetch available rides with filters.
 */
export const getRides = async (req: AuthRequest, res: Response) => {
    try {
        const query = req.query as unknown as ApiRideQuery;
        const result = await rideService.getAvailableRides(query);

        res.json({
            success: true,
            message: "Available rides fetched",
            data: result.data,
            meta: result.meta,
        });
    } catch (error: any) {
        console.error("[Ride] GetRides Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch rides",
        });
    }
};

/**
 * POST /api/rides
 * Create a new ride.
 */
export const createRide = async (req: AuthRequest, res: Response) => {
    try {
        // req.user is guaranteed by authMiddleware
        const driverId = req.user!.id;
        const input = req.body as CreateRideInput;

        // 1. Validate Input
        const validationErrors = validateRideData(input);
        if (validationErrors) {
            return res.status(400).json({
                success: false,
                message: "Invalid ride data",
                errors: validationErrors,
            });
        }

        // 2. Validate File
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Vehicle photo is required",
            });
        }

        // Construct URL: http://localhost:5000/uploads/filename.jpg
        const imageUrl = `${req.protocol}://${req.get("host")}/${
            env.UPLOAD_DIR
        }/${req.file.filename}`;

        // 3. Call Service
        const newRide = await rideService.createRide(driverId, input, imageUrl);

        res.status(201).json({
            success: true,
            message: "Ride created successfully",
            data: newRide,
        });
    } catch (error: any) {
        console.error("[Ride] Create Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create ride",
            error: error.message,
        });
    }
};

/**
 * POST /api/rides/:id/book
 * Book a seat.
 */
export const bookRide = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const rideId = req.params.id;

        const result = await rideService.bookRide(userId, rideId);

        res.json({
            success: true,
            message: result.message,
            data: {
                ticketCode: result.ticketCode,
            },
        });
    } catch (error: any) {
        console.error("[Ride] Book Error:", error);

        if (error.message.includes("already booked")) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        res.status(400).json({
            success: false,
            message: error.message || "Failed to book ride",
        });
    }
};

/**
 * POST /api/rides/:id/verify
 * Verify and complete a ride.
 */
export const verifyRide = async (req: AuthRequest, res: Response) => {
    try {
        const driverId = req.user!.id;
        const rideId = req.params.id;
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "OTP Code is required",
            });
        }

        const result = await rideService.verifyRide(driverId, rideId, code);

        res.json({
            success: true,
            message: "Ride completed! Points distributed.",
            data: result,
        });
    } catch (error: any) {
        console.error("[Ride] Verify Error:", error);

        if (error.message === "Invalid OTP Code") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        if (
            error.message.includes("Unauthorized") ||
            error.message.includes("Not your ride")
        ) {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }
        if (error.message === "Ride not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
