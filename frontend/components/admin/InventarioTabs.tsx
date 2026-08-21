"use client";

import { useState } from "react";
import ProductsTable from "@/components/admin/ProductsTable";
import CategoriesManager from "@/components/admin/CategoriesManager";
import BrandsManager from "@/components/admin/BrandsManager";
import type { Product, Category, Brand } from "@/lib/api";

const TABS = [
  { id: "productos", label: "Productos", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { id: "categorias", label: "Categorias", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { id: "marcas", label: "Marcas", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
];

export default function InventarioTabs({
  products,
  categories,
  brands,
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
}) {
  const [active, setActive] = useState("productos");

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-1" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
                active === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
              <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                active === tab.id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
              }`}>
                {tab.id === "productos" ? products.length : tab.id === "categorias" ? categories.length : brands.length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {active === "productos" ? <ProductsTable products={products} /> : null}
        {active === "categorias" ? (
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
            <p className="mt-1 text-sm text-gray-600">
              Basketball, Guayos, Hombre, Mujer. Aparecen en el menu y cards del inicio.
            </p>
            <div className="mt-6">
              <CategoriesManager categories={categories} />
            </div>
          </div>
        ) : null}
        {active === "marcas" ? (
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marcas</h1>
            <p className="mt-1 text-sm text-gray-600">
              Aparecen en la franja &quot;Mejores marcas&quot; del inicio y como filtro de productos.
            </p>
            <div className="mt-6">
              <BrandsManager brands={brands} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
