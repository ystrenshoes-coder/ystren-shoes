"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BRAND_ITEMS } from "@/lib/brands";
import IconButton from "@/components/admin/IconButton";

async function uploadLogo(file: File): Promise<string> {
  const supabase = createClient();
  const path = `brands/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
  if (uploadError) throw new Error("No se pudo subir el logo: " + uploadError.message);
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export default function BrandsManager() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<{ slug: string; name: string } | null>(null);

  async function saveLogo(slug: string, name: string, file: File) {
    setError(null);
    try {
      const url = await uploadLogo(file);
      const supabase = createClient();
      await supabase.from("brands").upsert(
        { slug, name, logo_url: url },
        { onConflict: "slug" }
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error subiendo el logo");
    }
  }

  async function saveRename() {
    if (!renaming || !renaming.name.trim()) {
      setRenaming(null);
      return;
    }
    setError(null);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("brands")
      .update({ name: renaming.name.trim() })
      .eq("slug", renaming.slug);
    if (dbError) {
      setError("No se pudo guardar: " + dbError.message);
      return;
    }
    setRenaming(null);
    router.refresh();
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">
        Estas son las marcas tal como aparecen en la franja &quot;Mejores marcas&quot; de la pagina
        principal. Cambia el nombre o sube un logo nuevo para actualizar cada una.
      </p>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {BRAND_ITEMS.map((item) => (
          <div
            key={item.slug}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="group relative flex h-20 w-44 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 p-3 shadow-lg shadow-slate-900/25 ring-1 ring-slate-700/40">
              <Image
                src={item.image}
                alt={renaming?.slug === item.slug ? renaming.name : item.name}
                fill
                sizes="176px"
                className="object-contain"
              />
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {renaming?.slug === item.slug ? (
                <input
                  value={renaming.name}
                  onChange={(e) => setRenaming({ slug: item.slug, name: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveRename();
                    if (e.key === "Escape") setRenaming(null);
                  }}
                  autoFocus
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
              ) : (
                <span className="font-semibold text-gray-900">{item.name}</span>
              )}

              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-1 text-xs font-medium text-blue-600 hover:underline">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0]
                        ? saveLogo(item.slug, item.name, e.target.files[0])
                        : undefined
                    }
                  />
                  Cambiar logo
                </label>

                {renaming?.slug === item.slug ? (
                  <button
                    type="button"
                    onClick={saveRename}
                    className="text-xs font-medium text-green-600 hover:underline"
                  >
                    Guardar
                  </button>
                ) : (
                  <IconButton
                    variant="edit"
                    label="Editar nombre"
                    onClick={() => setRenaming({ slug: item.slug, name: item.name })}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
