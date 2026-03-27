import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { dateTime, money } from "../lib/format";
export function SalesHistoryPage() {
    const [sales, setSales] = useState([]);
    useEffect(() => {
        api.get("/sales").then((response) => setSales(response.data));
    }, []);
    return (_jsxs("div", { className: "space-y-4 pb-16 md:pb-0", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Hist\uFFFDrico de vendas" }), _jsx("div", { className: "hidden overflow-hidden rounded-xl border border-slate-200 md:block", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "p-3 text-left", children: "Data" }), _jsx("th", { className: "p-3 text-left", children: "Produto" }), _jsx("th", { className: "p-3 text-left", children: "Vendedor" }), _jsx("th", { className: "p-3 text-right", children: "Qtd" }), _jsx("th", { className: "p-3 text-right", children: "Total" })] }) }), _jsx("tbody", { children: sales.map((sale) => (_jsxs("tr", { className: "border-t border-slate-200", children: [_jsx("td", { className: "p-3", children: dateTime(sale.createdAt) }), _jsx("td", { className: "p-3", children: sale.product.name }), _jsx("td", { className: "p-3", children: sale.seller.name }), _jsx("td", { className: "p-3 text-right", children: sale.quantity }), _jsx("td", { className: "p-3 text-right", children: money(sale.totalPrice) })] }, sale.id))) })] }) }), _jsx("div", { className: "space-y-2 md:hidden", children: sales.map((sale) => (_jsxs("div", { className: "rounded-xl border border-slate-200 p-3", children: [_jsx("p", { className: "font-semibold", children: sale.product.name }), _jsx("p", { className: "text-sm text-slate-600", children: dateTime(sale.createdAt) }), _jsx("p", { className: "text-sm text-slate-600", children: sale.seller.name }), _jsxs("p", { className: "text-sm font-semibold", children: [sale.quantity, " un \uFFFD ", money(sale.totalPrice)] })] }, sale.id))) })] }));
}
