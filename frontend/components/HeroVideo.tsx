export default function HeroVideo() {
  return (
    <section className="relative aspect-video w-full overflow-hidden bg-slate-950 sm:aspect-[16/6]">
      <video
        className="h-full w-full object-cover opacity-80"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-slate-950/85" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Ystren <span className="text-blue-400">Shoes</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-blue-100 sm:text-lg">
          Calzado deportivo para basketball, futbol, hombre y mujer.
        </p>
      </div>
    </section>
  );
}
