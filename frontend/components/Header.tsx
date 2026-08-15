import Logo from "@/components/Logo";
import CartBadge from "@/components/CartBadge";
import HeaderSearch from "@/components/HeaderSearch";
import HamburgerMenu from "@/components/HamburgerMenu";
import Marquee from "@/components/Marquee";
import HeaderScrolled from "@/components/HeaderScrolled";
import { getCategories } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const ANNOUNCEMENT_TEXT =
  "Envios a nivel nacional | Pago seguro con Wompi | Cambios sin complicaciones";

export default async function Header() {
  const [categories, supabase] = await Promise.all([
    getCategories().catch(() => []),
    createClient(),
  ]);
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <div className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl">
          <Marquee text={ANNOUNCEMENT_TEXT} />
        </div>
      </div>

      <HeaderScrolled>
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3">
            <div className="flex items-center justify-start">
              <HamburgerMenu categories={categories} />
            </div>

            <div className="flex justify-center">
              <Logo />
            </div>

            <nav className="flex items-center justify-end gap-4 text-sm font-medium text-gray-900">
              {!data.user ? <CartBadge /> : null}
              {data.user ? (
                <>
                  <span className="hidden text-gray-500 sm:inline">
                    {data.user.email}
                  </span>
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

          <div className="mx-auto flex max-w-7xl items-center justify-center px-4 pb-3">
            <HeaderSearch />
          </div>

          {categories.length > 0 ? (
            <nav className="hidden border-t border-gray-100 md:block">
              <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-700">
                <Link href="/productos" className="transition hover:text-blue-600">
                  Todos
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/productos?category=${category.slug}`}
                    className="transition hover:text-blue-600"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </nav>
          ) : null}
        </header>
      </HeaderScrolled>
    </>
  );
}
