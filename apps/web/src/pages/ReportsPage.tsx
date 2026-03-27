import { useState } from "react";
import { api } from "../services/api";
import { dateTime, money } from "../lib/format";

export function ReportsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sales, setSales] = useState<any[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [moves, setMoves] = useState<any[]>([]);

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
    if (from) params.set("from", from);
    if (to) params.set("to", to);
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

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <h2 className="text-2xl font-bold">Relatorios</h2>

      <div className="grid gap-2 rounded-xl border border-slate-200 p-4 md:grid-cols-4">
        <input type="date" className="rounded-lg border px-3 py-2" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="date" className="rounded-lg border px-3 py-2" value={to} onChange={(e) => setTo(e.target.value)} />
        <button className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white" onClick={loadReports}>Atualizar</button>
        <button className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white" onClick={exportCsv}>Exportar CSV</button>
      </div>

      <section className="rounded-xl border border-slate-200 p-4">
        <h3 className="mb-2 font-semibold">Vendas por periodo</h3>
        <div className="space-y-2">
          {sales.map((sale) => (
            <div key={sale.id} className="rounded-lg bg-slate-50 p-3 text-sm">
              {dateTime(sale.createdAt)}  -  {sale.seller.name}  -  {sale.product.name}  -  {sale.quantity} un  -  {money(sale.totalPrice)}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 p-4">
        <h3 className="mb-2 font-semibold">Produtos com estoque baixo</h3>
        <div className="space-y-2">
          {stock.filter((item) => item.stockQty <= 10).map((item) => (
            <div key={item.id} className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
              {item.name}  -  Estoque: {item.stockQty}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 p-4">
        <h3 className="mb-2 font-semibold">movimentacoes de estoque</h3>
        <div className="space-y-2">
          {moves.slice(0, 20).map((move) => (
            <div key={move.id} className="rounded-lg bg-slate-50 p-3 text-sm">
              {dateTime(move.createdAt)}  -  {move.type}  -  {move.product.name}  -  Qtd: {move.quantity}  -  {move.user.name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


