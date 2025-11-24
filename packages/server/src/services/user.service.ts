import { prisma } from "../config/db";
import { PublicUser } from "@web-nebengits/shared";

/**
 * Get a user's public profile by ID.
 * @param userId The ID of the user to retrieve.
 * @throws Error if user is not found.
 */
export const getUserProfile = async (userId: string): Promise<PublicUser> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            greenPoints: true,
            phone: true,
        },
    });

    if (!user) throw new Error("User not found");

    return user;
};