import { getProducts } from "@/lib/api";
import ProductsTable from "@/components/admin/ProductsTable";

export default async function AdminProductosPage() {
  const products = await getProducts().catch(() => []);

  return <ProductsTable products={products} />;
}
