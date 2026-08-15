import Link from "next/link";

export default function PoliciesBanner() {
  return (
    <section className="border-y border-gray-200 bg-white">
      <Link
        href="/politicas"
        className="group mx-auto flex max-w-7xl flex-col items-center justify-center gap-1 px-4 py-10 text-center"
      >
        <p className="text-xl font-black uppercase tracking-tight text-gray-900 transition group-hover:text-blue-700 sm:text-2xl">
          Conoce nuestras politicas de cambios, envios y garantia
        </p>
        <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-blue-600">
          Ver politicas <span className="inline-block transition group-hover:translate-x-1">→</span>
        </p>
      </Link>
    </section>
  );
}
