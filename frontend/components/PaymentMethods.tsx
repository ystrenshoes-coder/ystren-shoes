import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function PaymentMethods() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 text-center">
      <Reveal>
        <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 sm:text-3xl">
          Paga facil, <span className="text-blue-600">compra mejor</span>
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Pago 100% seguro en linea, procesado por Wompi.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-8 flex justify-center">
          <Image
            src="/wompi-metodos-pago.png"
            alt="Pagos seguros por Wompi: Visa, Mastercard, American Express, PSE, Nequi"
            width={600}
            height={150}
            className="h-auto w-full max-w-md"
          />
        </div>
      </Reveal>
    </section>
  );
}
