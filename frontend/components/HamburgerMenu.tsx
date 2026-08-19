"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/api";
import Logo from "@/components/Logo";

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
        <span className="h-0.5 w-6 rounded bg-gray-900" />
        <span className="h-0.5 w-6 rounded bg-gray-900" />
        <span className="h-0.5 w-6 rounded bg-gray-900" />
      </button>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <nav
          className={`absolute left-0 top-0 flex h-full w-72 flex-col bg-white p-6 shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menu"
              className="text-2xl text-gray-400 transition hover:text-gray-900"
            >
              &times;
            </button>
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-blue-600">
            Navegacion
          </p>
          <ul className="mt-3 flex flex-col gap-4">
            <li>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="text-base font-semibold text-gray-900 transition hover:text-blue-600"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/productos"
                onClick={() => setOpen(false)}
                className="text-base font-semibold text-gray-900 transition hover:text-blue-600"
              >
                Todos los productos
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/productos?category=${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="text-base text-gray-600 transition hover:text-blue-600"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
