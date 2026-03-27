import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const adminItems = [
    { to: "/", label: "Dashboard" },
    { to: "/produtos", label: "Produtos" },
    { to: "/vendas", label: "Vendas" },
    { to: "/historico", label: "Hist�rico" },
    { to: "/estoque", label: "Estoque" },
    { to: "/usuarios", label: "Usu�rios" },
    { to: "/relatorios", label: "Relat�rios" },
];
const sellerItems = [
    { to: "/", label: "Dashboard" },
    { to: "/produtos", label: "Produtos" },
    { to: "/vendas", label: "Vendas" },
    { to: "/historico", label: "Hist�rico" },
    { to: "/relatorios", label: "Relat�rios" },
];
function linkClass({ isActive }) {
    return `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-brand-500 text-white" : "text-slate-700 hover:bg-slate-100"}`;
}
export function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const items = user?.role === "ADMIN" ? adminItems : sellerItems;
    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-white text-slate-900", children: [_jsxs("div", { className: "mx-auto flex max-w-7xl gap-4 px-3 py-4 md:px-6", children: [_jsxs("aside", { className: "hidden w-64 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-card md:block", children: [_jsx("h1", { className: "text-2xl font-bold text-brand-700", children: "SmartControle" }), _jsxs("p", { className: "mt-1 text-sm text-slate-500", children: ["Ol\uFFFD, ", user?.name] }), _jsx("nav", { className: "mt-6 flex flex-col gap-2", children: items.map((item) => (_jsx(NavLink, { to: item.to, className: linkClass, end: item.to === "/", children: item.label }, item.to))) }), _jsx("button", { className: "mt-8 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700", onClick: handleLogout, children: "Sair" })] }), _jsxs("main", { className: "w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-card md:p-6", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between md:hidden", children: [_jsx("h1", { className: "text-xl font-bold text-brand-700", children: "SmartControle" }), _jsx("button", { className: "rounded-lg bg-slate-900 px-3 py-2 text-sm text-white", onClick: handleLogout, children: "Sair" })] }), _jsx(Outlet, {})] })] }), _jsx("nav", { className: "fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white md:hidden", children: _jsx("div", { className: "grid grid-cols-5 gap-1 p-2", children: items.slice(0, 5).map((item) => (_jsx(NavLink, { to: item.to, end: item.to === "/", className: ({ isActive }) => `rounded-lg px-2 py-2 text-center text-xs font-semibold ${isActive ? "bg-brand-500 text-white" : "text-slate-600"}`, children: item.label }, item.to))) }) })] }));
}
