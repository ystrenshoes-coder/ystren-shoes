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
    <header className="sticky top-0 z-40 border-b border-blue-900/40 bg-slate-950 shadow-lg shadow-black/20">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3">
        <div className="flex items-center justify-start">
          <HamburgerMenu categories={categories} />
        </div>

        <div className="flex justify-center">
          <Logo />
        </div>

        <nav className="flex items-center justify-end gap-4 text-sm font-medium text-blue-100">
          {!data.user ? <CartBadge /> : null}
          {data.user ? (
            <>
              <span className="hidden text-blue-300 sm:inline">{data.user.email}</span>
              <Link
                href="/admin"
                className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
              >
                Panel admin
              </Link>
            </>
          ) : null}
        </nav>
      </div>
      <div className="flex justify-center border-t border-blue-900/30 bg-slate-900/60 px-4 py-2">
        <HeaderSearch />
      </div>
    </header>
  );
}
