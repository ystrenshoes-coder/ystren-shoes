"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Brand, Category, Product } from "@/lib/api";

const MAX_IMAGES = 6;
const DEFAULT_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43"];

type GalleryImage = {
  key: string;
  url: string;
  file?: File;
};

type SizeRow = {
  size: string;
  stock: string;
};

export default function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: Product;
  categories: Category[];
  brands: Brand[];
}) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [isPopular, setIsPopular] = useState(product?.is_popular ?? false);
  const [isNew, setIsNew] = useState(product?.is_new ?? false);
  const [images, setImages] = useState<GalleryImage[]>(
    (product?.images ?? []).map((url) => ({ key: url, url }))
  );
  const [sizes, setSizes] = useState<SizeRow[]>(
    DEFAULT_SIZES.map((size) => ({
      size,
      stock: String(product?.sizes.find((s) => s.size === size)?.stock ?? 0),
    }))
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initialCategory = categories.find((c) => c.slug === product?.category);
  const [categoryId, setCategoryId] = useState(initialCategory ? String(initialCategory.id) : "");
  const initialBrand = brands.find((b) => b.slug === product?.brand);
  const [brandId, setBrandId] = useState(initialBrand ? String(initialBrand.id) : "");

  function handleAddFiles(fileList: FileList | null) {
    if (!fileList) return;
    const room = MAX_IMAGES - images.length;
    const files = Array.from(fileList).slice(0, room);
    const newImages = files.map((file) => ({
      key: `${file.name}-${file.lastModified}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((current) => [...current, ...newImages]);
  }

  function handleRemoveImage(key: string) {
    setImages((current) => current.filter((img) => img.key !== key));
  }

  function updateSizeStock(size: string, stock: string) {
    setSizes((current) => current.map((row) => (row.size === size ? { ...row, stock } : row)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError("Sube al menos una foto del producto.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const finalUrls: string[] = [];
    for (const img of images) {
      if (img.file) {
        const path = `products/${Date.now()}-${img.file.name}`;
        const { error: uploadError } = await supabase.storage.from("media").upload(path, img.file);

        if (uploadError) {
          setError("No se pudo subir una imagen: " + uploadError.message);
          setLoading(false);
          return;
        }

        const { data } = supabase.storage.from("media").getPublicUrl(path);
        finalUrls.push(data.publicUrl);
      } else {
        finalUrls.push(img.url);
      }
    }

    const payload = {
      name,
      description: description || null,
      price: parseFloat(price),
      category_id: categoryId ? parseInt(categoryId, 10) : null,
      brand_id: brandId ? parseInt(brandId, 10) : null,
      is_popular: isPopular,
      is_new: isNew,
    };

    let productId = product?.id;

    if (productId) {
      const { error: updateError } = await supabase.from("products").update(payload).eq("id", productId);

      if (updateError) {
        setError("No se pudo guardar el producto: " + updateError.message);
        setLoading(false);
        return;
      }

      await supabase.from("product_images").delete().eq("product_id", productId);
      await supabase.from("product_sizes").delete().eq("product_id", productId);
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("products")
        .insert(payload)
        .select()
        .single();

      if (insertError || !inserted) {
        setError("No se pudo guardar el producto: " + (insertError?.message ?? "error desconocido"));
        setLoading(false);
        return;
      }
      productId = inserted.id;
    }

    const { error: imagesError } = await supabase.from("product_images").insert(
      finalUrls.map((url, index) => ({
        product_id: productId,
        image_url: url,
        sort_order: index,
      }))
    );

    if (imagesError) {
      setError("No se pudieron guardar las fotos: " + imagesError.message);
      setLoading(false);
      return;
    }

    const { error: sizesError } = await supabase.from("product_sizes").insert(
      sizes
        .filter((row) => Number(row.stock) > 0)
        .map((row) => ({
          product_id: productId,
          size: row.size,
          stock: parseInt(row.stock, 10),
        }))
    );

    if (sizesError) {
      setError("No se pudieron guardar las tallas: " + sizesError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
      <div>
        <label className="text-sm font-medium text-gray-700">Nombre</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Descripcion</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Precio</label>
        <input
          required
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Categoria</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Elige una categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Marca</label>
          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Sin marca</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} />
          Producto popular
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
          Producto nuevo
        </label>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Tallas y stock</label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {sizes.map((row) => (
            <div key={row.size} className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-600">{row.size}</span>
              <input
                type="number"
                min="0"
                value={row.stock}
                onChange={(e) => updateSizeStock(row.size, e.target.value)}
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-center text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Fotos del producto ({images.length}/{MAX_IMAGES}) - minimo 1
        </label>

        {images.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((img) => (
              <div key={img.key} className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                <Image
                  src={img.url}
                  alt={name || "Producto"}
                  fill
                  unoptimized={Boolean(img.file)}
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img.key)}
                  aria-label="Quitar foto"
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {images.length < MAX_IMAGES ? (
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              handleAddFiles(e.target.files);
              e.target.value = "";
            }}
            className="mt-2 w-full text-sm"
          />
        ) : (
          <p className="mt-2 text-xs text-gray-500">Ya tienes el maximo de {MAX_IMAGES} fotos.</p>
        )}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
