export default function PoliticasPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">
          Politicas de Ystren Shoes
        </h1>
      </div>
      <div className="mt-8 space-y-8 text-sm text-gray-700">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">
            Envios
          </h2>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              Bogota: se cuenta con la modalidad de pago contra entrega,
              permitiendo realizar el pago al momento de recibir el pedido.
            </li>
            <li>
              Envios nacionales: se realizan despachos a cualquier ciudad de
              Colombia mediante empresas transportadoras, con un tiempo
              estimado de entrega de 2 a 3 dias habiles.
            </li>
            <li>
              Una vez realizado el despacho, se proporciona la guia de envio
              correspondiente, con la cual se puede realizar el seguimiento del
              pedido durante todo el proceso de entrega.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">
            Cambios y devoluciones
          </h2>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              Aceptamos cambios de talla siempre que la solicitud sea
              realizada dentro de los tres (3) dias siguientes a la recepcion
              del pedido.
            </li>
            <li>
              El cambio aplica unicamente por la misma referencia adquirida y
              esta sujeto a disponibilidad de la talla solicitada.
            </li>
            <li>
              No realizamos devoluciones de dinero. Los cambios se gestionan
              exclusivamente por talla y bajo las condiciones establecidas.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">
            Garantia
          </h2>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              Todos nuestros productos cuentan con un (1) mes de garantia por
              defectos de fabricacion.
            </li>
            <li>
              La garantia aplica para casos como despegues, costuras
              defectuosas o fallas relacionadas directamente con el proceso de
              fabricacion.
            </li>
            <li>
              La garantia no cubre daños ocasionados por el uso inadecuado,
              desgaste normal del producto o modificaciones realizadas por
              terceros.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
