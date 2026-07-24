import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.webp"
        alt="Ystren Shoes"
        width={56}
        height={56}
        priority
        className="h-14 w-14 rounded-full object-cover ring-2 ring-blue-500/40"
      />
    </Link>
  );
}
