import { User, Role } from "@prisma/client";

// ----------------------------------------------------------------
// --- Input Types ---
// ----------------------------------------------------------------

export type LoginInput = Pick<User, "email" | "password">;

export type RegisterInput = Pick<User, "email" | "password" | "name"> & {
    phone?: string;
};

// ----------------------------------------------------------------
// --- Output Types ---
// ----------------------------------------------------------------

/**
 * Represents public user data safe to share (no password).
 */
export interface PublicUser {
    id: string;
    email: string;
    name: string;
    role: Role;
    greenPoints: number;
    phone?: string | null;
}

export interface AuthResponse {
    token: string;
    user: PublicUser;
}

// Re-export Role so frontend can use Role.ADMIN etc.
export { Role };
