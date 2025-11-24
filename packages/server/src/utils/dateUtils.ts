/**
 * Checks if a string is a valid future date.
 * Useful for validating ride departure times.
 */
export const isFutureDate = (dateString: string | Date): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    return !isNaN(date.getTime()) && date > now;
};

/**
 * Formats a date to a readable string (e.g., for logging).
 */
export const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};
