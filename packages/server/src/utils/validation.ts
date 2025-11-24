import { CreateRideInput, RideStatus } from "@web-nebengits/shared";

// --- Helper ---
const isValidUrl = (urlString: string | null | undefined): boolean => {
    if (!urlString) return true;
    try {
        new URL(urlString);
        return true;
    } catch (e) {
        return false;
    }
};

// --- Auth Validations ---

export const isValidEmail = (email: string): string | null => {
    if (!email || typeof email !== "string") return "Invalid email format";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";

    // ITS Domain Restriction
    if (
        !email.endsWith("@student.its.ac.id") &&
        !email.endsWith("@its.ac.id")
    ) {
        return "Email must be an ITS email domain (@student.its.ac.id)";
    }
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password || typeof password !== "string" || password.length < 6) {
        return "Password must be at least 6 characters long.";
    }
    return null;
};

// --- Ride Validations ---

export const validateRideData = (data: CreateRideInput): string[] | null => {
    const errors: string[] = [];

    // 1. Required Fields
    if (!data.destination) errors.push("Destination is required.");
    if (!data.pickupPoint) errors.push("Pickup point is required.");
    if (!data.departureTime) errors.push("Departure time is required.");

    // 2. Numeric Validations
    if (data.cost === undefined || Number(data.cost) < 0) {
        errors.push("Cost must be a non-negative number.");
    }

    if (!data.seatsAvailable || Number(data.seatsAvailable) <= 0) {
        errors.push("Seats available must be at least 1.");
    } else if (!Number.isInteger(Number(data.seatsAvailable))) {
        errors.push("Seats available must be an integer.");
    }

    // 3. Date Validation
    const departureDate = new Date(data.departureTime);
    if (isNaN(departureDate.getTime())) {
        errors.push("Invalid departure time format.");
    } else if (departureDate <= new Date()) {
        errors.push("Departure time must be in the future.");
    }

    return errors.length > 0 ? errors : null;
};

// --- Pagination Validation ---

export const validatePagination = (page: any, limit: any): string | null => {
    if (page) {
        const pageNum = Number(page);
        if (Number.isNaN(pageNum) || pageNum <= 0) {
            return 'Query parameter "page" must be a positive integer.';
        }
    }
    if (limit) {
        const limitNum = Number(limit);
        if (Number.isNaN(limitNum) || limitNum <= 0) {
            return 'Query parameter "limit" must be a positive integer.';
        }
    }
    return null;
};
