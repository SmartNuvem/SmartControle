import { FormEvent, useEffect, useState } from "react";
import { api, assetUrl } from "../services/api";
import type { Product } from "../types";
import { money } from "../lib/format";
import { useToast } from "../contexts/ToastContext";
import { useRealtime } from "../contexts/RealtimeContext";

export function SalesPage() {
  const { success, error } = useToast();
  const { version } = useRealtime();
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get("/products", { params: { active: true, sortBy: "name", order: "asc" } }).then((response) => {
      setProducts(response.data);
      if (response.data[0]) setProductId(response.data[0].id);
    });
  }, [version]);

  const selected = products.find((item) => item.id === productId);

  async function submitSale(event: FormEvent) {
    event.preventDefault();
    try {
      await api.post("/sales", { productId, quantity: Number(quantity) });
      success("Venda registrada com sucesso.");
      setQuantity(1);
      const response = await api.get("/products", { params: { active: true } });
      setProducts(response.data);
    } catch (e: any) {
      error(e?.response?.data?.message || "nao foi possivel concluir a venda.");
    }
  }

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <h2 className="text-2xl font-bold">Registrar venda</h2>

      <form onSubmit={submitSale} className="grid gap-4 rounded-xl border border-slate-200 p-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Produto</label>
          <select className="w-full rounded-lg border px-3 py-3" value={productId} onChange={(e) => setProductId(e.target.value)}>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <label className="block text-sm font-semibold">Quantidade</label>
          <input
            type="number"
            min={1}
            max={selected?.stockQty || 1}
            className="w-full rounded-lg border px-3 py-3"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />

          <button className="w-full rounded-lg bg-brand-600 px-4 py-3 font-bold text-white">Confirmar venda</button>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          {selected ? (
            <>
              <div className="mb-2 h-44 overflow-hidden rounded-lg bg-slate-200">
                {selected.imagePath ? (
                  <img src={assetUrl(selected.imagePath)} alt={selected.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">Sem foto</div>
                )}
              </div>
              <p className="text-lg font-bold">{selected.name}</p>
              <p className="text-brand-700">Preco: {money(selected.salePrice)}</p>
              <p className={`font-semibold ${selected.stockQty <= 10 ? "text-rose-600" : "text-emerald-700"}`}>
                Disponivel: {selected.stockQty}
              </p>
            </>
          ) : (
            <p>Selecione um produto.</p>
          )}
        </div>
      </form>
    </div>
  );
}




