import dotenv from "dotenv";
dotenv.config();

export const env = {
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || "default_secret_do_not_use_in_prod",
    UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
};
