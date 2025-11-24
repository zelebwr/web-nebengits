import { Ride, RideStatus } from "@prisma/client";
import { PublicUser } from "./user.types";

// ----------------------------------------------------------------
// --- Frontend -> Server (Data Sent TO the Backend) ---
// ----------------------------------------------------------------

/**
 * Data required to create a ride.
 * Note: We don't send `driverId` or `status` because the Backend sets those.
 */
export interface CreateRideInput {
  destination: string;
  pickupPoint: string;
  departureTime: string; // Sent as ISO string from frontend
  seatsAvailable: number;
  cost: number;
  // vehiclePhoto is handled via FormData, not JSON body usually, 
  // but if using base64 or pre-uploaded URL, it goes here.
}

/**
 * Query parameters for filtering the ride feed.
 */
export interface ApiRideQuery {
  page?: string;
  limit?: string;
  destination?: string;
  status?: RideStatus;
}

// ----------------------------------------------------------------
// --- Server -> Frontend (Data Sent FROM the Backend) ---
// ----------------------------------------------------------------

/**
 * The full ride object returned to the frontend.
 * Includes the nested `driver` object for display cards.
 */
export interface ApiRide extends Omit<Ride, "verificationCode" | "deletedAt"> {
  driver: Pick<PublicUser, "name" | "greenPoints" | "phone">;
  // We might include passenger count or list depending on privacy
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

// Re-export Enum so Frontend can use it
export { RideStatus };