import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";

const movementSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  note: z.string().optional(),
});

const adjustSchema = z.object({
  productId: z.string().min(1),
  newQuantity: z.coerce.number().int().nonnegative(),
  note: z.string().optional(),
});

export async function stockEntry(req: Request, res: Response) {
  const parse = movementSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Dados invalidos para entrada de estoque." });
  }

  const { productId, quantity, note } = parse.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return res.status(404).json({ message: "Produto nao encontrado." });
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: { stockQty: { increment: quantity } },
    });

    await tx.stockMovement.create({
      data: {
        productId,
        userId: req.user!.id,
        type: "ENTRY",
        quantity,
        note,
      },
    });
  });

  return res.status(201).json({ message: "Entrada registrada com sucesso." });
}

export async function stockAdjustment(req: Request, res: Response) {
  const parse = adjustSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Dados invalidos para ajuste de estoque." });
  }

  const { productId, newQuantity, note } = parse.data;
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    return res.status(404).json({ message: "Produto nao encontrado." });
  }

  const diff = newQuantity - product.stockQty;

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: { stockQty: newQuantity },
    });

    await tx.stockMovement.create({
      data: {
        productId,
        userId: req.user!.id,
        type: "ADJUSTMENT",
        quantity: diff,
        note,
      },
    });
  });

  return res.status(201).json({ message: "Ajuste registrado com sucesso." });
}

export async function listMovements(_req: Request, res: Response) {
  const movements = await prisma.stockMovement.findMany({
    include: {
      product: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(movements);
}




