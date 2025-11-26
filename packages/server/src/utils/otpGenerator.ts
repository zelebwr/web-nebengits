import crypto from "crypto";

/**
 * Generates a secure random 4-digit OTP.
 * Uses crypto.randomInt for better randomness than Math.random()
 */
export const generateOTP = (): string => {
    // Generates an integer between 1000 and 9999
    const otp = crypto.randomInt(1000, 10000);
    return otp.toString();
};
