"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function HeaderSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(query ? `/productos?search=${encodeURIComponent(query)}` : "/productos");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar tenis, marca..."
        aria-label="Buscar productos"
        className="w-full rounded-full border border-gray-300 px-4 py-1.5 text-sm"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="shrink-0 rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white"
      >
        🔍
      </button>
    </form>
  );
}
