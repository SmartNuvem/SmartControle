import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Sale } from "../types";
import { dateTime, money } from "../lib/format";
import { useRealtime } from "../contexts/RealtimeContext";

export function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const { version } = useRealtime();

  useEffect(() => {
    api.get("/sales").then((response) => setSales(response.data));
  }, [version]);

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <h2 className="text-2xl font-bold">Historico de vendas</h2>

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Produto</th>
              <th className="p-3 text-left">Vendedor</th>
              <th className="p-3 text-right">Qtd</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-t border-slate-200">
                <td className="p-3">{dateTime(sale.createdAt)}</td>
                <td className="p-3">{sale.product.name}</td>
                <td className="p-3">{sale.seller.name}</td>
                <td className="p-3 text-right">{sale.quantity}</td>
                <td className="p-3 text-right">{money(sale.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 md:hidden">
        {sales.map((sale) => (
          <div key={sale.id} className="rounded-xl border border-slate-200 p-3">
            <p className="font-semibold">{sale.product.name}</p>
            <p className="text-sm text-slate-600">{dateTime(sale.createdAt)}</p>
            <p className="text-sm text-slate-600">{sale.seller.name}</p>
            <p className="text-sm font-semibold">
              {sale.quantity} un  -  {money(sale.totalPrice)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}




