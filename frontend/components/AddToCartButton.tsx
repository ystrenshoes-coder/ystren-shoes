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
    return <p className="text-sm font-semibold text-red-600">Agotado</p>;
  }

  function handleAdd() {
    if (!size) return;
    addItem(product, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {availableSizes.map((s) => (
          <button
            key={s.size}
            type="button"
            onClick={() => setSize(s.size)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              size === s.size
                ? "border-orange-600 bg-orange-600 text-white"
                : "border-gray-300 text-gray-700 hover:border-orange-600"
            }`}
          >
            {s.size}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="w-full rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
      >
        {added ? "Agregado!" : "Agregar al carrito"}
      </button>
    </div>
  );
}
