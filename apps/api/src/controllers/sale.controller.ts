import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";

const saleSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export async function createSale(req: Request, res: Response) {
  const parse = saleSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Dados invalidos para venda." });
  }

  const { productId, quantity } = parse.data;

  try {
    const sale = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Produto nao encontrado.");
      if (!product.active) throw new Error("Produto inativo nao pode ser vendido.");

      const updated = await tx.product.updateMany({
        where: {
          id: productId,
          active: true,
          stockQty: { gte: quantity },
        },
        data: {
          stockQty: { decrement: quantity },
        },
      });

      if (updated.count === 0) {
        throw new Error("Estoque insuficiente para concluir a venda.");
      }

      const unitPrice = product.salePrice;
      const totalPrice = unitPrice * quantity;

      const createdSale = await tx.sale.create({
        data: {
          productId,
          sellerId: req.user!.id,
          quantity,
          unitPrice,
          totalPrice,
        },
        include: {
          product: true,
          seller: { select: { id: true, name: true, username: true } },
        },
      });

      await tx.stockMovement.create({
        data: {
          productId,
          userId: req.user!.id,
          type: "SALE",
          quantity: -quantity,
          note: `Venda #${createdSale.id}`,
        },
      });

      return createdSale;
    });

    return res.status(201).json(sale);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao registrar venda.";
    return res.status(400).json({ message });
  }
}

export async function listSales(req: Request, res: Response) {
  const { from, to, sellerId, productId } = req.query;

  const where = {
    sellerId: req.user!.role === "SELLER" ? req.user!.id : (sellerId as string | undefined),
    productId: productId as string | undefined,
    createdAt: {
      gte: typeof from === "string" && from ? new Date(from) : undefined,
      lte: typeof to === "string" && to ? new Date(to) : undefined,
    },
  };

  const sales = await prisma.sale.findMany({
    where,
    include: {
      product: true,
      seller: { select: { id: true, name: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(sales);
}




