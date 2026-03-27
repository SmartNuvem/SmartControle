import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { config } from "../config.js";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function login(req: Request, res: Response) {
  const parse = loginSchema.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({ message: "Informe usuário e senha." });
  }

  const { username, password } = parse.data;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.active) {
    return res.status(401).json({ message: "Usuário ou senha inválidos." });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Usuário ou senha inválidos." });
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, {
    expiresIn: "10h",
  });

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    },
  });
}

export async function me(req: Request, res: Response) {
  return res.json({ user: req.user! });
}



