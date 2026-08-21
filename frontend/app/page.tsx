import HeroVideo from "@/components/HeroVideo";
import ProductsCarousel from "@/components/ProductsCarousel";
import CategoryCards from "@/components/CategoryCards";
import BrandsStrip from "@/components/BrandsStrip";
import PoliciesBanner from "@/components/PoliciesBanner";
import PaymentMethods from "@/components/PaymentMethods";
import { getBrands, getCategories, getProducts, getSettings } from "@/lib/api";

export default async function Home() {
  const [popular, categories, brands, newArrivals, settings] = await Promise.all([
    getProducts({ popular: true }).catch(() => []),
    getCategories().catch(() => []),
    getBrands().catch(() => []),
    getProducts({ isNew: true }).catch(() => []),
    getSettings().catch(() => []),
  ]);

  const s = Object.fromEntries(settings.map((item) => [item.key, item.value]));

  return (
    <>
      <HeroVideo
        videoUrl={s.hero_video_url?.url as string}
        imageUrl={s.hero_image?.url as string}
        title={s.hero_title?.text as string}
        subtitle={s.hero_subtitle?.text as string}
      />
      <ProductsCarousel title="Productos populares" products={popular} />
      <CategoryCards categories={categories} />
      <BrandsStrip brands={brands} />
      <ProductsCarousel title="Nuevo" products={newArrivals} />
      <PoliciesBanner />
      <PaymentMethods />
    </>
  );
}
