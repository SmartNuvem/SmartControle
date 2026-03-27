import { useEffect, useState } from "react";
import { api } from "../services/api";
import { money, dateTime } from "../lib/format";

type DashboardData = {
  totalProducts: number;
  totalStock: number;
  salesToday: number;
  salesMonth: number;
  lowStock: Array<{ id: string; name: string; stockQty: number }>;
  ranking: Array<{ sellerId: string; sellerName: string; totalSales: number; salesCount: number }>;
  lastSales: Array<{ id: string; totalPrice: number; createdAt: string; product: { name: string }; seller: { name: string } }>;
};

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get("/dashboard").then((response) => setData(response.data));
  }, []);

  if (!data) return <p>Carregando dashboard...</p>;

  return (
    <div className="space-y-5 pb-16 md:pb-0">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>

      <div className="grid gap-3 md:grid-cols-5">
        <Card title="Produtos" value={String(data.totalProducts)} />
        <Card title="Total em estoque" value={String(data.totalStock)} />
        <Card title="Estoque baixo" value={String(data.lowStock.length)} />
        <Card title="Vendas hoje" value={money(data.salesToday)} />
        <Card title="Vendas mês" value={money(data.salesMonth)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-3 text-lg font-semibold">Ranking de vendedores</h3>
          <div className="space-y-2">
            {data.ranking.map((item) => (
              <div key={item.sellerId} className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold">{item.sellerName}</p>
                <p className="text-sm text-slate-600">
                  {item.salesCount} vendas • {money(item.totalSales)}
                </p>
              </div>
            ))}
            {data.ranking.length === 0 && <p className="text-sm text-slate-500">Sem vendas no período.</p>}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-3 text-lg font-semibold">Últimas vendas</h3>
          <div className="space-y-2">
            {data.lastSales.map((sale) => (
              <div key={sale.id} className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold">{sale.product.name}</p>
                <p className="text-sm text-slate-600">
                  {sale.seller.name} • {money(sale.totalPrice)} • {dateTime(sale.createdAt)}
                </p>
              </div>
            ))}
            {data.lastSales.length === 0 && <p className="text-sm text-slate-500">Nenhuma venda ainda.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-600">{title}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
