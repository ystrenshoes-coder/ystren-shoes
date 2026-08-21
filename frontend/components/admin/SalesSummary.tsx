"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/formatPrice";

type DaySales = { day: string; label: string; total: number; count: number };

export default function SalesSummary() {
  const [days, setDays] = useState<DaySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sales/weekly")
      .then((r) => r.json())
      .then(setDays)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxTotal = Math.max(...days.map((d) => d.total), 1);
  const weekTotal = days.reduce((s, d) => s + d.total, 0);
  const weekCount = days.reduce((s, d) => s + d.count, 0);

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando ventas de la semana...</p>;
  }

  if (days.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Ventas de la semana</h2>
          <p className="mt-1 text-2xl font-bold text-gray-900">{formatPrice(weekTotal)}</p>
          <p className="text-xs text-gray-500">{weekCount} {weekCount === 1 ? "pedido" : "pedidos"}</p>
        </div>
      </div>

      <div className="mt-5 flex items-end gap-2" style={{ height: 120 }}>
        {days.map((d) => {
          const pct = d.total > 0 ? Math.max((d.total / maxTotal) * 100, 8) : 0;
          return (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-gray-500">
                {d.total > 0 ? formatPrice(d.total) : ""}
              </span>
              <div
                className={`w-full rounded-t-md transition-all ${
                  d.total > 0 ? "bg-blue-600" : "bg-gray-100"
                }`}
                style={{ height: `${pct}%`, minHeight: d.total > 0 ? 8 : 2 }}
              />
              <span className="text-[10px] font-medium text-gray-500">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
