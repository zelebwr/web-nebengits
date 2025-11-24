import { Response, NextFunction, Request } from "express";
import jwt, {
    JwtPayload,
    JsonWebTokenError,
    TokenExpiredError,
} from "jsonwebtoken";
import { prisma } from "../config/db";
import { PublicUser } from "@web-nebengits/shared";
import { env } from "../config/env";

export interface AuthRequest extends Request {
    user?: PublicUser;
}

interface TokenPayload extends JwtPayload {
    id: string;
    role: string;
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        if (!env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

        if (!decoded || !decoded.id) {
            throw new Error("Invalid token payload");
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                greenPoints: true,
                phone: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        req.user = user;
        next();
    } catch (error: any) {
        // Distinguish between Token errors (401) and Server errors (500)
        if (error instanceof TokenExpiredError) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Unauthorized: Token expired",
                });
        }

        if (error instanceof JsonWebTokenError) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Unauthorized: Invalid token",
                });
        }

        // If it's a database error or code error, log it and return 500
        console.error("[Auth Middleware] Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during authentication",
        });
    }
};
