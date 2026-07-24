-- Esquema completo de Ystren Shoes.
-- Ejecutar una sola vez en el SQL Editor de Supabase (proyecto nuevo).

-- ============================================================
-- Catalogo publico: categories, brands, products, product_images,
-- product_sizes. Lectura publica (using (true)), escritura solo
-- staff autenticado.
-- ============================================================

create table if not exists categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  image_url text,
  sort_order bigint,
  created_at timestamptz default now()
);

alter table categories enable row level security;

create policy "Public read categories" on categories
  for select using (true);

create policy "Authenticated write categories" on categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create table if not exists brands (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  logo_url text,
  sort_order bigint,
  created_at timestamptz default now()
);

alter table brands enable row level security;

create policy "Public read brands" on brands
  for select using (true);

create policy "Authenticated write brands" on brands
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category_id bigint references categories(id) on delete set null,
  brand_id bigint references brands(id) on delete set null,
  is_popular boolean not null default false,
  is_new boolean not null default false,
  sort_order bigint,
  created_at timestamptz default now()
);

alter table products enable row level security;

create policy "Public read products" on products
  for select using (true);

create policy "Authenticated write products" on products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create table if not exists product_images (
  id bigint generated always as identity primary key,
  product_id bigint not null references products(id) on delete cascade,
  image_url text not null,
  sort_order bigint not null default 0
);

alter table product_images enable row level security;

create policy "Public read product_images" on product_images
  for select using (true);

create policy "Authenticated write product_images" on product_images
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create table if not exists product_sizes (
  id bigint generated always as identity primary key,
  product_id bigint not null references products(id) on delete cascade,
  size text not null,
  stock integer not null default 0
);

alter table product_sizes enable row level security;

create policy "Public read product_sizes" on product_sizes
  for select using (true);

create policy "Authenticated write product_sizes" on product_sizes
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- Datos sensibles: orders, order_items. SIN policy publica en
-- absoluto (ni lectura ni escritura). El checkout crea/actualiza
-- ordenes desde el servidor (Route Handler de Next.js) con la
-- service_role key, que siempre ignora RLS. El panel admin las lee
-- con una sesion de staff autenticado.
-- ============================================================

create table if not exists orders (
  id bigint generated always as identity primary key,
  wompi_reference text not null unique,
  customer_name text not null,
  customer_id_number text,
  customer_email text not null,
  customer_phone text,
  customer_city text,
  shipping_address text,
  subtotal numeric(10, 2) not null,
  status text not null default 'pending',
  wompi_transaction_id text,
  created_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Authenticated read orders" on orders
  for select using (auth.role() = 'authenticated');

create policy "Authenticated write orders" on orders
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references orders(id) on delete cascade,
  product_id bigint references products(id) on delete set null,
  product_name text not null,
  size text,
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null
);

alter table order_items enable row level security;

create policy "Authenticated read order_items" on order_items
  for select using (auth.role() = 'authenticated');

create policy "Authenticated write order_items" on order_items
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create index if not exists products_sort_order_idx on products (sort_order);
create index if not exists orders_wompi_reference_idx on orders (wompi_reference);

-- ============================================================
-- Storage: bucket publico para fotos de producto/marca/categoria,
-- escritura solo staff autenticado.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public read media" on storage.objects
  for select using (bucket_id = 'media');

create policy "Authenticated write media" on storage.objects
  for all using (bucket_id = 'media' and auth.role() = 'authenticated')
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

-- ============================================================
-- Datos de ejemplo (placeholders) para poder ver el sitio
-- funcionando antes de que el cliente entregue catalogo real.
-- ============================================================

insert into categories (name, slug, image_url, sort_order) values
  ('Basketball', 'basketball', 'https://picsum.photos/seed/basketball/600/400', 1),
  ('Guayos', 'guayos', 'https://picsum.photos/seed/guayos/600/400', 2),
  ('Hombre', 'hombre', 'https://picsum.photos/seed/hombre/600/400', 3),
  ('Mujer', 'mujer', 'https://picsum.photos/seed/mujer/600/400', 4)
on conflict (slug) do nothing;

insert into brands (name, slug, logo_url, sort_order) values
  ('Nike', 'nike', 'https://picsum.photos/seed/nike/200/100', 1),
  ('Adidas', 'adidas', 'https://picsum.photos/seed/adidas/200/100', 2),
  ('Puma', 'puma', 'https://picsum.photos/seed/puma/200/100', 3),
  ('New Balance', 'new-balance', 'https://picsum.photos/seed/newbalance/200/100', 4)
on conflict (slug) do nothing;

insert into products (name, description, price, category_id, brand_id, is_popular, is_new, sort_order)
select
  'Tenis de ejemplo ' || s,
  'Producto de muestra, reemplazar por catalogo real desde el panel admin.',
  199900,
  (select id from categories order by sort_order limit 1 offset (s % 4)),
  (select id from brands order by sort_order limit 1 offset (s % 4)),
  (s % 3 = 0),
  (s % 4 = 0),
  s
from generate_series(1, 8) as s;

insert into product_images (product_id, image_url, sort_order)
select id, 'https://picsum.photos/seed/producto' || id || '/500/500', 1
from products;

insert into product_sizes (product_id, size, stock)
select p.id, size, 10
from products p, unnest(array['38', '39', '40', '41', '42']) as size;
