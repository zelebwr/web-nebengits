export enum RideStatus {
    OPEN = "OPEN",
    FULL = "FULL",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface ApiRide {
    id: string;
    driverId: string;
    destination: string;
    pickupPoint: string;
    departureTime: string; // ISO string
    seatsAvailable: number;
    cost: number;
    vehiclePhotoUrl: string;
    status: RideStatus;

    // Optional because it's only visible to the driver or booked passenger
    verificationCode?: string;

    createdAt: string;
    updatedAt: string;

    // Relationships
    driver: {
        name: string;
        greenPoints: number;
        phone?: string | null;
    };

    // Include passengerIds for frontend logic
    passengerIds?: string[];
}

export interface CreateRideInput {
    destination: string;
    pickupPoint: string;
    departureTime: string | Date; // Accept string from frontend form
    seatsAvailable: number;
    cost: number;
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

export interface ApiRideQuery {
    page?: number;
    limit?: number;
    destination?: string;
    pickupPoint?: string;
}
