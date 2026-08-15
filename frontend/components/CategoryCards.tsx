import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { Category } from "@/lib/api";

const LOCAL_IMAGES: Record<string, string> = {
  basketball: "/categorias/basket.jpg",
  guayos: "/categorias/guayos.jpg",
  hombre: "/categorias/hombre.jpg",
  mujer: "/categorias/mujer.jpg",
};

export default function CategoryCards({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <Reveal>
        <h2 className="text-center text-2xl font-black uppercase tracking-tight text-gray-900 sm:text-3xl">
          Explora por <span className="text-blue-600">categoria</span>
        </h2>
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.map((category, index) => (
          <Reveal key={category.id} delay={index * 90}>
            <Link
              href={`/productos?category=${category.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100"
            >
              {(LOCAL_IMAGES[category.slug] ?? category.image_url) ? (
                <Image
                  src={LOCAL_IMAGES[category.slug] ?? category.image_url!}
                  alt={category.name}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-contain transition duration-700 ease-out group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition group-hover:from-black/80" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="block break-words text-base font-bold uppercase leading-tight tracking-normal text-white sm:text-lg">
                  {category.name}
                </span>
              </div>
              <span className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
