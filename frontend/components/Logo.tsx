import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center text-xl font-extrabold uppercase leading-none tracking-tight text-gray-900 ${className}`}
    >
      Ystren<span className="text-orange-600">Shoes</span>
    </Link>
  );
}
