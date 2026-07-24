"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/formatPrice";

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, idNumber, email, phone, city, address },
          items: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "No se pudo iniciar el pago");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrio un error");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Tu carrito esta vacio</h1>
        <p className="mt-2 text-gray-600">Agrega productos para continuar con tu compra.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold uppercase text-gray-900">
        Tu <span className="text-blue-600">carrito</span>
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li
                key={`${item.product.id}-${item.size}`}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Talla: {item.size}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.product.price)}
                  </p>
                </div>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.product.id, item.size, Number(e.target.value))
                  }
                  className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.product.id, item.size)}
                  aria-label="Quitar del carrito"
                  className="text-sm text-red-600 hover:underline"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
            <span className="text-sm font-medium text-gray-600">Subtotal</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Image
                src="/logo.webp"
                alt=""
                width={340}
                height={340}
                className="scale-125 opacity-[0.05]"
              />
            </div>

            <form onSubmit={handleCheckout} className="relative flex flex-col gap-4 p-6 sm:p-8">
              <div>
                <h2 className="text-lg font-bold uppercase text-gray-900">
                  Datos de <span className="text-blue-600">envio</span>
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Completa tus datos para finalizar la compra con Wompi.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-gray-600">
                  Nombre completo
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
                  Cedula
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
                  Telefono
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-gray-600">
                  Correo electronico
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
                  Ciudad
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
                  Direccion
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-950 via-blue-700 to-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:via-blue-600 disabled:opacity-50"
              >
                {loading ? "Redirigiendo a Wompi..." : `Pagar ${formatPrice(subtotal)} con Wompi`}
              </button>

              <p className="text-center text-xs text-gray-400">
                🔒 Pago 100% seguro, procesado por Wompi
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
