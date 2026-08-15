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
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">Envios</h2>
          <p className="mt-1">
            Contenido pendiente por confirmar con el cliente: tiempos y
            costos de envio a nivel nacional.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">
            Cambios y devoluciones
          </h2>
          <p className="mt-1">
            Contenido pendiente por confirmar con el cliente: condiciones
            para cambios de talla o devoluciones.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">Garantia</h2>
          <p className="mt-1">
            Contenido pendiente por confirmar con el cliente: cobertura de
            garantia por defectos de fabrica.
          </p>
        </div>
      </div>
    </section>
  );
}
