import { FormEvent, useEffect, useState } from "react";
import { api } from "../services/api";
import type { Movement, Product } from "../types";
import { dateTime } from "../lib/format";
import { useToast } from "../contexts/ToastContext";

export function StockPage() {
  const { success, error } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [productId, setProductId] = useState("");
  const [entryQty, setEntryQty] = useState(1);
  const [adjustQty, setAdjustQty] = useState(0);

  async function loadData() {
    const [productsRes, moveRes] = await Promise.all([api.get("/products"), api.get("/stock/movements")]);
    setProducts(productsRes.data);
    setMovements(moveRes.data);
    if (!productId && productsRes.data[0]) {
      setProductId(productsRes.data[0].id);
      setAdjustQty(productsRes.data[0].stockQty);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const current = products.find((item) => item.id === productId);
    if (current) setAdjustQty(current.stockQty);
  }, [productId]);

  async function submitEntry(event: FormEvent) {
    event.preventDefault();
    try {
      await api.post("/stock/entry", { productId, quantity: Number(entryQty) });
      success("Entrada registrada.");
      setEntryQty(1);
      await loadData();
    } catch {
      error("Não foi possível registrar entrada.");
    }
  }

  async function submitAdjust(event: FormEvent) {
    event.preventDefault();
    try {
      await api.post("/stock/adjust", { productId, newQuantity: Number(adjustQty) });
      success("Ajuste registrado.");
      await loadData();
    } catch {
      error("Não foi possível ajustar estoque.");
    }
  }

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <h2 className="text-2xl font-bold">Estoque e movimentações</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={submitEntry} className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold">Entrada de mercadoria</h3>
          <select className="mt-2 w-full rounded-lg border px-3 py-2" value={productId} onChange={(e) => setProductId(e.target.value)}>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
          <input type="number" min={1} className="mt-2 w-full rounded-lg border px-3 py-2" value={entryQty} onChange={(e) => setEntryQty(Number(e.target.value))} />
          <button className="mt-3 w-full rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white">Registrar entrada</button>
        </form>

        <form onSubmit={submitAdjust} className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold">Ajuste manual de estoque</h3>
          <select className="mt-2 w-full rounded-lg border px-3 py-2" value={productId} onChange={(e) => setProductId(e.target.value)}>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
          <input type="number" min={0} className="mt-2 w-full rounded-lg border px-3 py-2" value={adjustQty} onChange={(e) => setAdjustQty(Number(e.target.value))} />
          <button className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white">Aplicar ajuste</button>
        </form>
      </div>

      <div className="space-y-2">
        {movements.map((move) => (
          <div key={move.id} className="rounded-xl border border-slate-200 p-3">
            <p className="font-semibold">{move.product.name}</p>
            <p className="text-sm text-slate-600">{move.type} • Qtd: {move.quantity} • {move.user.name}</p>
            <p className="text-xs text-slate-500">{dateTime(move.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
