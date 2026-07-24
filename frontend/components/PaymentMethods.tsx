const METHODS = [
  { name: "Tarjeta credito/debito", emoji: "💳" },
  { name: "PSE", emoji: "🏦" },
  { name: "Nequi", emoji: "📱" },
];

export default function PaymentMethods() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 text-center">
      <h2 className="text-2xl font-bold uppercase text-gray-900">
        Paga facil, <span className="text-blue-600">compra mejor</span>
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Pago 100% seguro en linea, procesado por Wompi.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
        {METHODS.map((method) => (
          <div
            key={method.name}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 transition hover:border-blue-400 hover:shadow-sm"
          >
            <span className="text-2xl">{method.emoji}</span>
            <span className="text-sm font-medium text-gray-800">{method.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
