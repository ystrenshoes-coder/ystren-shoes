"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsappIcon,
} from "@/components/SocialIcons";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

// TODO: reemplazar por los links reales de cada red social del cliente.
const SOCIALS = [
  { name: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { name: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { name: "TikTok", href: "https://tiktok.com", Icon: TikTokIcon },
  {
    name: "WhatsApp",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    Icon: WhatsappIcon,
  },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-10 border-t border-gray-200 bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold uppercase text-white">
            Ystren<span className="text-orange-500">Shoes</span>
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Calzado deportivo para basketball, futbol, hombre y mujer.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase text-white">Contacto</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li>WhatsApp: +{WHATSAPP_NUMBER || "573001234567"}</li>
            <li>Correo: contacto@ystrenshoes.com</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase text-white">Puntos fisicos</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li>Sede principal — dirección por confirmar</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase text-white">Ayuda</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/politicas" className="hover:text-orange-500">
                Politicas de la empresa
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-center gap-4 border-t border-gray-800 py-6">
        {SOCIALS.map(({ name, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white hover:bg-orange-700"
          >
            <Icon />
          </a>
        ))}
      </div>
    </footer>
  );
}
