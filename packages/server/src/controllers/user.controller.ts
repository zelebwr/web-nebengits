import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as userService from "../services/user.service";

/**
 * GET /api/users/me
 * Fetch current user profile.
 */
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        // req.user is guaranteed by authMiddleware, but use optional chaining for safety
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User context missing",
            });
        }

        const user = await userService.getUserProfile(userId);

        res.json({
            success: true,
            message: "Profile fetched",
            data: user,
        });
    } catch (error: any) {
        console.error("[User] GetMe Error:", error);

        if (error.message === "User not found") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
        });
    }
};
