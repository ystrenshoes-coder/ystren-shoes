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
    <section className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-3">
        {product.brand ? (
          <span className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            {product.brand}
          </span>
        ) : null}
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>
        {product.description ? (
          <p className="text-sm text-gray-600">{product.description}</p>
        ) : null}
        <div className="mt-4">
          <AddToCartButton product={product} />
        </div>
      </div>
    </section>
  );
}
