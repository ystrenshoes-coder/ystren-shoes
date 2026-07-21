import "server-only";
import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type CheckoutItem = {
  productId: number;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

type CheckoutBody = {
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: CheckoutItem[];
};

export async function POST(request: Request) {
  const body: CheckoutBody = await request.json();

  if (!body.customer?.name || !body.customer?.email || body.items.length === 0) {
    return NextResponse.json({ error: "Datos de pedido incompletos" }, { status: 400 });
  }

  const subtotal = body.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const reference = `ystren-${crypto.randomUUID()}`;

  const supabase = createAdminClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      wompi_reference: reference,
      customer_name: body.customer.name,
      customer_email: body.customer.email,
      customer_phone: body.customer.phone ?? null,
      shipping_address: body.customer.address ?? null,
      subtotal,
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "No se pudo crear el pedido" }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    body.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    }))
  );

  if (itemsError) {
    return NextResponse.json({ error: "No se pudo crear el pedido" }, { status: 500 });
  }

  const amountInCents = Math.round(subtotal * 100);
  const currency = "COP";
  const integritySignature = crypto
    .createHash("sha256")
    .update(`${reference}${amountInCents}${currency}${process.env.WOMPI_INTEGRITY_SECRET}`)
    .digest("hex");

  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/carrito/confirmacion?reference=${reference}`;

  const checkoutUrl = new URL("https://checkout.wompi.co/p/");
  checkoutUrl.searchParams.set("public-key", process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY!);
  checkoutUrl.searchParams.set("currency", currency);
  checkoutUrl.searchParams.set("amount-in-cents", String(amountInCents));
  checkoutUrl.searchParams.set("reference", reference);
  checkoutUrl.searchParams.set("signature:integrity", integritySignature);
  checkoutUrl.searchParams.set("redirect-url", redirectUrl);
  checkoutUrl.searchParams.set("customer-data:email", body.customer.email);
  checkoutUrl.searchParams.set("customer-data:full-name", body.customer.name);

  return NextResponse.json({ checkoutUrl: checkoutUrl.toString() });
}
