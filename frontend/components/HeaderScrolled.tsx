"use client";

import { useEffect, useState, type ReactNode } from "react";

export default function HeaderScrolled({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`transition-shadow duration-300 ${
        scrolled ? "shadow-md shadow-gray-900/5" : ""
      }`}
    >
      {children}
    </div>
  );
}
