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

export type SiteSetting = {
  key: string;
  value: Record<string, unknown>;
  updated_at?: string | null;
};

export async function getSettings(): Promise<SiteSetting[]> {
  const res = await fetch(new URL("/settings", API_URL), { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar las configuraciones");
  return res.json();
}

export async function getSetting(key: string): Promise<SiteSetting> {
  const res = await fetch(new URL(`/settings/${key}`, API_URL), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Setting no encontrada");
  return res.json();
}

export async function updateSetting(
  key: string,
  value: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(new URL(`/settings/${key}`, API_URL), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error("No se pudo guardar la configuracion");
}

export type OrderItem = {
  id: number;
  product_name: string | null;
  size: string | null;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: number;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_id_number: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  status: string;
  subtotal: number;
  wompi_reference: string | null;
  created_at: string | null;
  items: OrderItem[];
};

export async function getOrders(filters?: {
  status?: string;
  search?: string;
}): Promise<Order[]> {
  const url = new URL("/orders", API_URL);
  if (filters?.status) url.searchParams.set("status", filters.status);
  if (filters?.search) url.searchParams.set("search", filters.search);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los pedidos");
  return res.json();
}

export async function getOrder(id: string): Promise<Order | null> {
  const res = await fetch(new URL(`/orders/${id}`, API_URL), {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("No se pudo cargar el pedido");
  return res.json();
}

export async function updateOrderStatus(
  id: number,
  status: string,
): Promise<void> {
  const res = await fetch(new URL(`/orders/${id}/status`, API_URL), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("No se pudo actualizar el estado");
}

export type AdminUser = {
  id: string;
  email: string;
  role: string;
  created_at: string | null;
  last_sign_in_at: string | null;
};

export async function getUsers(): Promise<AdminUser[]> {
  const res = await fetch("/api/users", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los usuarios");
  return res.json();
}

export async function createUser(
  email: string,
  password: string,
  role: string,
): Promise<void> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "No se pudo crear el usuario");
  }
}

export async function updateUserRole(
  userId: string,
  role: string,
): Promise<void> {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("No se pudo actualizar el rol");
}

export async function deleteUser(userId: string): Promise<void> {
  const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("No se pudo eliminar el usuario");
}
