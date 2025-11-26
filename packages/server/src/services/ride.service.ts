import { Ride } from "@prisma/client";
import { prisma } from "../config/db";
import { generateOTP } from "../utils/otpGenerator";
import {
    CreateRideInput,
    ApiRideQuery,
    ApiRideListResponse,
    RideStatus,
    ApiRide,
} from "@web-nebengits/shared";

/**
 * Get rides created by a specific driver.
 */
export const getRidesByDriver = async (driverId: string) => {
    return await prisma.ride.findMany({
        where: {
            driverId: driverId,
            deletedAt: null,
        },
        orderBy: { departureTime: "desc" },
        include: {
            driver: {
                select: { name: true, greenPoints: true, phone: true },
            },
            _count: {
                select: { passengers: true },
            },
        },
    });
};

/**
 * Get rides booked by a specific passenger.
 * Should definitely include the code so they can see it in "My Bookings".
 */
export const getRidesByPassenger = async (passengerId: string) => {
    const rides = await prisma.ride.findMany({
        where: {
            passengerIds: { has: passengerId },
            deletedAt: null,
        },
        orderBy: { departureTime: "desc" },
        include: {
            driver: {
                select: { name: true, greenPoints: true, phone: true },
            },
        },
    });

    // We can safely return the code here because we know the requester IS the passenger
    // (based on how the controller calls this)
    return rides; 
};


/**
 * Create a new ride.
 * @param driverId The user ID of the driver.
 * @param input Data from the create ride form.
 * @param imageUrl The public URL of the uploaded vehicle photo.
 */
export const createRide = async (
    driverId: string,
    input: CreateRideInput,
    imageUrl: string
) => {
    // Ensure date string is converted to Date object
    const departureDate = new Date(input.departureTime);

    return await prisma.ride.create({
        data: {
            driverId,
            destination: input.destination,
            pickupPoint: input.pickupPoint,
            departureTime: departureDate,
            seatsAvailable: Number(input.seatsAvailable),
            cost: Number(input.cost),
            vehiclePhotoUrl: imageUrl,
            verificationCode: generateOTP(),
            status: RideStatus.OPEN,
            deletedAt: null,
        },
        include: {
            driver: {
                select: { name: true, greenPoints: true, phone: true },
            },
        },
    });
};

const mapPrismaStatusToShared = (s: unknown): RideStatus => {
    switch (String(s)) {
        case "OPEN":
            return RideStatus.OPEN;
        case "COMPLETED":
            return RideStatus.COMPLETED;
        case "CANCELLED":
            return RideStatus.CANCELLED;
        default:
            return RideStatus.OPEN;
    }
};

/**
 * Get ride by ID.
 * @param rideId The ID of the ride to fetch.
 * @return The ride data or null if not found.
 */
export const getRideById = async (
    rideId: string,
    currentUserId?: string
): Promise<ApiRide> => {
    const ride = await prisma.ride.findUnique({
        where: { id: rideId },
        include: {
            driver: {
                select: { name: true, greenPoints: true, phone: true },
            },
        },
    });

    if (!ride) throw new Error("Ride not found");

    // Determine if sensitive info should be shown
    const isPassenger =
        currentUserId && ride.passengerIds.includes(currentUserId);
    const isDriver = currentUserId === ride.driverId;
    const shouldShowCode = isPassenger || isDriver;

    // Destructure to separate sensitive fields
    const { verificationCode, deletedAt, ...safeRide } = ride;

    return {
        ...safeRide,
        driver: {
            name: safeRide.driver.name,
            greenPoints: safeRide.driver.greenPoints,
            phone: safeRide.driver.phone,
        },
        departureTime: safeRide.departureTime.toISOString(),
        createdAt: safeRide.createdAt.toISOString(),
        updatedAt: safeRide.updatedAt.toISOString(),
        verificationCode: shouldShowCode ? (verificationCode ?? undefined) : undefined,
        // map Prisma enum to shared enum
        status: mapPrismaStatusToShared(ride.status),
    };
};

/**
 * Get all available rides with filters.
 * Handles pagination, searching, and exclusion of own/booked rides.
 */
