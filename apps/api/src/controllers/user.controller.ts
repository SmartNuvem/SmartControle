import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { publishEvent } from "../realtime.js";
import { normalizeUsername } from "../utils/normalizeUsername.js";

const userSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(Role),
  active: z.boolean().optional(),
});

export async function listUsers(_req: Request, res: Response) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  return res.json(users);
}

export async function createUser(req: Request, res: Response) {
  const parse = userSchema.safeParse(req.body);
  if (!parse.success || !parse.data.password) {
    return res.status(400).json({ message: "Dados invalidos. Senha e obrigatoria." });
  }

  const username = normalizeUsername(parse.data.username);

  const existing = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
  });
  if (existing) {
    return res.status(409).json({ message: "Usuario ja cadastrado." });
  }

  const password = await bcrypt.hash(parse.data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: parse.data.name,
      username,
      password,
      role: parse.data.role,
      active: parse.data.active ?? true,
    },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  publishEvent("user_changed");
  return res.status(201).json(user);
}

export async function updateUser(req: Request, res: Response) {
  const parse = userSchema.partial().safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Dados invalidos para atualizar Usuario." });
  }

  const { id } = req.params;

  const current = await prisma.user.findUnique({ where: { id } });
  if (!current) {
    return res.status(404).json({ message: "Usuario nao encontrado." });
  }

  const data: {
    name?: string;
    username?: string;
    password?: string;
    role?: Role;
    active?: boolean;
  } = {
    name: parse.data.name,
    role: parse.data.role,
    active: parse.data.active,
  };

  if (parse.data.username) {
    const normalizedUsername = normalizeUsername(parse.data.username);
    const existing = await prisma.user.findFirst({
      where: {
        id: { not: id },
        username: {
          equals: normalizedUsername,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      return res.status(409).json({ message: "Usuario ja cadastrado." });
    }

    data.username = normalizedUsername;
  }

  if (parse.data.password) {
    data.password = await bcrypt.hash(parse.data.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  publishEvent("user_changed");
  return res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ message: "Usuario nao encontrado." });
  }

  await prisma.user.delete({ where: { id } });
  publishEvent("user_changed");
  return res.status(204).send();
}
