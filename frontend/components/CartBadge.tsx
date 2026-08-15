"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

export default function CartBadge() {
  const { totalCount } = useCart();

  return (
    <Link
      href="/carrito"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-900 transition hover:bg-gray-100 hover:text-blue-600"
      aria-label="Ver carrito"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M6 6h15l-1.68 8.39A2 2 0 0 1 17.36 16H8.78a2 2 0 0 1-1.97-1.67L5 4H3" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="17.5" cy="20" r="1.5" />
      </svg>
      {totalCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
          {totalCount}
        </span>
      ) : null}
    </Link>
  );
}
