import { Ride, RideStatus } from "@prisma/client";
import { PublicUser } from "./user.types";

// ----------------------------------------------------------------
// --- Input Types (Frontend -> Backend) ---
// ----------------------------------------------------------------

export interface CreateRideInput {
    destination: string;
    pickupPoint: string;
    departureTime: string; // ISO String expected from frontend date picker
    seatsAvailable: number;
    cost: number;
}

export interface ApiRideQuery {
    page?: number | string; // Allow numbers for easier frontend usage
    limit?: number | string;
    destination?: string;
    status?: RideStatus;
}

// ----------------------------------------------------------------
// --- Output Types (Backend -> Frontend) ---
// ----------------------------------------------------------------

/**
 * The Ride object as seen by the Frontend.
 * We Omit Date fields from the Prisma model and redefine them as strings
 * because JSON serialization converts Date objects to ISO strings.
 */
export interface ApiRide
    extends Omit<
        Ride,
        | "verificationCode"
        | "deletedAt"
        | "departureTime"
        | "createdAt"
        | "updatedAt"
    > {
    departureTime: string; // ISO String
    createdAt: string; // ISO String
    updatedAt: string; // ISO String

    // Nested Driver Info
    driver: Pick<PublicUser, "name" | "greenPoints" | "phone">;

    // Optional counts (good to have defined for future)
    _count?: {
        passengers: number;
    };
}

export interface ApiRideListResponse {
    data: ApiRide[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Re-export Enum so Frontend can use it for status checking
export { RideStatus };
