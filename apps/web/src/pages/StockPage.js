import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { dateTime } from "../lib/format";
import { useToast } from "../contexts/ToastContext";
export function StockPage() {
    const { success, error } = useToast();
    const [products, setProducts] = useState([]);
    const [movements, setMovements] = useState([]);
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
        if (current)
            setAdjustQty(current.stockQty);
    }, [productId]);
    async function submitEntry(event) {
        event.preventDefault();
        try {
            await api.post("/stock/entry", { productId, quantity: Number(entryQty) });
            success("Entrada registrada.");
            setEntryQty(1);
            await loadData();
        }
        catch {
            error("N�o foi poss�vel registrar entrada.");
        }
    }
    async function submitAdjust(event) {
        event.preventDefault();
        try {
            await api.post("/stock/adjust", { productId, newQuantity: Number(adjustQty) });
            success("Ajuste registrado.");
            await loadData();
        }
        catch {
            error("N�o foi poss�vel ajustar estoque.");
        }
    }
    return (_jsxs("div", { className: "space-y-4 pb-16 md:pb-0", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Estoque e movimenta\uFFFD\uFFFDes" }), _jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [_jsxs("form", { onSubmit: submitEntry, className: "rounded-xl border border-slate-200 p-4", children: [_jsx("h3", { className: "font-semibold", children: "Entrada de mercadoria" }), _jsx("select", { className: "mt-2 w-full rounded-lg border px-3 py-2", value: productId, onChange: (e) => setProductId(e.target.value), children: products.map((product) => (_jsx("option", { value: product.id, children: product.name }, product.id))) }), _jsx("input", { type: "number", min: 1, className: "mt-2 w-full rounded-lg border px-3 py-2", value: entryQty, onChange: (e) => setEntryQty(Number(e.target.value)) }), _jsx("button", { className: "mt-3 w-full rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white", children: "Registrar entrada" })] }), _jsxs("form", { onSubmit: submitAdjust, className: "rounded-xl border border-slate-200 p-4", children: [_jsx("h3", { className: "font-semibold", children: "Ajuste manual de estoque" }), _jsx("select", { className: "mt-2 w-full rounded-lg border px-3 py-2", value: productId, onChange: (e) => setProductId(e.target.value), children: products.map((product) => (_jsx("option", { value: product.id, children: product.name }, product.id))) }), _jsx("input", { type: "number", min: 0, className: "mt-2 w-full rounded-lg border px-3 py-2", value: adjustQty, onChange: (e) => setAdjustQty(Number(e.target.value)) }), _jsx("button", { className: "mt-3 w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white", children: "Aplicar ajuste" })] })] }), _jsx("div", { className: "space-y-2", children: movements.map((move) => (_jsxs("div", { className: "rounded-xl border border-slate-200 p-3", children: [_jsx("p", { className: "font-semibold", children: move.product.name }), _jsxs("p", { className: "text-sm text-slate-600", children: [move.type, " \uFFFD Qtd: ", move.quantity, " \uFFFD ", move.user.name] }), _jsx("p", { className: "text-xs text-slate-500", children: dateTime(move.createdAt) })] }, move.id))) })] }));
}
