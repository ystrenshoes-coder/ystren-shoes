import ClearCartOnMount from "@/components/ClearCartOnMount";

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <ClearCartOnMount />
      <h1 className="text-2xl font-bold text-gray-900">Gracias por tu compra</h1>
      <p className="mt-2 text-gray-600">
        Estamos confirmando el estado de tu pago con Wompi. Te avisaremos por
        correo o WhatsApp en cuanto quede confirmado.
      </p>
      {reference ? (
        <p className="mt-4 text-sm text-gray-500">Referencia del pedido: {reference}</p>
      ) : null}
    </section>
  );
}
