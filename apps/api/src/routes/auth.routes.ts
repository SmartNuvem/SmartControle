import { Router } from "express";
import { login, me } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

export const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.get("/me", authMiddleware, me);



