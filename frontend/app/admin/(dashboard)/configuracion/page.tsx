import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import CategoryCarouselManager from "@/components/admin/CategoryCarouselManager";
import { getCategories } from "@/lib/api";

export default async function ConfiguracionPage() {
  const categories = await getCategories().catch(() => []);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Configuracion del sitio</h1>
      <p className="mb-8 text-sm text-gray-500">
        Administra el contenido visible en la pagina principal.
      </p>
      <div className="mb-8">
        <CategoryCarouselManager categories={categories} />
      </div>
      <SiteSettingsForm />
    </div>
  );
}