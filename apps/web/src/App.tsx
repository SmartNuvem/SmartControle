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

function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/vendas" element={<SalesPage />} />
          <Route path="/historico" element={<SalesHistoryPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />

          <Route
            path="/estoque"
            element={
              <AdminOnly>
                <StockPage />
              </AdminOnly>
            }
          />
          <Route
            path="/usuarios"
            element={
              <AdminOnly>
                <UsersPage />
              </AdminOnly>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
