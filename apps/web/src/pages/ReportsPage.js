import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { api } from "../services/api";
import { dateTime, money } from "../lib/format";
export function ReportsPage() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [sales, setSales] = useState([]);
    const [stock, setStock] = useState([]);
    const [moves, setMoves] = useState([]);
    async function loadReports() {
        const [salesRes, stockRes, moveRes] = await Promise.all([
            api.get("/reports/sales", { params: { from: from || undefined, to: to || undefined } }),
            api.get("/reports/stock"),
            api.get("/reports/movements"),
        ]);
        setSales(salesRes.data);
        setStock(stockRes.data);
        setMoves(moveRes.data);
    }
    function exportCsv() {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";
        const token = localStorage.getItem("smartcontrole_token");
        const params = new URLSearchParams();
        if (from)
            params.set("from", from);
        if (to)
            params.set("to", to);
        params.set("format", "csv");
        fetch(`${baseUrl}/reports/sales?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.blob())
            .then((blob) => {
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "relatorio-vendas.csv";
            anchor.click();
            URL.revokeObjectURL(url);
        });
    }
    return (_jsxs("div", { className: "space-y-4 pb-16 md:pb-0", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Relat\uFFFDrios" }), _jsxs("div", { className: "grid gap-2 rounded-xl border border-slate-200 p-4 md:grid-cols-4", children: [_jsx("input", { type: "date", className: "rounded-lg border px-3 py-2", value: from, onChange: (e) => setFrom(e.target.value) }), _jsx("input", { type: "date", className: "rounded-lg border px-3 py-2", value: to, onChange: (e) => setTo(e.target.value) }), _jsx("button", { className: "rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white", onClick: loadReports, children: "Atualizar" }), _jsx("button", { className: "rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white", onClick: exportCsv, children: "Exportar CSV" })] }), _jsxs("section", { className: "rounded-xl border border-slate-200 p-4", children: [_jsx("h3", { className: "mb-2 font-semibold", children: "Vendas por per\uFFFDodo" }), _jsx("div", { className: "space-y-2", children: sales.map((sale) => (_jsxs("div", { className: "rounded-lg bg-slate-50 p-3 text-sm", children: [dateTime(sale.createdAt), " \uFFFD ", sale.seller.name, " \uFFFD ", sale.product.name, " \uFFFD ", sale.quantity, " un \uFFFD ", money(sale.totalPrice)] }, sale.id))) })] }), _jsxs("section", { className: "rounded-xl border border-slate-200 p-4", children: [_jsx("h3", { className: "mb-2 font-semibold", children: "Produtos com estoque baixo" }), _jsx("div", { className: "space-y-2", children: stock.filter((item) => item.stockQty <= 10).map((item) => (_jsxs("div", { className: "rounded-lg bg-rose-50 p-3 text-sm text-rose-700", children: [item.name, " \uFFFD Estoque: ", item.stockQty] }, item.id))) })] }), _jsxs("section", { className: "rounded-xl border border-slate-200 p-4", children: [_jsx("h3", { className: "mb-2 font-semibold", children: "Movimenta\uFFFD\uFFFDes de estoque" }), _jsx("div", { className: "space-y-2", children: moves.slice(0, 20).map((move) => (_jsxs("div", { className: "rounded-lg bg-slate-50 p-3 text-sm", children: [dateTime(move.createdAt), " \uFFFD ", move.type, " \uFFFD ", move.product.name, " \uFFFD Qtd: ", move.quantity, " \uFFFD ", move.user.name] }, move.id))) })] })] }));
}
