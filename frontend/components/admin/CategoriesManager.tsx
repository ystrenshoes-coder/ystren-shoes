"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/api";
import IconButton from "@/components/admin/IconButton";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadImage(file: File): Promise<string> {
  const supabase = createClient();
  const path = `categories/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
  if (uploadError) throw new Error("No se pudo subir la imagen: " + uploadError.message);
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setError(null);
    setLoading(true);

    let imageUrl: string | null = null;
    if (newImage) {
      try {
        imageUrl = await uploadImage(newImage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setLoading(false);
        return;
      }
    }

    const supabase = createClient();
    const { error: insertError } = await supabase.from("categories").insert({
      name: newName.trim(),
      slug: slugify(newName),
      image_url: imageUrl,
      sort_order: categories.length,
    });

    setLoading(false);
    if (insertError) {
      setError("No se pudo crear la categoria: " + insertError.message);
      return;
    }
    setNewName("");
    setNewImage(null);
    router.refresh();
  }

  async function handleRename(id: number) {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("categories")
      .update({ name: editName.trim(), slug: slugify(editName) })
      .eq("id", id);

    if (updateError) {
      setError("No se pudo renombrar: " + updateError.message);
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(category: Category) {
    if (!confirm(`Borrar la categoria "${category.name}"? Los productos que la usaban quedaran sin categoria.`)) {
      return;
    }
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("categories").delete().eq("id", category.id);
    if (deleteError) {
      alert("No se pudo borrar: " + deleteError.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {error ? <p className="px-5 pt-4 text-sm text-red-600">{error}</p> : null}

      <ul>
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex items-center justify-between gap-3 border-b border-gray-50 px-5 py-3.5"
          >
            <div className="flex flex-1 items-center gap-3">
              {category.image_url ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  <Image src={category.image_url} alt={category.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  {category.name.charAt(0).toUpperCase()}
                </div>
              )}

              {editingId === category.id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(category.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
              ) : (
                <span className="text-sm text-gray-700">{category.name}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editingId === category.id ? (
                <button
                  type="button"
                  onClick={() => handleRename(category.id)}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Guardar
                </button>
              ) : (
                <IconButton
                  variant="edit"
                  label="Renombrar categoria"
                  onClick={() => {
                    setEditingId(category.id);
                    setEditName(category.name);
                  }}
                />
              )}
              <IconButton variant="delete" label="Eliminar categoria" onClick={() => handleDelete(category)} />
            </div>
          </li>
        ))}
        {categories.length === 0 ? (
          <li className="px-5 py-6 text-sm text-gray-500">Todavia no hay categorias.</li>
        ) : null}
      </ul>

      <form onSubmit={handleCreate} className="flex flex-wrap gap-2 border-t border-gray-100 p-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nueva categoria"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files?.[0] ?? null)}
          className="w-full text-xs text-gray-500 sm:w-auto"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Agregar
        </button>
      </form>
    </div>
  );
}
