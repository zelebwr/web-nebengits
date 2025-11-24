import { User, Role } from "@prisma/client";

// ----------------------------------------------------------------
// --- Frontend -> Server (Data Sent TO the Backend) ---
// ----------------------------------------------------------------

export type LoginInput = Pick<User, "email" | "password">;

export type RegisterInput = Pick<User, "email" | "password" | "name"> & {
    phone?: string;
};

// ----------------------------------------------------------------
// --- Server -> Frontend (Data Sent FROM the Backend) ---
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
