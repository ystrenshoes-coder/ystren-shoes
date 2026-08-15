import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";

export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];
  const hoverImage = product.images[1];
  const inStock = product.sizes.some((s) => s.stock > 0);

  return (
    <Link href={`/producto/${product.id}`} className="group relative flex w-full flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        ) : null}
        {hoverImage ? (
          <Image
            src={hoverImage}
            alt=""
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="absolute inset-0 object-cover opacity-0 transition duration-500 ease-out group-hover:opacity-100"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/5" />

        {product.is_new ? (
          <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Nuevo
          </span>
        ) : null}

        {!inStock ? (
          <span className="absolute right-3 top-3 rounded-full bg-gray-900/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
            Agotado
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1 pt-3">
        {product.brand ? (
          <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">
            {product.brand}
          </span>
        ) : null}
        <h3 className="text-sm font-semibold leading-snug text-gray-900 transition group-hover:text-blue-700">
          {product.name}
        </h3>
        <p className="mt-auto pt-1 text-base font-black text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
