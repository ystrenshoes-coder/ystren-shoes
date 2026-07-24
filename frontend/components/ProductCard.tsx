import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";

export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];
  const inStock = product.sizes.some((s) => s.stock > 0);

  return (
    <Link
      href={`/producto/${product.id}`}
      className="group flex w-56 shrink-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/10"
    >
      <div className="relative aspect-square w-full bg-gray-100">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : null}
        {product.is_new ? (
          <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
            Nuevo
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.brand ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {product.brand}
          </span>
        ) : null}
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-auto text-lg font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>
        {!inStock ? (
          <span className="text-xs font-medium text-red-600">Agotado</span>
        ) : null}
      </div>
    </Link>
  );
}
