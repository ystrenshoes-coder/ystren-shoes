import { getCategories } from "@/lib/api";
import CategoriesManager from "@/components/admin/CategoriesManager";

export default async function AdminCategoriasPage() {
  const categories = await getCategories().catch(() => []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
      <p className="mt-1 text-sm text-gray-600">
        Basketball, Guayos, Hombre, Mujer, y las que agregues aqui aparecen en
        el menu hamburguesa y en las cards del inicio.
      </p>
      <div className="mt-6">
        <CategoriesManager categories={categories} />
      </div>
    </div>
  );
}
