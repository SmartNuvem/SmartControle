import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/roles.js";
import { upload } from "../middlewares/upload.js";

export const productRoutes = Router();

productRoutes.use(authMiddleware);
productRoutes.get("/", listProducts);
productRoutes.get("/:id", getProduct);
productRoutes.post("/", requireRole("ADMIN"), upload.single("image"), createProduct);
productRoutes.put("/:id", requireRole("ADMIN"), upload.single("image"), updateProduct);
productRoutes.delete("/:id", requireRole("ADMIN"), deleteProduct);



