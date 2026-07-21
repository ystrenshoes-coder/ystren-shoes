import ProductCard from "@/components/ProductCard";
import { getBrands, getCategories, getProducts } from "@/lib/api";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; search?: string }>;
}) {
  const { category, brand, search } = await searchParams;

  const [products, categories, brands] = await Promise.all([
    getProducts({ category, brand, search }).catch(() => []),
    getCategories().catch(() => []),
    getBrands().catch(() => []),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);
  const activeBrand = brands.find((b) => b.slug === brand);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold uppercase text-gray-900">
        {activeCategory?.name ?? activeBrand?.name ?? (search ? `Resultados para "${search}"` : "Todos los productos")}
      </h1>

      {products.length === 0 ? (
        <p className="mt-6 text-gray-600">No encontramos productos con ese filtro.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
