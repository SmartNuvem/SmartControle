import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { parseBool } from "../utils/helpers.js";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  costPrice: z.coerce.number().nonnegative().optional().nullable(),
  salePrice: z.coerce.number().positive(),
  stockQty: z.coerce.number().int().nonnegative(),
  active: z.coerce.boolean().optional(),
});

export async function listProducts(req: Request, res: Response) {
  const { q, category, sortBy = "name", order = "asc" } = req.query;
  const active = parseBool(req.query.active as string | undefined);

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: typeof q === "string" ? q : undefined,
        mode: "insensitive",
      },
      category: typeof category === "string" && category ? category : undefined,
      active,
    },
    orderBy: {
      [sortBy === "stockQty" ? "stockQty" : "name"]: order === "desc" ? "desc" : "asc",
    },
  });

  return res.json(products);
}

export async function getProduct(req: Request, res: Response) {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) {
    return res.status(404).json({ message: "Produto nao encontrado." });
  }
  return res.json(product);
}

export async function createProduct(req: Request, res: Response) {
  const parse = productSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Dados invalidos para produto." });
  }

  if (parse.data.sku) {
    const existing = await prisma.product.findUnique({ where: { sku: parse.data.sku } });
    if (existing) {
      return res.status(409).json({ message: "SKU ja existe." });
    }
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const product = await prisma.product.create({
    data: {
      ...parse.data,
      imagePath,
    },
  });

  if (parse.data.stockQty > 0) {
    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        userId: req.user!.id,
        type: "ENTRY",
        quantity: parse.data.stockQty,
        note: "Estoque inicial no cadastro",
      },
    });
  }

  return res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const parse = productSchema.partial().safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Dados invalidos para atualizacao." });
  }

  const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    return res.status(404).json({ message: "Produto nao encontrado." });
  }

  const nextStock = parse.data.stockQty;
  const diff = typeof nextStock === "number" ? nextStock - existing.stockQty : 0;

  const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      ...parse.data,
      imagePath,
    },
  });

  if (diff !== 0) {
    await prisma.stockMovement.create({
      data: {
        productId: existing.id,
        userId: req.user!.id,
        type: "ADJUSTMENT",
        quantity: diff,
        note: "Ajuste por edicao de produto",
      },
    });
  }

  return res.json(product);
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Produto nao encontrado." });
  }

  await prisma.product.delete({ where: { id } });
  return res.status(204).send();
}




