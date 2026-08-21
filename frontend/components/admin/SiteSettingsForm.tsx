"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSetting } from "@/lib/api";

type SettingsMap = Record<string, Record<string, unknown>>;

const FIELDS = [
  { key: "announcement_text", label: "Texto del anuncio superior", field: "text", type: "textarea" as const },
  { key: "hero_video_url", label: "URL del video hero", field: "url", type: "text" as const },
  { key: "hero_image", label: "Imagen poster del hero", field: "url", type: "text" as const },
  { key: "hero_title", label: "Titulo del hero (overlay)", field: "text", type: "text" as const },
  { key: "hero_subtitle", label: "Subtitulo del hero (overlay)", field: "text", type: "text" as const },
];

export default function SiteSettingsForm() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    getSettings()
      .then((list) => {
        const map: SettingsMap = {};
        for (const s of list) map[s.key] = s.value;
        setSettings(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleChange(key: string, field: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  async function handleSave(key: string) {
    setSaving(key);
    setSaved(null);
    try {
      await updateSetting(key, settings[key]);
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch {
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando configuraciones...</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {FIELDS.map(({ key, label, field, type }) => (
        <div key={key} className="rounded-xl border border-gray-200 bg-white p-6">
          <label className="text-sm font-semibold text-gray-700">{label}</label>
          {type === "textarea" ? (
            <textarea
              value={(settings[key]?.[field] as string) ?? ""}
              onChange={(e) => handleChange(key, field, e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          ) : (
            <input
              type="text"
              value={(settings[key]?.[field] as string) ?? ""}
              onChange={(e) => handleChange(key, field, e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
      ))}
    </div>
  );
}
