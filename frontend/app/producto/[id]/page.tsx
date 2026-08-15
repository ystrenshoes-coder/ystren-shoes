import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:grid-cols-2 lg:gap-16">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        ) : null}
        {product.is_new ? (
          <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Nuevo
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 py-2 lg:py-8">
        {product.brand ? (
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
            {product.brand}
          </span>
        ) : null}
        <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900 sm:text-4xl">
          {product.name}
        </h1>
        <p className="text-3xl font-black text-gray-900">{formatPrice(product.price)}</p>
        {product.description ? (
          <p className="max-w-md text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>
        ) : null}
        <div className="mt-4">
          <AddToCartButton product={product} />
        </div>
      </div>
    </section>
  );
}
