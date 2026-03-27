import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
export function ProtectedRoute() {
    const { user, loading } = useAuth();
    if (loading) {
        return _jsx("div", { className: "p-8 text-center text-slate-600", children: "Carregando..." });
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(Outlet, {});
}
