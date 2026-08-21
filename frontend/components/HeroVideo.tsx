export default function HeroVideo({
  videoUrl,
  imageUrl,
  title,
  subtitle,
}: {
  videoUrl?: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative aspect-video w-full overflow-hidden bg-gray-100 sm:aspect-[16/6]">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={imageUrl || "/categorias/basket.jpg"}
      >
        <source src={videoUrl || "/hero.mp4"} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/45" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
        <div className="animate-hero-fade">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200 sm:text-sm">
            Ystren Shoes
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-6xl">
            {title || "Calzado deportivo"}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-100 sm:text-lg">
              {subtitle}
            </p>
          ) : (
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-100 sm:text-lg">
              Para basketball, futbol, hombre y mujer.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
