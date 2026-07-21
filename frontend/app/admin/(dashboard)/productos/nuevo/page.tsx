import { getBrands, getCategories } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";

export default async function NuevoProductoPage() {
  const [categories, brands] = await Promise.all([
    getCategories().catch(() => []),
    getBrands().catch(() => []),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
      <div className="mt-6">
        <ProductForm categories={categories} brands={brands} />
      </div>
    </div>
  );
}