export const getAvailableRides = async (
    query: ApiRideQuery,
    excludeUserId?: string // New optional parameter
): Promise<ApiRideListResponse> => {
    // normalize excludeUserId so its type is string | undefined
    const normalizedExcludeUserId: string | undefined =
        excludeUserId ?? undefined;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {
        status: RideStatus.OPEN,
        departureTime: { gte: new Date() },
        deletedAt: null,
    };

    // Filter by Destination
    if (query.destination && query.destination.trim() !== "") {
        whereClause.destination = {
            contains: query.destination,
            mode: "insensitive",
        };
    }

    // Filter by Pickup Point
    if (query.pickupPoint && query.pickupPoint.trim() !== "") {
        whereClause.pickupPoint = {
            contains: query.pickupPoint,
            mode: "insensitive",
        };
    }

    // --- Exclude own rides and booked rides ---
    if (normalizedExcludeUserId) {
        whereClause.driverId = { not: normalizedExcludeUserId }; // Don't show my own rides
        whereClause.passengerIds = { hasEvery: [] }; // Placeholder to enable AND clause

        whereClause.AND = [
            // Exclude rides where I am the driver (already handled above by driverId: { not ... }, but let's be safe)
            { driverId: { not: normalizedExcludeUserId } },
            // Exclude rides where I am a passenger
            { NOT: { passengerIds: { has: normalizedExcludeUserId } } },
        ];

        // Clean up the direct assignments if we use AND
        delete whereClause.driverId;
    }
    // -----------------------------------------------

    const [rides, total] = await prisma.$transaction([
        prisma.ride.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { departureTime: "asc" },
            include: {
                driver: {
                    select: { name: true, greenPoints: true, phone: true },
                },
            },
        }),
        prisma.ride.count({ where: whereClause }),
    ]);

    const sanitizedRides: ApiRide[] = rides.map((ride) => {
        const { verificationCode, deletedAt, ...safeRide } = ride;

        return {
            ...safeRide,
            driver: {
                name: safeRide.driver.name,
                greenPoints: safeRide.driver.greenPoints,
                phone: safeRide.driver.phone,
            },
            departureTime: safeRide.departureTime.toISOString(),
            createdAt: safeRide.createdAt.toISOString(),
            updatedAt: safeRide.updatedAt.toISOString(),
            driverId: safeRide.driverId,
            passengerIds: safeRide.passengerIds,
            // map Prisma enum value to shared enum
            status: mapPrismaStatusToShared(ride.status),
        };
    });

    return {
        data: sanitizedRides,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Book a ride (Atomic Update).
 * Ensures a user cannot double-book and seats are decremented safely.
 */
export const bookRide = async (userId: string, rideId: string) => {
    // 1. Check if user is already in the ride (prevent double booking)
    const existingBooking = await prisma.ride.findFirst({
        where: {
            id: rideId,
            passengerIds: { has: userId },
        },
    });

    if (existingBooking) {
        throw new Error("You have already booked this ride");
    }

    // 2. Atomic decrement
    // This query attempts to find the ride AND ensure seats > 0 at the same time.
    // If seatsAvailable is 0, the update will fail to find a record, throwing an error.
    try {
        const updatedRide = await prisma.ride.update({
            where: {
                id: rideId,
                seatsAvailable: { gt: 0 }, // Condition: Must have seats
                status: RideStatus.OPEN,
            },
            data: {
                seatsAvailable: { increment: -1 },
                passengerIds: { push: userId },
            },
        });

        return {
            ticketCode: updatedRide.verificationCode, // Give code to passenger
            message: "Booking confirmed",
        };
    } catch (error) {
        // If update fails, it likely means the ride is full or closed
        throw new Error(
            "Failed to book ride. It might be full or unavailable."
        );
    }
};

/**
 * Verify a ride and distribute points (Transaction).
 * This is the critical "Green Point" logic.
 */
export const verifyRide = async (
    driverId: string,
    rideId: string,
    inputCode: string
) => {
    const ride = await prisma.ride.findUnique({ where: { id: rideId } });

    if (!ride) throw new Error("Ride not found");
    if (ride.driverId !== driverId)
        throw new Error("Unauthorized: Not your ride");
    if (ride.status !== RideStatus.OPEN) throw new Error("Ride is not open");
    if (ride.verificationCode !== inputCode)
        throw new Error("Invalid OTP Code");

    // Execute Transaction: Update Status -> Reward Driver -> Reward Passengers
    await prisma.$transaction([
        // 1. Mark Ride Completed
        prisma.ride.update({
            where: { id: rideId },
            data: { status: RideStatus.COMPLETED },
        }),
        // 2. Reward Driver (+15)
        prisma.user.update({
            where: { id: driverId },
            data: { greenPoints: { increment: 15 } },
        }),
        // 3. Reward Passengers (+5)
        prisma.user.updateMany({
            where: { id: { in: ride.passengerIds } },
            data: { greenPoints: { increment: 5 } },
        }),
    ]);

    return { success: true, pointsEarned: 15 };
};

/**
 * Update a ride.
 * Only the driver can update their own ride.
 */
export const updateRide = async (
    rideId: string,
    driverId: string,
    data: Partial<CreateRideInput>
) => {
    // 1. Check existence and ownership
    const ride = await prisma.ride.findUnique({ where: { id: rideId } });

    if (!ride) throw new Error("Ride not found");
    if (ride.driverId !== driverId) throw new Error("Unauthorized: You are not the driver");

    // 2. Prepare update data
    // We handle date conversion manually if it's passed as a string
    const updateData: any = { ...data };
    
    if (data.departureTime) {
        updateData.departureTime = new Date(data.departureTime);
    }
    
    // Ensure numeric fields are actually numbers
    if (data.seatsAvailable !== undefined) {
        updateData.seatsAvailable = Number(data.seatsAvailable);
    }
    if (data.cost !== undefined) {
        updateData.cost = Number(data.cost);
    }

    // 3. Perform Update
    return await prisma.ride.update({
        where: { id: rideId },
        data: updateData,
        include: {
            driver: {
                select: { name: true, greenPoints: true, phone: true },
            },
        },
    });
};

/**
 * Soft Delete a ride.
 * Sets status to CANCELLED and fills deletedAt.
 */
export const deleteRide = async (rideId: string, driverId: string) => {
    // 1. Check existence and ownership
    const ride = await prisma.ride.findUnique({ where: { id: rideId } });

    if (!ride) throw new Error("Ride not found");
    if (ride.driverId !== driverId) throw new Error("Unauthorized: You are not the driver");

    // 2. Perform Soft Delete
    return await prisma.ride.update({
        where: { id: rideId },
        data: {
            deletedAt: new Date(),
            status: RideStatus.CANCELLED,
        },
    });
};