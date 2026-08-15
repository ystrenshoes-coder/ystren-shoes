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
    <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar tenis, marca..."
        aria-label="Buscar productos"
        className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="shrink-0 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
      >
        Buscar
      </button>
    </form>
  );
}
