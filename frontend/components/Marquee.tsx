export default function Marquee({ text }: { text: string }) {
  const items = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="marquee-pause overflow-hidden py-2">
      <div className="flex w-max animate-marquee">
        {items.map((i) => (
          <span
            key={i}
            className="mx-8 text-xs font-medium uppercase tracking-widest"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
