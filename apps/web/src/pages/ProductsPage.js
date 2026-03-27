import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { api, assetUrl } from "../services/api";
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
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [active, setActive] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("asc");
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [image, setImage] = useState(null);
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
    const categories = useMemo(() => Array.from(new Set(products.map((item) => item.category).filter(Boolean))), [products]);
    function openCreate() {
        setEditing(null);
        setImage(null);
        setForm(initialForm);
        setShowForm(true);
    }
    function openEdit(product) {
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
    async function submitForm(event) {
        event.preventDefault();
        const fd = new FormData();
        fd.append("name", form.name);
        if (form.description)
            fd.append("description", form.description);
        if (form.category)
            fd.append("category", form.category);
        if (form.sku)
            fd.append("sku", form.sku);
        if (form.costPrice)
            fd.append("costPrice", form.costPrice);
        fd.append("salePrice", form.salePrice);
        fd.append("stockQty", form.stockQty);
        fd.append("active", String(form.active));
        if (image)
            fd.append("image", image);
        try {
            if (editing) {
                await api.put(`/products/${editing.id}`, fd);
                success("Produto atualizado com sucesso.");
            }
            else {
                await api.post("/products", fd);
                success("Produto cadastrado com sucesso.");
            }
            setShowForm(false);
            await loadProducts();
        }
        catch {
            error("N�o foi poss�vel salvar o produto.");
        }
    }
    async function removeProduct(id) {
        if (!window.confirm("Deseja realmente excluir este produto?"))
            return;
        try {
            await api.delete(`/products/${id}`);
            success("Produto exclu�do com sucesso.");
            await loadProducts();
        }
        catch {
            error("N�o foi poss�vel excluir o produto.");
        }
    }
    return (_jsxs("div", { className: "space-y-4 pb-16 md:pb-0", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Produtos" }), user?.role === "ADMIN" && (_jsx("button", { className: "rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white", onClick: openCreate, children: "Novo produto" }))] }), _jsxs("div", { className: "grid gap-2 md:grid-cols-5", children: [_jsx("input", { className: "rounded-lg border border-slate-300 px-3 py-2", placeholder: "Buscar por nome", value: query, onChange: (e) => setQuery(e.target.value) }), _jsxs("select", { className: "rounded-lg border border-slate-300 px-3 py-2", value: category, onChange: (e) => setCategory(e.target.value), children: [_jsx("option", { value: "", children: "Todas categorias" }), categories.map((item) => (_jsx("option", { value: item, children: item }, item)))] }), _jsxs("select", { className: "rounded-lg border border-slate-300 px-3 py-2", value: active, onChange: (e) => setActive(e.target.value), children: [_jsx("option", { value: "all", children: "Todos" }), _jsx("option", { value: "true", children: "Ativos" }), _jsx("option", { value: "false", children: "Inativos" })] }), _jsxs("select", { className: "rounded-lg border border-slate-300 px-3 py-2", value: sortBy, onChange: (e) => setSortBy(e.target.value), children: [_jsx("option", { value: "name", children: "Ordenar por nome" }), _jsx("option", { value: "stockQty", children: "Ordenar por quantidade" })] }), _jsxs("select", { className: "rounded-lg border border-slate-300 px-3 py-2", value: order, onChange: (e) => setOrder(e.target.value), children: [_jsx("option", { value: "asc", children: "Crescente" }), _jsx("option", { value: "desc", children: "Decrescente" })] })] }), _jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: products.map((product) => (_jsxs("article", { className: "rounded-xl border border-slate-200 p-3 shadow-sm", children: [_jsx("div", { className: "mb-3 h-36 overflow-hidden rounded-lg bg-slate-100", children: product.imagePath ? (_jsx("img", { src: assetUrl(product.imagePath), alt: product.name, className: "h-full w-full object-cover" })) : (_jsx("div", { className: "flex h-full items-center justify-center text-slate-400", children: "Sem foto" })) }), _jsx("p", { className: "font-semibold", children: product.name }), _jsx("p", { className: "text-sm text-slate-500", children: product.category || "Sem categoria" }), _jsx("p", { className: "mt-2 text-lg font-bold text-brand-700", children: money(product.salePrice) }), _jsxs("p", { className: `text-sm font-semibold ${product.stockQty <= 10 ? "text-rose-600" : "text-emerald-700"}`, children: ["Estoque: ", product.stockQty] }), _jsx("p", { className: `mt-1 text-xs ${product.active ? "text-emerald-700" : "text-slate-500"}`, children: product.active ? "Ativo" : "Inativo" }), user?.role === "ADMIN" && (_jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx("button", { className: "flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white", onClick: () => openEdit(product), children: "Editar" }), _jsx("button", { className: "flex-1 rounded-lg bg-rose-600 px-3 py-2 text-sm text-white", onClick: () => removeProduct(product.id), children: "Excluir" })] }))] }, product.id))) }), showForm && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4", children: _jsxs("form", { onSubmit: submitForm, className: "max-h-[90vh] w-full max-w-xl overflow-auto rounded-xl bg-white p-4", children: [_jsx("h3", { className: "text-xl font-bold", children: editing ? "Editar produto" : "Novo produto" }), _jsxs("div", { className: "mt-3 grid gap-2", children: [_jsx("input", { className: "rounded-lg border px-3 py-2", placeholder: "Nome", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), required: true }), _jsx("input", { className: "rounded-lg border px-3 py-2", placeholder: "Descri\uFFFD\uFFFDo", value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }) }), _jsx("input", { className: "rounded-lg border px-3 py-2", placeholder: "Categoria", value: form.category, onChange: (e) => setForm({ ...form, category: e.target.value }) }), _jsx("input", { className: "rounded-lg border px-3 py-2", placeholder: "SKU", value: form.sku, onChange: (e) => setForm({ ...form, sku: e.target.value }) }), _jsx("input", { type: "number", step: "0.01", min: "0", className: "rounded-lg border px-3 py-2", placeholder: "Pre\uFFFDo de custo", value: form.costPrice, onChange: (e) => setForm({ ...form, costPrice: e.target.value }) }), _jsx("input", { type: "number", step: "0.01", min: "0", className: "rounded-lg border px-3 py-2", placeholder: "Pre\uFFFDo de venda", value: form.salePrice, onChange: (e) => setForm({ ...form, salePrice: e.target.value }), required: true }), _jsx("input", { type: "number", min: "0", className: "rounded-lg border px-3 py-2", placeholder: "Estoque", value: form.stockQty, onChange: (e) => setForm({ ...form, stockQty: e.target.value }), required: true }), _jsx("label", { className: "text-sm font-semibold", children: "Foto do produto" }), _jsx("input", { type: "file", accept: "image/*", onChange: (e) => setImage(e.target.files?.[0] || null) }), image && _jsxs("p", { className: "text-xs text-slate-500", children: ["Preview: ", image.name] }), _jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", checked: form.active, onChange: (e) => setForm({ ...form, active: e.target.checked }) }), "Produto ativo"] })] }), _jsxs("div", { className: "mt-4 flex gap-2", children: [_jsx("button", { type: "submit", className: "flex-1 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white", children: "Salvar" }), _jsx("button", { type: "button", className: "flex-1 rounded-lg bg-slate-200 px-4 py-2", onClick: () => setShowForm(false), children: "Cancelar" })] })] }) }))] }));
}
