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

  const title = activeCategory?.name ?? activeBrand?.name ?? (search ? `Resultados para "${search}"` : "Todos los productos");

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {products.length} {products.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-gray-600">No encontramos productos con ese filtro.</p>
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
  );
}
