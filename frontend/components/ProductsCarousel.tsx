"use client";

import { useRef } from "react";
import type { Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function ProductsCarousel({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scrollBy(direction: 1 | -1) {
    trackRef.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="mb-4 text-2xl font-bold uppercase text-gray-900">
        {title}
        <span className="text-blue-600">.</span>
      </h2>
      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none]"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label={`${title}: anterior`}
          className="absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-blue-700 shadow-md ring-1 ring-slate-200 hover:bg-blue-600 hover:text-white sm:flex"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label={`${title}: siguiente`}
          className="absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-blue-700 shadow-md ring-1 ring-slate-200 hover:bg-blue-600 hover:text-white sm:flex"
        >
          ›
        </button>
      </div>
    </section>
  );
}
