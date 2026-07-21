export type ProductSize = {
  size: string;
  stock: number;
};

export type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  images: string[];
  category?: string | null;
  brand?: string | null;
  sizes: ProductSize[];
  is_popular: boolean;
  is_new: boolean;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  logo_url?: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getProducts(filters?: {
  category?: string;
  brand?: string;
  search?: string;
  popular?: boolean;
  isNew?: boolean;
  sort?: string;
}): Promise<Product[]> {
  const url = new URL("/products", API_URL);
  if (filters?.category) url.searchParams.set("category", filters.category);
  if (filters?.brand) url.searchParams.set("brand", filters.brand);
  if (filters?.search) url.searchParams.set("search", filters.search);
  if (filters?.popular !== undefined)
    url.searchParams.set("popular", String(filters.popular));
  if (filters?.isNew !== undefined)
    url.searchParams.set("is_new", String(filters.isNew));
  if (filters?.sort) url.searchParams.set("sort", filters.sort);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los productos");
  return res.json();
}

export async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(new URL(`/products/${id}`, API_URL), {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("No se pudo cargar el producto");
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(new URL("/categories", API_URL), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudieron cargar las categorias");
  return res.json();
}

export async function getBrands(): Promise<Brand[]> {
  const res = await fetch(new URL("/brands", API_URL), { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar las marcas");
  return res.json();
}
