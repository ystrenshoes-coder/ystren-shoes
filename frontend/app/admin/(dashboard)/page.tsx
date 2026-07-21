import Link from "next/link";
import { getBrands, getCategories, getProducts } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [products, categories, brands, { count: pendingOrders }] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
    getBrands().catch(() => []),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const cards = [
    { label: "Productos publicados", value: products.length, href: "/admin/productos" },
    { label: "Categorias", value: categories.length, href: "/admin/categorias" },
    { label: "Marcas", value: brands.length, href: "/admin/marcas" },
    { label: "Pedidos pendientes", value: pendingOrders ?? 0, href: "/admin/pedidos" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-600">Resumen general de la tienda.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
