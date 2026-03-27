import { FormEvent, useEffect, useMemo, useState } from "react";
import { api, assetUrl } from "../services/api";
import type { Product } from "../types";
import { money } from "../lib/format";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

const initialForm = {
  name: "",
  description: "",
  category: "",
  sku: "",
  costPrice: "",
  salePrice: "",
  stockQty: "0",
  active: true,
};

export function ProductsPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [active, setActive] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState<File | null>(null);

  async function loadProducts() {
    const response = await api.get("/products", {
      params: {
        q: query || undefined,
        category: category || undefined,
        active: active === "all" ? undefined : active,
        sortBy,
        order,
      },
    });
    setProducts(response.data);
  }

  useEffect(() => {
    loadProducts();
  }, [query, category, active, sortBy, order]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((item) => item.category).filter(Boolean))) as string[],
    [products],
  );

  function openCreate() {
    setEditing(null);
    setImage(null);
    setForm(initialForm);
    setShowForm(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setImage(null);
    setForm({
      name: product.name,
      description: product.description || "",
      category: product.category || "",
      sku: product.sku || "",
      costPrice: product.costPrice?.toString() || "",
      salePrice: product.salePrice.toString(),
      stockQty: product.stockQty.toString(),
      active: product.active,
    });
    setShowForm(true);
  }

  async function submitForm(event: FormEvent) {
    event.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    if (form.description) fd.append("description", form.description);
    if (form.category) fd.append("category", form.category);
    if (form.sku) fd.append("sku", form.sku);
    if (form.costPrice) fd.append("costPrice", form.costPrice);
    fd.append("salePrice", form.salePrice);
    fd.append("stockQty", form.stockQty);
    fd.append("active", String(form.active));
    if (image) fd.append("image", image);

    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, fd);
        success("Produto atualizado com sucesso.");
      } else {
        await api.post("/products", fd);
        success("Produto cadastrado com sucesso.");
      }
      setShowForm(false);
      await loadProducts();
    } catch {
      error("nao foi possivel salvar o produto.");
    }
  }

  async function removeProduct(id: string) {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;
    try {
      await api.delete(`/products/${id}`);
      success("Produto excluido com sucesso.");
      await loadProducts();
    } catch {
      error("nao foi possivel excluir o produto.");
    }
  }

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">Produtos</h2>
        {user?.role === "ADMIN" && (
          <button className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white" onClick={openCreate}>
            Novo produto
          </button>
        )}
      </div>

      <div className="grid gap-2 md:grid-cols-5">
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Buscar por nome"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="rounded-lg border border-slate-300 px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas categorias</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select className="rounded-lg border border-slate-300 px-3 py-2" value={active} onChange={(e) => setActive(e.target.value)}>
          <option value="all">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
        <select className="rounded-lg border border-slate-300 px-3 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Ordenar por nome</option>
          <option value="stockQty">Ordenar por quantidade</option>
        </select>
        <select className="rounded-lg border border-slate-300 px-3 py-2" value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option>
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-xl border border-slate-200 p-3 shadow-sm">
            <div className="mb-3 h-36 overflow-hidden rounded-lg bg-slate-100">
              {product.imagePath ? (
                <img src={assetUrl(product.imagePath)} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">Sem foto</div>
              )}
            </div>
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-slate-500">{product.category || "Sem categoria"}</p>
            <p className="mt-2 text-lg font-bold text-brand-700">{money(product.salePrice)}</p>
            <p className={`text-sm font-semibold ${product.stockQty <= 10 ? "text-rose-600" : "text-emerald-700"}`}>
              Estoque: {product.stockQty}
            </p>
            <p className={`mt-1 text-xs ${product.active ? "text-emerald-700" : "text-slate-500"}`}>
              {product.active ? "Ativo" : "Inativo"}
            </p>

            {user?.role === "ADMIN" && (
              <div className="mt-3 flex gap-2">
                <button className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white" onClick={() => openEdit(product)}>
                  Editar
                </button>
                <button className="flex-1 rounded-lg bg-rose-600 px-3 py-2 text-sm text-white" onClick={() => removeProduct(product.id)}>
                  Excluir
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form onSubmit={submitForm} className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-xl bg-white p-4">
            <h3 className="text-xl font-bold">{editing ? "Editar produto" : "Novo produto"}</h3>
            <div className="mt-3 grid gap-2">
              <input className="rounded-lg border px-3 py-2" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="rounded-lg border px-3 py-2" placeholder="Descricao" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input className="rounded-lg border px-3 py-2" placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <input className="rounded-lg border px-3 py-2" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              <input type="number" step="0.01" min="0" className="rounded-lg border px-3 py-2" placeholder="Preco de custo" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
              <input type="number" step="0.01" min="0" className="rounded-lg border px-3 py-2" placeholder="Preco de venda" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} required />
              <input type="number" min="0" className="rounded-lg border px-3 py-2" placeholder="Estoque" value={form.stockQty} onChange={(e) => setForm({ ...form, stockQty: e.target.value })} required />
              <label className="text-sm font-semibold">Foto do produto</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
              {image && <p className="text-xs text-slate-500">Preview: {image.name}</p>}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Produto ativo
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="flex-1 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white">Salvar</button>
              <button type="button" className="flex-1 rounded-lg bg-slate-200 px-4 py-2" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


