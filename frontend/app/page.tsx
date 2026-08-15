import HeroVideo from "@/components/HeroVideo";
import ProductsCarousel from "@/components/ProductsCarousel";
import CategoryCards from "@/components/CategoryCards";
import BrandsStrip from "@/components/BrandsStrip";
import PoliciesBanner from "@/components/PoliciesBanner";
import PaymentMethods from "@/components/PaymentMethods";
import { getBrands, getCategories, getProducts } from "@/lib/api";

export default async function Home() {
  const [popular, categories, brands, newArrivals] = await Promise.all([
    getProducts({ popular: true }).catch(() => []),
    getCategories().catch(() => []),
    getBrands().catch(() => []),
    getProducts({ isNew: true }).catch(() => []),
  ]);

  return (
    <>
      <HeroVideo />
      <ProductsCarousel title="Productos populares" products={popular} />
      <CategoryCards categories={categories} />
      <BrandsStrip brands={brands} />
      <ProductsCarousel title="Nuevo" products={newArrivals} />
      <PoliciesBanner />
      <PaymentMethods />
    </>
  );
}
