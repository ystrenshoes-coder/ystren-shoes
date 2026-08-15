import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import { BRAND_ITEMS } from "@/lib/brands";
import type { Brand } from "@/lib/api";

export default function BrandsStrip({ brands = [] }: { brands?: Brand[] }) {
  const loop = [...BRAND_ITEMS, ...BRAND_ITEMS];

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
          className="flex w-max animate-marquee items-center py-2"
          style={{ "--marquee-duration": "28s" } as CSSProperties}
        >
          {loop.map((item, index) => {
            const brand = brands.find((b) => b.slug === item.slug);
            return (
              <Link
                key={`${item.slug}-${index}`}
                href={`/marca/${item.slug}`}
                className="mx-3"
              >
                <div className="group relative flex h-20 w-44 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 p-3 shadow-lg shadow-slate-900/25 ring-1 ring-slate-700/40 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-slate-500/60">
                  <Image
                    src={item.image}
                    alt={brand?.name ?? item.name}
                    fill
                    sizes="176px"
                    className="object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
