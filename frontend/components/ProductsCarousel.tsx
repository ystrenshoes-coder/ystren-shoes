"use client";

import { useRef } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/api";

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
    const card = trackRef.current?.querySelector<HTMLElement>("[data-card]");
    const step = card?.offsetWidth ?? 280;
    trackRef.current?.scrollBy({ left: direction * (step + 16), behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <Reveal>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h2>
          <Link
            href="/productos"
            className="shrink-0 text-sm font-semibold uppercase tracking-wide text-blue-600 transition hover:text-blue-700"
          >
            Ver más →
          </Link>
        </div>
      </Reveal>

      <div className="relative">
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {products.map((product, index) => (
            <Reveal key={product.id} delay={Math.min(index, 6) * 70} className="w-56 shrink-0">
              <div data-card>
                <ProductCard product={product} />
              </div>
            </Reveal>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label={`${title}: anterior`}
          className="absolute -left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-lg transition hover:border-blue-600 hover:text-blue-600 sm:flex"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label={`${title}: siguiente`}
          className="absolute -right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-lg transition hover:border-blue-600 hover:text-blue-600 sm:flex"
        >
          ›
        </button>
      </div>
    </section>
  );
}
