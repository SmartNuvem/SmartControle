import { Router } from "express";
import {
  getDashboard,
  movementReport,
  salesReport,
  stockReport,
} from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

export const dashboardRoutes = Router();

dashboardRoutes.use(authMiddleware);
dashboardRoutes.get("/dashboard", getDashboard);
dashboardRoutes.get("/reports/sales", salesReport);
dashboardRoutes.get("/reports/stock", stockReport);
dashboardRoutes.get("/reports/movements", movementReport);



