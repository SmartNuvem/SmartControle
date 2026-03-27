import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const adminPassword = await bcrypt.hash("admin123", 10);
    const sellerPassword = await bcrypt.hash("vendedor123", 10);
    const admin = await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            name: "Administrador",
            username: "admin",
            password: adminPassword,
            role: Role.ADMIN,
            active: true,
        },
    });
    await prisma.user.upsert({
        where: { username: "vendedor1" },
        update: {},
        create: {
            name: "Vendedor 1",
            username: "vendedor1",
            password: sellerPassword,
            role: Role.SELLER,
            active: true,
        },
    });
    await prisma.user.upsert({
        where: { username: "vendedor2" },
        update: {},
        create: {
            name: "Vendedor 2",
            username: "vendedor2",
            password: sellerPassword,
            role: Role.SELLER,
            active: true,
        },
    });
    const products = [
        {
            name: "Camiseta B�sica",
            category: "Roupas",
            sku: "CAM-001",
            salePrice: 49.9,
            costPrice: 25,
            stockQty: 80,
            description: "Camiseta confort�vel para uso di�rio",
        },
        {
            name: "Bon� Preto",
            category: "Acess�rios",
            sku: "BON-001",
            salePrice: 39.9,
            costPrice: 18,
            stockQty: 45,
            description: "Bon� ajust�vel com tecido respir�vel",
        },
        {
            name: "Garrafa T�rmica",
            category: "Utilidades",
            sku: "GAR-001",
            salePrice: 89.9,
            costPrice: 46,
            stockQty: 20,
            description: "Mant�m bebidas geladas ou quentes por horas",
        },
    ];
    for (const product of products) {
        const created = await prisma.product.upsert({
            where: { sku: product.sku },
            update: {
                name: product.name,
                category: product.category,
                salePrice: product.salePrice,
                costPrice: product.costPrice,
                stockQty: product.stockQty,
                description: product.description,
                active: true,
            },
            create: {
                ...product,
                active: true,
            },
        });
        const existingMovement = await prisma.stockMovement.findFirst({
            where: {
                productId: created.id,
                userId: admin.id,
                type: "ENTRY",
                note: "Carga inicial",
            },
        });
        if (!existingMovement) {
            await prisma.stockMovement.create({
                data: {
                    productId: created.id,
                    userId: admin.id,
                    type: "ENTRY",
                    quantity: product.stockQty,
                    note: "Carga inicial",
                },
            });
        }
    }
    console.log("Seed conclu�do com sucesso.");
}
main()
    .catch((err) => {
    console.error(err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
