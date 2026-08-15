"use client";

import { useState } from "react";
import type { Product } from "@/lib/api";
import { useCart } from "@/lib/cart/CartContext";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const availableSizes = product.sizes.filter((s) => s.stock > 0);
  const [size, setSize] = useState(availableSizes[0]?.size ?? "");
  const [added, setAdded] = useState(false);

  if (availableSizes.length === 0) {
    return <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Agotado</p>;
  }

  function handleAdd() {
    if (!size) return;
    addItem(product, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex max-w-sm flex-col gap-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          Talla
        </p>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((s) => (
            <button
              key={s.size}
              type="button"
              onClick={() => setSize(s.size)}
              className={`min-w-12 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                size === s.size
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              {s.size}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {added ? "Agregado!" : "Agregar al carrito"}
      </button>
    </div>
  );
}
