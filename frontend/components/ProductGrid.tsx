"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/api";

const COLUMNS = [2, 3, 4, 6] as const;
type ColumnOption = (typeof COLUMNS)[number];

const GRID_CLASSES: Record<ColumnOption, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
};

export default function ProductGrid({ products }: { products: Product[] }) {
  const [mode, setMode] = useState<"auto" | ColumnOption>("auto");

  const gridClass = mode === "auto" ? GRID_CLASSES[4] : GRID_CLASSES[mode];

  return (
    <div className="mt-8 w-full">
      <div className="mb-6 flex items-center justify-end gap-1">
        <span className="mr-2 text-xs font-medium text-gray-500">Ver:</span>
        <button
          type="button"
          onClick={() => setMode("auto")}
          className={`flex h-8 items-center rounded-md border px-3 text-xs font-semibold transition ${
            mode === "auto"
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-gray-200 text-gray-500 hover:border-gray-300"
          }`}
        >
          Auto
        </button>
        {COLUMNS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setMode(c)}
            aria-label={`Mostrar ${c} columnas`}
            className={`flex h-8 w-8 items-center justify-center rounded-md border text-xs font-semibold transition ${
              mode === c
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className={`grid gap-x-4 gap-y-10 ${gridClass}`}>
        {products.map((product) => (
          <div key={product.id} className="w-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
