"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/api";

export default function HamburgerMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span className="h-0.5 w-6 bg-gray-900" />
        <span className="h-0.5 w-6 bg-gray-900" />
        <span className="h-0.5 w-6 bg-gray-900" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav className="flex h-full w-72 flex-col bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold uppercase text-gray-900">Productos</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menu"
                className="text-2xl text-gray-500"
              >
                &times;
              </button>
            </div>
            <ul className="mt-6 flex flex-col gap-4">
              <li>
                <Link
                  href="/productos"
                  onClick={() => setOpen(false)}
                  className="text-base font-semibold text-gray-900 hover:text-orange-600"
                >
                  Todos los productos
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/productos?category=${category.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-base text-gray-700 hover:text-orange-600"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </>
  );
}
