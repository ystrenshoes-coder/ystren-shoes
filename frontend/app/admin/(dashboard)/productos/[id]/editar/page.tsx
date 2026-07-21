import { notFound } from "next/navigation";
import { getBrands, getCategories, getProduct } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    getProduct(id),
    getCategories().catch(() => []),
    getBrands().catch(() => []),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
      <div className="mt-6">
        <ProductForm product={product} categories={categories} brands={brands} />
      </div>
    </div>
  );
}
