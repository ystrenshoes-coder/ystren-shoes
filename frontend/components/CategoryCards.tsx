import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/api";

export default function CategoryCards({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="mb-4 text-2xl font-bold uppercase text-gray-900">
        Explora por <span className="text-blue-600">categoria</span>
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/productos?category=${category.slug}`}
            className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-transparent transition hover:ring-blue-500"
          >
            {category.image_url ? (
              <Image
                src={category.image_url}
                alt={category.name}
                fill
                className="object-cover transition group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <span className="text-lg font-bold uppercase text-white">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
