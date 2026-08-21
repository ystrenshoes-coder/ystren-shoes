import { getProducts, getCategories, getBrands } from "@/lib/api";
import InventarioTabs from "@/components/admin/InventarioTabs";

export default async function InventarioPage() {
  const [products, categories, brands] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
    getBrands().catch(() => []),
  ]);

  return <InventarioTabs products={products} categories={categories} brands={brands} />;
}
