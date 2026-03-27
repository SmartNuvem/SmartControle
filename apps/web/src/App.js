import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { SalesPage } from "./pages/SalesPage";
import { SalesHistoryPage } from "./pages/SalesHistoryPage";
import { StockPage } from "./pages/StockPage";
import { UsersPage } from "./pages/UsersPage";
import { ReportsPage } from "./pages/ReportsPage";
function AdminOnly({ children }) {
    const { user } = useAuth();
    if (user?.role !== "ADMIN") {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return children;
}
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { element: _jsx(ProtectedRoute, {}), children: _jsxs(Route, { element: _jsx(AppLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/produtos", element: _jsx(ProductsPage, {}) }), _jsx(Route, { path: "/vendas", element: _jsx(SalesPage, {}) }), _jsx(Route, { path: "/historico", element: _jsx(SalesHistoryPage, {}) }), _jsx(Route, { path: "/relatorios", element: _jsx(ReportsPage, {}) }), _jsx(Route, { path: "/estoque", element: _jsx(AdminOnly, { children: _jsx(StockPage, {}) }) }), _jsx(Route, { path: "/usuarios", element: _jsx(AdminOnly, { children: _jsx(UsersPage, {}) }) })] }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }));
}
