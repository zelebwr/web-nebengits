import { Router } from "express";
import {
    createRide,
    getRides,
    bookRide,
    verifyRide,
} from "../controllers/ride.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// Public Feed (Protected by Auth usually, or public)
router.get("/", authenticate, getRides);

// Driver Actions
router.post("/", authenticate, upload.single("vehiclePhoto"), createRide);
router.post("/:id/verify", authenticate, verifyRide);

// Passenger Actions
router.post("/:id/book", authenticate, bookRide);

export default router;
