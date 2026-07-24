import Image from "next/image";

export default function PaymentMethods() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 text-center">
      <h2 className="text-2xl font-bold uppercase text-gray-900">
        Paga facil, <span className="text-blue-600">compra mejor</span>
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Pago 100% seguro en linea, procesado por Wompi.
      </p>
      <div className="mt-6 flex justify-center">
        <Image
          src="/wompi-metodos-pago.png"
          alt="Pagos seguros por Wompi: Visa, Mastercard, American Express, PSE, Nequi"
          width={600}
          height={150}
          className="h-auto w-full max-w-md"
        />
      </div>
    </section>
  );
}
