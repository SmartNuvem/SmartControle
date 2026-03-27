import { Router } from "express";
import { createUser, deleteUser, listUsers, updateUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/roles.js";

export const userRoutes = Router();

userRoutes.use(authMiddleware, requireRole("ADMIN"));
userRoutes.get("/", listUsers);
userRoutes.post("/", createUser);
userRoutes.put("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);

