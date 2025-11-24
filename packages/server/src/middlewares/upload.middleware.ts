import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { env } from "../config/env";

// Ensure upload directory exists
const uploadDir = env.UPLOAD_DIR || "uploads";
const fullUploadPath = path.join(__dirname, "../../", uploadDir); // Adjust path to root of server package

if (!fs.existsSync(fullUploadPath)) {
    fs.mkdirSync(fullUploadPath, { recursive: true });
}

// Configure Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fullUploadPath);
    },
    filename: (req, file, cb) => {
        // Filename: vehicle-TIMESTAMP-RANDOM.ext
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

// File Filter (Images Only)
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
};

// Export Multer Instance
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB Limit
    },
});
