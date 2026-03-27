import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api, assetUrl } from "../services/api";
import { money } from "../lib/format";
import { useToast } from "../contexts/ToastContext";
export function SalesPage() {
    const { success, error } = useToast();
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    useEffect(() => {
        api.get("/products", { params: { active: true, sortBy: "name", order: "asc" } }).then((response) => {
            setProducts(response.data);
            if (response.data[0])
                setProductId(response.data[0].id);
        });
    }, []);
    const selected = products.find((item) => item.id === productId);
    async function submitSale(event) {
        event.preventDefault();
        try {
            await api.post("/sales", { productId, quantity: Number(quantity) });
            success("Venda registrada com sucesso.");
            setQuantity(1);
            const response = await api.get("/products", { params: { active: true } });
            setProducts(response.data);
        }
        catch (e) {
            error(e?.response?.data?.message || "N�o foi poss�vel concluir a venda.");
        }
    }
    return (_jsxs("div", { className: "space-y-4 pb-16 md:pb-0", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Registrar venda" }), _jsxs("form", { onSubmit: submitSale, className: "grid gap-4 rounded-xl border border-slate-200 p-4 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold", children: "Produto" }), _jsx("select", { className: "w-full rounded-lg border px-3 py-3", value: productId, onChange: (e) => setProductId(e.target.value), children: products.map((product) => (_jsx("option", { value: product.id, children: product.name }, product.id))) }), _jsx("label", { className: "block text-sm font-semibold", children: "Quantidade" }), _jsx("input", { type: "number", min: 1, max: selected?.stockQty || 1, className: "w-full rounded-lg border px-3 py-3", value: quantity, onChange: (e) => setQuantity(Number(e.target.value)), required: true }), _jsx("button", { className: "w-full rounded-lg bg-brand-600 px-4 py-3 font-bold text-white", children: "Confirmar venda" })] }), _jsx("div", { className: "rounded-lg bg-slate-50 p-3", children: selected ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-2 h-44 overflow-hidden rounded-lg bg-slate-200", children: selected.imagePath ? (_jsx("img", { src: assetUrl(selected.imagePath), alt: selected.name, className: "h-full w-full object-cover" })) : (_jsx("div", { className: "flex h-full items-center justify-center text-slate-400", children: "Sem foto" })) }), _jsx("p", { className: "text-lg font-bold", children: selected.name }), _jsxs("p", { className: "text-brand-700", children: ["Pre\uFFFDo: ", money(selected.salePrice)] }), _jsxs("p", { className: `font-semibold ${selected.stockQty <= 10 ? "text-rose-600" : "text-emerald-700"}`, children: ["Dispon\uFFFDvel: ", selected.stockQty] })] })) : (_jsx("p", { children: "Selecione um produto." })) })] })] }));
}
