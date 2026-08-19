"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Intro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("ystrenIntroShown") === "true") return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("ystrenIntroShown", "true");
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`intro-screen ${visible ? "" : "intro-screen--hidden"}`}
      aria-hidden
    >
      <div className="intro-content">
        <Image
          src="/logo.webp"
          alt=""
          width={84}
          height={84}
          priority
          className="intro-logo"
        />
        <span className="intro-brand">Ystren</span>
        <span className="intro-sub">Shoes</span>
      </div>
    </div>
  );
}
