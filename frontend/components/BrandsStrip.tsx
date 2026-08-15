import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import type { Brand } from "@/lib/api";

export default function BrandsStrip({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  const loop = [...brands, ...brands];

  return (
    <section className="border-y border-gray-100 bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <h2 className="text-center text-2xl font-black uppercase tracking-tight text-gray-900 sm:text-3xl">
            Mejores <span className="text-blue-600">marcas</span>
          </h2>
        </Reveal>
      </div>
      <div className="marquee-pause mt-8 overflow-hidden">
        <div
          className="flex w-max animate-marquee items-center"
          style={{ "--marquee-duration": "28s" } as CSSProperties}
        >
          {loop.map((brand, index) => (
            <Link
              key={`${brand.id}-${index}`}
              href={`/productos?brand=${brand.slug}`}
              className="mx-8 flex h-20 w-40 items-center justify-center"
            >
              {brand.logo_url ? (
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  width={160}
                  height={80}
                  className="h-full w-full object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              ) : (
                <span className="text-lg font-black uppercase tracking-wider text-gray-400 transition hover:text-gray-900">
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
