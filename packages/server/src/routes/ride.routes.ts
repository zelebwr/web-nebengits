import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import * as rideController from "../controllers/ride.controller";

const router = Router();

// Apply authentication middleware to ALL routes in this router
router.use(authenticate);

// Public Feed (Authenticated Users)
router.get("/", rideController.getRides);

// NEW: Get Single Ride Detail
router.get("/:id", rideController.getRideDetail);

// Driver: Create Ride (Requires Image Upload)
router.post("/", upload.single("vehiclePhoto"), rideController.createRide);

// Driver: Verify Code
router.post("/:id/verify", rideController.verifyRide);

// Passenger: Book Ride
router.post("/:id/book", rideController.bookRide);

export default router;
