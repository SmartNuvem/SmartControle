import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { stringify } from "csv-stringify/sync";
import { prisma } from "../prisma.js";
import { config } from "../config.js";

function startOfDay() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfMonth() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getDashboard(_req: Request, res: Response) {
  const [totalProducts, totalStock, lowStock, todaySalesAgg, monthSalesAgg, ranking, lastSales] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.aggregate({ _sum: { stockQty: true } }),
      prisma.product.findMany({
        where: { stockQty: { lte: config.lowStockThreshold }, active: true },
        take: 10,
        orderBy: { stockQty: "asc" },
      }),
      prisma.sale.aggregate({
        where: { createdAt: { gte: startOfDay() } },
        _sum: { totalPrice: true },
      }),
      prisma.sale.aggregate({
        where: { createdAt: { gte: startOfMonth() } },
        _sum: { totalPrice: true },
      }),
      prisma.sale.groupBy({
        by: ["sellerId"],
        _sum: { totalPrice: true },
        _count: { id: true },
        orderBy: { _sum: { totalPrice: "desc" } },
        take: 5,
      }),
      prisma.sale.findMany({
        include: {
          product: { select: { name: true } },
          seller: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

  const sellerIds = ranking.map((item) => item.sellerId);
  const sellers = await prisma.user.findMany({
    where: { id: { in: sellerIds } },
    select: { id: true, name: true },
  });

  return res.json({
    totalProducts,
    totalStock: totalStock._sum.stockQty ?? 0,
    lowStock,
    salesToday: todaySalesAgg._sum.totalPrice ?? 0,
    salesMonth: monthSalesAgg._sum.totalPrice ?? 0,
    ranking: ranking.map((row) => ({
      sellerId: row.sellerId,
      sellerName: sellers.find((s) => s.id === row.sellerId)?.name ?? "N/A",
      totalSales: row._sum.totalPrice ?? 0,
      salesCount: row._count.id,
    })),
    lastSales,
  });
}

export async function salesReport(req: Request, res: Response) {
  const { from, to, sellerId, productId, format } = req.query;

  const where: Prisma.SaleWhereInput = {
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
      product: { select: { name: true, category: true, sku: true } },
      seller: { select: { name: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (format === "csv") {
    const csv = stringify(
      sales.map((sale) => ({
        id: sale.id,
        data: sale.createdAt.toISOString(),
        vendedor: sale.seller.name,
        usuario: sale.seller.username,
        produto: sale.product.name,
        sku: sale.product.sku || "",
        categoria: sale.product.category || "",
        quantidade: sale.quantity,
        valor_unitario: sale.unitPrice,
        valor_total: sale.totalPrice,
      })),
      { header: true },
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio-vendas.csv");
    return res.send(csv);
  }

  return res.json(sales);
}

export async function stockReport(_req: Request, res: Response) {
  const products = await prisma.product.findMany({
    orderBy: [{ stockQty: "asc" }, { name: "asc" }],
  });
  return res.json(products);
}

export async function movementReport(_req: Request, res: Response) {
  const movements = await prisma.stockMovement.findMany({
    include: {
      product: { select: { name: true, sku: true } },
      user: { select: { name: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return res.json(movements);
}




