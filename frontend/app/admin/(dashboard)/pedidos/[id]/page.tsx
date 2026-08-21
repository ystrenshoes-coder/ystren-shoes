"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { getOrder, updateOrderStatus } from "@/lib/api";
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

export default function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    if (!order) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrder({ ...order, status: newStatus });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Cargando pedido...</p>;
  if (!order) return <p className="text-sm text-red-600">Pedido no encontrado.</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        &larr; Volver a pedidos
      </button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.id}</h1>
        <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100"}`}>
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Datos del cliente
          </h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-gray-500">Nombre</dt>
              <dd className="font-medium text-gray-900">{order.customer_name ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">C.C.</dt>
              <dd className="font-medium text-gray-900">{order.customer_id_number ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{order.customer_email ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Telefono</dt>
              <dd className="font-medium text-gray-900">{order.customer_phone ?? "-"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Envio
          </h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-gray-500">Direccion</dt>
              <dd className="font-medium text-gray-900">{order.shipping_address ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Ciudad</dt>
              <dd className="font-medium text-gray-900">{order.shipping_city ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Referencia Wompi</dt>
              <dd className="font-medium text-gray-900 break-all">{order.wompi_reference ?? "-"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Productos
        </h2>
        {order.items && order.items.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                <th className="pb-2 font-semibold">Producto</th>
                <th className="pb-2 font-semibold">Talla</th>
                <th className="pb-2 font-semibold text-right">Cant.</th>
                <th className="pb-2 font-semibold text-right">Precio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 text-gray-900">{item.product_name ?? `Producto #${item.id}`}</td>
                  <td className="py-2 text-gray-600">{item.size ?? "-"}</td>
                  <td className="py-2 text-right text-gray-900">{item.quantity}</td>
                  <td className="py-2 text-right font-medium text-gray-900">
                    ${(item.unit_price ?? 0).toLocaleString("es-CO")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-500">Sin items registrados.</p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm font-semibold text-gray-700">Subtotal</span>
          <span className="text-lg font-bold text-gray-900">
            ${(order.subtotal ?? 0).toLocaleString("es-CO")}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Cambiar estado
        </h2>
        <div className="flex flex-wrap gap-3">
          {["pending", "approved", "declined"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              disabled={saving || order.status === s}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                order.status === s
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              } disabled:opacity-50`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        {saved ? (
          <p className="mt-3 text-sm font-medium text-green-600">Estado actualizado</p>
        ) : null}
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Creado: {order.created_at ? new Date(order.created_at).toLocaleString("es-CO") : "-"}
      </div>
    </div>
  );
}
