import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";
import { env } from "../config/env";
import {
    LoginInput,
    RegisterInput,
    AuthResponse,
    PublicUser,
} from "@web-nebengits/shared";

// Helper to standardise user selection (DRY principle)
const userSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    greenPoints: true,
    phone: true,
};

/**
 * Register a new user with domain validation.
 * @throws Error if email domain is invalid or email already exists.
 */
export const register = async (input: RegisterInput): Promise<AuthResponse> => {
    const { email, password, name, phone } = input;

    // 1. Domain Validation (Business Logic)
    if (
        !email.endsWith("@student.its.ac.id") &&
        !email.endsWith("@its.ac.id")
    ) {
        throw new Error("Registration restricted to ITS Email domains");
    }

    // 2. Check duplication
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new Error("Email already registered");
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            phone,
            greenPoints: 0,
        },
        select: userSelect,
    });

    // 5. Generate Token
    const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    return { token, user: newUser };
};

/**
 * Authenticate a user.
 * @throws Error if credentials are invalid.
 */
export const login = async (input: LoginInput): Promise<AuthResponse> => {
    const { email, password } = input;

    const userFound = await prisma.user.findUnique({ where: { email } });
    if (!userFound) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
        { id: userFound.id, role: userFound.role },
        env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    const publicUser: PublicUser = {
        id: userFound.id,
        email: userFound.email,
        name: userFound.name,
        role: userFound.role,
        greenPoints: userFound.greenPoints,
        phone: userFound.phone,
    };

    return { token, user: publicUser };
};
