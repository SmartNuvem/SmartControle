import { Router } from "express";
import { listMovements, stockAdjustment, stockEntry } from "../controllers/stock.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/roles.js";

export const stockRoutes = Router();

stockRoutes.use(authMiddleware);
stockRoutes.get("/movements", requireRole("ADMIN"), listMovements);
stockRoutes.post("/entry", requireRole("ADMIN"), stockEntry);
stockRoutes.post("/adjust", requireRole("ADMIN"), stockAdjustment);



