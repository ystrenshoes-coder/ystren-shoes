"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

export default function CartBadge() {
  const { totalCount } = useCart();

  return (
    <Link href="/carrito" className="relative text-blue-100 hover:text-white" aria-label="Ver carrito">
      <span className="text-xl">🛒</span>
      {totalCount > 0 ? (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {totalCount}
        </span>
      ) : null}
    </Link>
  );
}
