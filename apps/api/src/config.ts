import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3333),
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "change_me",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  lowStockThreshold: 10,
};



