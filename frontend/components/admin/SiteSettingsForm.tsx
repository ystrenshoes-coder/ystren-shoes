"use client";

import { useEffect, useState } from "react";

type SettingsMap = Record<string, Record<string, unknown>>;

const FIELDS = [
  { key: "announcement_text", label: "Texto del anuncio superior", desc: "Barra de texto que aparece arriba del header en la pagina principal", field: "text", type: "textarea" as const },
  { key: "hero_video_url", label: "URL del video hero", desc: "Video o animacion que se muestra en el banner principal (formato .mp4)", field: "url", type: "text" as const },
  { key: "hero_image", label: "Imagen poster del hero", desc: "Imagen que se muestra mientras carga el video o si el navegador no soporta video", field: "url", type: "text" as const },
  { key: "hero_title", label: "Titulo del hero (overlay)", desc: "Texto grande que se superpone sobre el video/imagen principal", field: "text", type: "text" as const },
  { key: "hero_subtitle", label: "Subtitulo del hero (overlay)", desc: "Texto secundario debajo del titulo en el banner principal", field: "text", type: "text" as const },
];

async function fetchSettings(): Promise<SettingsMap> {
  const res = await fetch("/api/settings", { cache: "no-store" });
  if (!res.ok) throw new Error("Error cargando configuraciones");
  const list = await res.json();
  const map: SettingsMap = {};
  for (const s of list) map[s.key] = s.value;
  return map;
}

async function saveSetting(key: string, value: Record<string, unknown>): Promise<void> {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) throw new Error("No se pudo guardar");
}

export default function SiteSettingsForm() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => setError("No se pudieron cargar las configuraciones"))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(key: string, field: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  async function handleSave(key: string) {
    setSaving(key);
    setSaved(null);
    setError(null);
    try {
      await saveSetting(key, settings[key]);
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch {
      setError("Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando configuraciones...</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {FIELDS.map(({ key, label, desc, field, type }) => {
        const currentValue = (settings[key]?.[field] as string) ?? "";
        return (
          <div key={key} className="rounded-xl border border-gray-200 bg-white p-6">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <p className="mt-0.5 text-xs text-gray-400">{desc}</p>
            {type === "textarea" ? (
              <textarea
                value={currentValue}
                onChange={(e) => handleChange(key, field, e.target.value)}
                rows={3}
                className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            ) : (
              <input
                type="text"
                value={currentValue}
                onChange={(e) => handleChange(key, field, e.target.value)}
                className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            )}
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave(key)}
                disabled={saving === key}
                className="rounded-full bg-blue-600 px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
              >
                {saving === key ? "Guardando..." : "Guardar"}
              </button>
              {saved === key ? (
                <span className="text-sm font-medium text-green-600">Guardado</span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
