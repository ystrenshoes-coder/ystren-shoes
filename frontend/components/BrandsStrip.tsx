import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@/lib/api";

export default function BrandsStrip({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="bg-black py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-6 text-center text-2xl font-bold uppercase text-white">
          Mejores marcas
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/productos?brand=${brand.slug}`}
              className="flex h-16 w-32 items-center justify-center opacity-80 transition hover:opacity-100"
            >
              {brand.logo_url ? (
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  width={128}
                  height={64}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-lg font-bold uppercase text-white">
                  {brand.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
