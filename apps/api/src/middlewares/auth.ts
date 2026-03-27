import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { prisma } from "../prisma.js";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não informado." });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token inválido." });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user || !user.active) {
      return res.status(401).json({ message: "Usuário inválido ou inativo." });
    }

    req.user = {
      id: user.id,
      role: user.role,
      username: user.username,
      name: user.name,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Sessão expirada. Faça login novamente." });
  }
}


