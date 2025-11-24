import { Response } from "express";

/**
 * Sends a success response with a standardized format.
 */
export const sendSuccess = (
    res: Response,
    message: string,
    data: any = null,
    statusCode = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

/**
 * Sends an error response with a standardized format.
 */
export const sendError = (
    res: Response,
    message: string,
    statusCode = 500,
    error: any = null
) => {
    // In production, you might want to hide the 'error' stack trace
    return res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === "development" ? error : undefined,
    });
};
