import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/api";

export default function CategoryCards({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="mb-4 text-2xl font-bold uppercase text-gray-900">
        Explora por categoria
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/productos?category=${category.slug}`}
            className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
          >
            {category.image_url ? (
              <Image
                src={category.image_url}
                alt={category.name}
                fill
                className="object-cover transition group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
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
