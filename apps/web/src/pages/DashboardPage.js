import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { money, dateTime } from "../lib/format";
export function DashboardPage() {
    const [data, setData] = useState(null);
    useEffect(() => {
        api.get("/dashboard").then((response) => setData(response.data));
    }, []);
    if (!data)
        return _jsx("p", { children: "Carregando dashboard..." });
    return (_jsxs("div", { className: "space-y-5 pb-16 md:pb-0", children: [_jsx("h2", { className: "text-2xl font-bold text-slate-800", children: "Dashboard" }), _jsxs("div", { className: "grid gap-3 md:grid-cols-5", children: [_jsx(Card, { title: "Produtos", value: String(data.totalProducts) }), _jsx(Card, { title: "Total em estoque", value: String(data.totalStock) }), _jsx(Card, { title: "Estoque baixo", value: String(data.lowStock.length) }), _jsx(Card, { title: "Vendas hoje", value: money(data.salesToday) }), _jsx(Card, { title: "Vendas m\uFFFDs", value: money(data.salesMonth) })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("section", { className: "rounded-xl border border-slate-200 p-4", children: [_jsx("h3", { className: "mb-3 text-lg font-semibold", children: "Ranking de vendedores" }), _jsxs("div", { className: "space-y-2", children: [data.ranking.map((item) => (_jsxs("div", { className: "rounded-lg bg-slate-50 p-3", children: [_jsx("p", { className: "font-semibold", children: item.sellerName }), _jsxs("p", { className: "text-sm text-slate-600", children: [item.salesCount, " vendas \uFFFD ", money(item.totalSales)] })] }, item.sellerId))), data.ranking.length === 0 && _jsx("p", { className: "text-sm text-slate-500", children: "Sem vendas no per\uFFFDodo." })] })] }), _jsxs("section", { className: "rounded-xl border border-slate-200 p-4", children: [_jsx("h3", { className: "mb-3 text-lg font-semibold", children: "\uFFFDltimas vendas" }), _jsxs("div", { className: "space-y-2", children: [data.lastSales.map((sale) => (_jsxs("div", { className: "rounded-lg bg-slate-50 p-3", children: [_jsx("p", { className: "font-semibold", children: sale.product.name }), _jsxs("p", { className: "text-sm text-slate-600", children: [sale.seller.name, " \uFFFD ", money(sale.totalPrice), " \uFFFD ", dateTime(sale.createdAt)] })] }, sale.id))), data.lastSales.length === 0 && _jsx("p", { className: "text-sm text-slate-500", children: "Nenhuma venda ainda." })] })] })] })] }));
}
function Card({ title, value }) {
    return (_jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [_jsx("p", { className: "text-sm text-slate-600", children: title }), _jsx("p", { className: "mt-1 text-xl font-bold text-slate-900", children: value })] }));
}
