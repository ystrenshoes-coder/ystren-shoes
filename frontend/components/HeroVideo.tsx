export default function HeroVideo() {
  return (
    <section className="relative aspect-video w-full overflow-hidden bg-gray-900 sm:aspect-[16/6]">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-4 text-center text-white">
        <h1 className="text-3xl font-extrabold uppercase sm:text-5xl">
          Ystren Shoes
        </h1>
        <p className="mt-2 max-w-xl text-sm sm:text-lg">
          Calzado deportivo para basketball, futbol, hombre y mujer.
        </p>
      </div>
    </section>
  );
}
