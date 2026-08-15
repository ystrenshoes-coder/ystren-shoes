import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandIntro from "@/components/BrandIntro";
import ProductCard from "@/components/ProductCard";
import { getBrands, getProducts } from "@/lib/api";
import { getBrandItem } from "@/lib/brands";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getBrandItem(slug);
  const brand = item ?? (await getBrands().catch(() => [])).find((b) => b.slug === slug);
  return { title: brand ? `${brand.name} | Ystren Shoes` : "Marca no encontrada | Ystren Shoes" };
}

export default async function MarcaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = getBrandItem(slug);

  const [brands, products] = await Promise.all([
    item ? Promise.resolve([]) : getBrands().catch(() => []),
    getProducts({ brand: slug }).catch(() => []),
  ]);

  const brand = item ?? brands.find((b) => b.slug === slug);
  if (!brand) {
    notFound();
  }

  return (
    <>
      <BrandIntro brandName={brand.name} brandImage={item?.image} />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="border-b border-gray-100 pb-5">
          <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">
            {brand.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        {products.length === 0 ? (
          <p className="mt-10 text-gray-600">Aun no hay productos disponibles para esta marca.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
