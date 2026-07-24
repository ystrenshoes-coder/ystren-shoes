"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/formatPrice";

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
          customer: { name, email, phone, address },
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
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold uppercase text-gray-900">Tu carrito</h1>

      <ul className="mt-6 flex flex-col gap-4">
        {items.map((item) => (
          <li
            key={`${item.product.id}-${item.size}`}
            className="flex items-center gap-4 rounded-xl border border-gray-200 p-4"
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

      <div className="mt-6 flex justify-end text-lg font-bold text-gray-900">
        Subtotal: {formatPrice(subtotal)}
      </div>

      <form onSubmit={handleCheckout} className="mt-8 flex flex-col gap-4 rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Datos de envio</h2>
        <input
          type="text"
          required
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="email"
          required
          placeholder="Correo electronico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="tel"
          placeholder="Telefono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Direccion de envio"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Redirigiendo a Wompi..." : "Pagar con Wompi"}
        </button>
      </form>
    </section>
  );
}
