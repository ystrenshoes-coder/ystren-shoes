"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/api";

export default function CategoryCarouselManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Category[]>(categories);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  async function persistOrder(ordered: Category[]) {
    const supabase = createClient();
    const updates = ordered.map((category, index) =>
      supabase
        .from("categories")
        .update({ sort_order: index })
        .eq("id", category.id)
    );
    const results = await Promise.all(updates);
    const firstError = results.find((r) => r.error)?.error;
    if (firstError) {
      setError("No se pudo guardar el orden: " + firstError.message);
      return false;
    }
    router.refresh();
    return true;
  }

  function move(index: number, direction: -1 | 1) {
    setError(null);
    setSaved(false);
    setSaving(true);
    const target = index + direction;
    if (target < 0 || target >= items.length) {
      setSaving(false);
      return;
    }
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setItems(copy);
    persistOrder(copy).then(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Explora por categoria</h3>
        <p className="mt-0.5 text-xs text-gray-400">
          Reordena las categorias para definir como se ven en el carrusel de la pagina principal. El orden se guarda al
          mover cada una.
        </p>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="flex flex-col gap-2">
        {items.map((category, index) => (
          <li
            key={category.id}
            className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5"
          >
            <span className="w-6 text-center text-sm font-bold text-gray-400">{index + 1}</span>
            {category.image_url ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image src={category.image_url} alt={category.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-600">
                {category.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="flex-1 truncate text-sm font-medium text-gray-700">{category.name}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={index === 0 || saving}
                onClick={() => move(index, -1)}
                aria-label="Subir categoria"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index === items.length - 1 || saving}
                onClick={() => move(index, 1)}
                aria-label="Bajar categoria"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="rounded-lg border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500">
            No hay categorias para reordenar.
          </li>
        ) : null}
      </ul>

      {saved ? (
        <p className="mt-3 text-sm font-medium text-green-600">Orden guardado</p>
      ) : null}
    </div>
  );
}