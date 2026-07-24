import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/formatPrice";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  approved: "Pagado",
  declined: "Rechazado",
  error: "Error",
};

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  error: "bg-red-100 text-red-700",
};

export default async function AdminPedidosPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, customer_name, customer_email, customer_phone, subtotal, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
      <p className="mt-1 text-sm text-gray-600">
        Los pedidos se crean cuando un cliente inicia el pago en el carrito y
        se marcan como &quot;Pagado&quot; cuando Wompi confirma la transaccion.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Subtotal</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr key={order.id} className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-600">
                  {new Date(order.created_at).toLocaleString("es-CO")}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{order.customer_name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {order.customer_email}
                  {order.customer_phone ? ` · ${order.customer_phone}` : ""}
                </td>
                <td className="px-4 py-3 text-gray-600">{formatPrice(order.subtotal)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(orders ?? []).length === 0 ? (
          <p className="px-4 py-6 text-center text-gray-500">Todavia no hay pedidos.</p>
        ) : null}
      </div>
    </div>
  );
}
