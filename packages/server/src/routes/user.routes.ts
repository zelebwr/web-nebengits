import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getMe } from "../controllers/user.controller";

const router = Router();

// Protect all user routes
router.use(authenticate);

router.get("/me", getMe);

export default router;
