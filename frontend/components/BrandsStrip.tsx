import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import type { Brand } from "@/lib/api";

type BrandItem = {
  src: string;
  name: string;
  slug: string;
};

const BRAND_ITEMS: BrandItem[] = [
  { src: "/marcas/Adidas.jpg", name: "Adidas", slug: "adidas" },
  { src: "/marcas/Amiri.jpg", name: "Amiri", slug: "amiri" },
  { src: "/marcas/Golden%20%20Goose.jpg", name: "Golden Goose", slug: "golden-goose" },
  { src: "/marcas/Jordan.jpg", name: "Jordan", slug: "jordan" },
  { src: "/marcas/Louis%20Vuitton.jpg", name: "Louis Vuitton", slug: "louis-vuitton" },
  { src: "/marcas/New%20Balance.jpg", name: "New Balance", slug: "new-balance" },
  { src: "/marcas/Puma.jpg", name: "Puma", slug: "puma" },
  { src: "/marcas/Reebok.jpg", name: "Reebok", slug: "reebok" },
  { src: "/marcas/Timberland.jpg", name: "Timberland", slug: "timberland" },
  { src: "/marcas/Vans.jpg", name: "Vans", slug: "vans" },
];

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
                key={`${item.src}-${index}`}
                href={brand ? `/marca/${brand.slug}` : "/productos"}
                className="mx-3"
              >
                <div className="group relative flex h-20 w-44 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 p-3 shadow-lg shadow-slate-900/25 ring-1 ring-slate-700/40 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-slate-500/60">
                  <Image
                    src={item.src}
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
