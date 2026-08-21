import { formatPrice } from "@/lib/formatPrice";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function DineroPage() {
  const supabase = createAdminClient();

  const [ordersResult, allResult] = await Promise.all([
    supabase
      .from("orders")
      .select("id, customer_name, customer_email, status, subtotal, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("id, subtotal, status", { count: "exact" })
      .not("status", "eq", "declined")
      .not("status", "eq", "error"),
  ]);

  const orders = ordersResult.data ?? [];
  const activeOrders = allResult.data ?? [];

  const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.subtotal ?? 0), 0);
  const approvedTotal = activeOrders
    .filter((o) => o.status === "approved")
    .reduce((sum, o) => sum + (o.subtotal ?? 0), 0);
  const pendingTotal = activeOrders
    .filter((o) => o.status === "pending")
    .reduce((sum, o) => sum + (o.subtotal ?? 0), 0);
  const totalOrders = activeOrders.length;
  const approvedCount = activeOrders.filter((o) => o.status === "approved").length;

  const stats = [
    { label: "Ingresos totales", value: formatPrice(totalRevenue), color: "text-gray-900" },
    { label: "Aprobados", value: formatPrice(approvedTotal), sub: `${approvedCount} pedidos`, color: "text-green-600" },
    { label: "Pendientes", value: formatPrice(pendingTotal), sub: `${totalOrders - approvedCount} pedidos`, color: "text-yellow-600" },
  ];

  const STATUS_LABELS: Record<string, string> = {
    pending: "Pendiente",
    approved: "Aprobado",
    declined: "Rechazado",
    error: "Error",
  };

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
    error: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mi dinero</h1>
      <p className="mt-1 text-sm text-gray-600">Resumen de todas las ventas de la tienda.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`mt-2 text-2xl font-bold ${s.color}`}>{s.value}</p>
            {s.sub ? <p className="mt-1 text-xs text-gray-400">{s.sub}</p> : null}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900">Todos los pedidos</h2>

        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">No hay pedidos registrados.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Cliente</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Correo</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Total</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{order.id}</td>
                    <td className="px-4 py-3 text-gray-700">{order.customer_name ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500">{order.customer_email ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(order.subtotal)}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString("es-CO") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
