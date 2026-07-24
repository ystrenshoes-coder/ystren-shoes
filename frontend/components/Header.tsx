import Logo from "@/components/Logo";
import CartBadge from "@/components/CartBadge";
import HeaderSearch from "@/components/HeaderSearch";
import HamburgerMenu from "@/components/HamburgerMenu";
import { getCategories } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Header() {
  const [categories, supabase] = await Promise.all([
    getCategories().catch(() => []),
    createClient(),
  ]);
  const { data } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <HamburgerMenu categories={categories} />
        <Logo />
        <div className="order-3 w-full md:order-none md:flex md:flex-1 md:justify-center">
          <HeaderSearch />
        </div>
        <nav className="ml-auto flex shrink-0 items-center gap-5 text-sm font-medium text-gray-700">
          {!data.user ? <CartBadge /> : null}
          {data.user ? (
            <>
              <span className="hidden text-gray-500 sm:inline">{data.user.email}</span>
              <Link
                href="/admin"
                className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
              >
                Panel admin
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
