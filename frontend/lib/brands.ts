export type BrandItem = {
  slug: string;
  name: string;
  image: string;
};

export const BRAND_ITEMS: BrandItem[] = [
  { slug: "adidas", name: "Adidas", image: "/marcas/Adidas.jpg" },
  { slug: "amiri", name: "Amiri", image: "/marcas/Amiri.jpg" },
  { slug: "golden-goose", name: "Golden Goose", image: "/marcas/Golden%20%20Goose.jpg" },
  { slug: "jordan", name: "Jordan", image: "/marcas/Jordan.jpg" },
  { slug: "louis-vuitton", name: "Louis Vuitton", image: "/marcas/Louis%20Vuitton.jpg" },
  { slug: "new-balance", name: "New Balance", image: "/marcas/New%20Balance.jpg" },
  { slug: "puma", name: "Puma", image: "/marcas/Puma.jpg" },
  { slug: "reebok", name: "Reebok", image: "/marcas/Reebok.jpg" },
  { slug: "timberland", name: "Timberland", image: "/marcas/Timberland.jpg" },
  { slug: "vans", name: "Vans", image: "/marcas/Vans.jpg" },
];

export function getBrandItem(slug: string): BrandItem | undefined {
  return BRAND_ITEMS.find((item) => item.slug === slug);
}
