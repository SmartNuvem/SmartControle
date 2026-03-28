import express from "express";
import cors from "cors";
import path from "node:path";
import { config } from "./config.js";
import { authRoutes } from "./routes/auth.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { productRoutes } from "./routes/product.routes.js";
import { saleRoutes } from "./routes/sale.routes.js";
import { stockRoutes } from "./routes/stock.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { eventsRoutes } from "./routes/events.routes.js";
import { errorHandler } from "./middlewares/error.js";

export const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
  }),
);
app.use(express.json());

app.use("/uploads", express.static(path.resolve("apps/api/uploads")));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/sales", saleRoutes);
app.use("/stock", stockRoutes);
app.use("/events", eventsRoutes);
app.use("/", dashboardRoutes);

app.use(errorHandler);



