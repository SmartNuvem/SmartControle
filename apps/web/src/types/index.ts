export type Role = "ADMIN" | "SELLER";

export type User = {
  id: string;
  name: string;
  username: string;
  role: Role;
};

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  sku?: string | null;
  costPrice?: number | null;
  salePrice: number;
  stockQty: number;
  imagePath?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Sale = {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  product: Product;
  seller: User;
};

export type Movement = {
  id: string;
  type: "ENTRY" | "SALE" | "ADJUSTMENT";
  quantity: number;
  note?: string | null;
  createdAt: string;
  product: { id: string; name: string };
  user: { id: string; name: string; username: string };
};



