import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 text-2xl font-extrabold uppercase leading-none tracking-tight text-white ${className}`}
    >
      Ystren<span className="text-blue-400">Shoes</span>
    </Link>
  );
}
