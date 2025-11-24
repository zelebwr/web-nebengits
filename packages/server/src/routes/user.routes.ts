import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { prisma } from "../config/db";

const router = Router();

router.get("/me", authenticate, async (req: any, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.json(user);
});

export default router;
