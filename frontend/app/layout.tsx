import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";
import WhatsappButton from "@/components/WhatsappButton";
import { CartProvider } from "@/lib/cart/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ystren Shoes",
  description: "Calzado deportivo para basketball, futbol, hombre y mujer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Script
        id="js-enabled"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.classList.add("js");`,
        }}
      />
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Intro />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsappButton />
        </CartProvider>
      </body>
    </html>
  );
}
