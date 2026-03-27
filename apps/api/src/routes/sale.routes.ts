import { Router } from "express";
import { createSale, listSales } from "../controllers/sale.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

export const saleRoutes = Router();

saleRoutes.use(authMiddleware);
saleRoutes.get("/", listSales);
saleRoutes.post("/", createSale);



