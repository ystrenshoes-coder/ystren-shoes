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

const SOCIALS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/16AyQkN1NL6/",
    Icon: FacebookIcon,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/ystren_shoes?igsh=MWpncTl2eWYxMWYyeg==",
    Icon: InstagramIcon,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@ystren_shoes?_r=1&_t=ZS-98JBpMHhccG",
    Icon: TikTokIcon,
  },
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
    <footer className="mt-16 bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-white">
            Ystren<span className="text-blue-500">Shoes</span>
          </h3>
          <p className="mt-3 max-w-xs text-sm text-gray-400">
            Calzado deportivo para basketball, futbol, hombre y mujer.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">
            Contacto
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>WhatsApp: +{WHATSAPP_NUMBER || "573001234567"}</li>
            <li>Correo: contacto@ystrenshoes.com</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">
            Puntos fisicos
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>Sede principal — dirección por confirmar</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">
            Ayuda
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/politicas" className="transition hover:text-blue-400">
                Politicas de la empresa
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-6">
          <div className="flex gap-3">
            {SOCIALS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
