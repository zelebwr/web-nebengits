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
        },
        include: {
            driver: {
                select: { name: true, greenPoints: true, phone: true },
            },
        },
    });
};

/**
 * Get all available rides with filters.
 * Handles pagination and searching.
 */
export const getAvailableRides = async (
    query: ApiRideQuery
): Promise<ApiRideListResponse> => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build Filter
    const whereClause: any = {
        status: RideStatus.OPEN,
        departureTime: { gte: new Date() }, // Only future rides
        deletedAt: null, // Exclude soft-deleted
    };

    if (query.destination) {
        whereClause.destination = {
            contains: query.destination,
            mode: "insensitive",
        };
    }

    // Fetch Data and Count in parallel for efficiency
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
                _count: {
                    select: { passengers: true },
                },
            },
        }),
        prisma.ride.count({ where: whereClause }),
    ]);

    // Hide secret code from public feed for security
    const sanitizedRides: ApiRide[] = rides.map((ride) => {
        // Destructure to remove unwanted fields
        const { verificationCode, deletedAt, ...safeRide } = ride;

        return {
            ...safeRide,
            // Ensure driver is correctly typed (Prisma includes it, but TS needs reassurance)
            driver: {
                name: safeRide.driver.name,
                greenPoints: safeRide.driver.greenPoints,
                phone: safeRide.driver.phone,
            },
            // Convert Dates to ISO strings for JSON safety
            departureTime: safeRide.departureTime.toISOString(),
            createdAt: safeRide.createdAt.toISOString(),
            updatedAt: safeRide.updatedAt.toISOString(),
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
                seatsAvailable: { gt: 0 }, // Atomic check: seats > 0
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
