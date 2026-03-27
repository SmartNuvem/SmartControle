import type { NextFunction, Request, Response } from "express";

export function requireRole(...allowed: Array<"ADMIN" | "SELLER">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowed.includes(req.user!.role)) {
      return res.status(403).json({ message: "Você não tem permissão para esta ação." });
    }
    next();
  };
}


