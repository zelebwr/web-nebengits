import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { LoginInput, RegisterInput } from "@web-nebengits/shared";
import { isValidEmail, validatePassword } from "../utils/validation";

/**
 * Register a new user.
 */
export const register = async (req: Request, res: Response) => {
    try {
        const input: RegisterInput = req.body;

        // 1. Controller Validation (Fast Fail)
        const emailError = isValidEmail(input.email);
        if (emailError) {
            return res
                .status(400)
                .json({ success: false, message: emailError });
        }

        const passError = validatePassword(input.password);
        if (passError) {
            return res.status(400).json({ success: false, message: passError });
        }

        // 2. Call Service
        const result = await authService.register(input);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    } catch (error: any) {
        // Handle specific service errors
        if (error.message === "Email already registered") {
            return res
                .status(409)
                .json({ success: false, message: error.message });
        }
        if (error.message.includes("restricted to ITS")) {
            return res
                .status(403) // Forbidden for non-ITS emails
                .json({ success: false, message: error.message });
        }

        console.error("[Auth] Register Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

/**
 * Login a user.
 */
export const login = async (req: Request, res: Response) => {
    try {
        const input: LoginInput = req.body;
        const result = await authService.login(input);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error: any) {
        if (error.message === "Invalid credentials") {
            return res
                .status(401)
                .json({ success: false, message: error.message });
        }

        console.error("[Auth] Login Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
