import Link from "next/link";

export default function PoliciesBanner() {
  return (
    <Link
      href="/politicas"
      className="block bg-gradient-to-r from-slate-950 via-blue-800 to-slate-950 py-6 text-center text-white transition hover:via-blue-700"
    >
      <p className="text-lg font-semibold">
        Conoce nuestras politicas de cambios, envios y garantia
      </p>
      <p className="text-sm underline">Ver politicas</p>
    </Link>
  );
}
