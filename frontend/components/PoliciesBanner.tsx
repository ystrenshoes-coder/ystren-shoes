import Link from "next/link";

export default function PoliciesBanner() {
  return (
    <Link
      href="/politicas"
      className="block bg-orange-600 py-6 text-center text-white transition hover:bg-orange-700"
    >
      <p className="text-lg font-semibold">
        Conoce nuestras politicas de cambios, envios y garantia
      </p>
      <p className="text-sm underline">Ver politicas</p>
    </Link>
  );
}
