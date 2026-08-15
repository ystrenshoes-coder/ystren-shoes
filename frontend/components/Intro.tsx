"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Intro() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("ystrenIntroShown") === "true") {
      setHidden(true);
      return;
    }
    const timer = setTimeout(() => {
      setHidden(true);
      sessionStorage.setItem("ystrenIntroShown", "true");
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`intro-screen ${hidden ? "intro-screen--hidden" : ""}`} aria-hidden>
      <div className="intro-content">
        <Image src="/logo.webp" alt="" width={84} height={84} priority className="intro-logo" />
        <span className="intro-brand">Ystren</span>
        <span className="intro-sub">Shoes</span>
      </div>
    </div>
  );
}
