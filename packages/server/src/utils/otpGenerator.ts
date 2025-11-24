export const generateOTP = (): string => {
    // Generates a 4-digit number (e.g., "4821")
    return Math.floor(1000 + Math.random() * 9000).toString();
};
