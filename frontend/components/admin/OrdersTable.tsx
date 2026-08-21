"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrders } from "@/lib/api";
import type { Order } from "@/lib/api";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  declined: "Rechazado",
  error: "Error",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  error: "bg-gray-100 text-gray-800",
};

export default function OrdersTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const currentStatus = searchParams.get("status") ?? "";
  const currentSearch = searchParams.get("search") ?? "";

  useEffect(() => {
    setLoading(true);
    getOrders({
      status: currentStatus || undefined,
      search: currentSearch || undefined,
    })
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [currentStatus, currentSearch]);

  function setStatus(status: string) {
    const params = new URLSearchParams(searchParams);
    if (status) params.set("status", status);
    else params.delete("status");
    router.push(`/admin/pedidos?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = (form.get("q") as string) ?? "";
    const params = new URLSearchParams(searchParams);
    if (q) params.set("search", q);
    else params.delete("search");
    router.push(`/admin/pedidos?${params.toString()}`);
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Pedidos</h1>
      <p className="mb-6 text-sm text-gray-500">
        {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
      </p>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["", "pending", "approved", "declined"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                currentStatus === s || (!s && !currentStatus)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s ? STATUS_LABELS[s] : "Todos"}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            name="q"
            defaultValue={currentSearch}
            placeholder="Buscar nombre o C.C...."
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Buscar
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Cargando...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-500">No hay pedidos con ese filtro.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Cliente</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Ciudad</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Subtotal</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Estado</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer transition hover:bg-gray-50"
                  onClick={() => router.push(`/admin/pedidos/${order.id}`)}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">#{order.id}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {order.customer_name ?? "-"}
                    {order.customer_id_number ? (
                      <span className="ml-1 text-gray-400">C.C. {order.customer_id_number}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{order.shipping_city ?? "-"}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ${(order.subtotal ?? 0).toLocaleString("es-CO")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString("es-CO")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
