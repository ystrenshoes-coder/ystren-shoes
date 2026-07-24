import { getBrands } from "@/lib/api";
import BrandsManager from "@/components/admin/BrandsManager";

export default async function AdminMarcasPage() {
  const brands = await getBrands().catch(() => []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Marcas</h1>
      <p className="mt-1 text-sm text-gray-600">
        Aparecen en la franja &quot;Mejores marcas&quot; del inicio y como filtro de productos.
      </p>
      <div className="mt-6">
        <BrandsManager brands={brands} />
      </div>
    </div>
  );
}
