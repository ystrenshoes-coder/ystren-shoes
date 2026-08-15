"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function BrandIntro({
  brandName,
  brandImage,
}: {
  brandName: string;
  brandImage?: string;
}) {
  const [hidden, setHidden] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`intro-screen ${hidden ? "intro-screen--hidden" : ""}`} aria-hidden>
      <div className="intro-content">
        {brandImage && !logoError ? (
          <div className="intro-logo intro-logo--brand">
            <Image
              src={brandImage}
              alt=""
              fill
              sizes="120px"
              className="object-contain"
              onError={() => setLogoError(true)}
            />
          </div>
        ) : null}
        <span className={`intro-brand${brandName.length > 10 ? " intro-brand--long" : ""}`}>
          {brandName}
        </span>
        <span className="intro-sub">Coleccion</span>
      </div>
    </div>
  );
}
