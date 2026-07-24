"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Brand } from "@/lib/api";
import IconButton from "@/components/admin/IconButton";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadLogo(file: File): Promise<string> {
  const supabase = createClient();
  const path = `brands/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
  if (uploadError) throw new Error("No se pudo subir el logo: " + uploadError.message);
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export default function BrandsManager({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setError(null);
    setLoading(true);

    let logoUrl: string | null = null;
    if (newLogo) {
      try {
        logoUrl = await uploadLogo(newLogo);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setLoading(false);
        return;
      }
    }

    const supabase = createClient();
    const { error: insertError } = await supabase.from("brands").insert({
      name: newName.trim(),
      slug: slugify(newName),
      logo_url: logoUrl,
      sort_order: brands.length,
    });

    setLoading(false);
    if (insertError) {
      setError("No se pudo crear la marca: " + insertError.message);
      return;
    }
    setNewName("");
    setNewLogo(null);
    router.refresh();
  }

  async function handleRename(id: number) {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("brands")
      .update({ name: editName.trim(), slug: slugify(editName) })
      .eq("id", id);

    if (updateError) {
      setError("No se pudo renombrar: " + updateError.message);
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(brand: Brand) {
    if (!confirm(`Borrar la marca "${brand.name}"? Los productos que la usaban quedaran sin marca.`)) {
      return;
    }
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("brands").delete().eq("id", brand.id);
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
        {brands.map((brand) => (
          <li key={brand.id} className="flex items-center justify-between gap-3 border-b border-gray-50 px-5 py-3.5">
            <div className="flex flex-1 items-center gap-3">
              {brand.logo_url ? (
                <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
                  <Image src={brand.logo_url} alt={brand.name} fill className="object-contain" />
                </div>
              ) : (
                <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-600">
                  {brand.name}
                </div>
              )}

              {editingId === brand.id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(brand.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
              ) : (
                <span className="text-sm text-gray-700">{brand.name}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editingId === brand.id ? (
                <button
                  type="button"
                  onClick={() => handleRename(brand.id)}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Guardar
                </button>
              ) : (
                <IconButton
                  variant="edit"
                  label="Renombrar marca"
                  onClick={() => {
                    setEditingId(brand.id);
                    setEditName(brand.name);
                  }}
                />
              )}
              <IconButton variant="delete" label="Eliminar marca" onClick={() => handleDelete(brand)} />
            </div>
          </li>
        ))}
        {brands.length === 0 ? (
          <li className="px-5 py-6 text-sm text-gray-500">Todavia no hay marcas.</li>
        ) : null}
      </ul>

      <form onSubmit={handleCreate} className="flex flex-wrap gap-2 border-t border-gray-100 p-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nueva marca"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewLogo(e.target.files?.[0] ?? null)}
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
