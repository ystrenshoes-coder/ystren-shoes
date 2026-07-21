import "server-only";
import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type WompiEvent = {
  event: string;
  data: {
    transaction: {
      id: string;
      status: string;
      reference: string;
    };
  };
  signature: {
    properties: string[];
    checksum: string;
  };
  timestamp: number;
};

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function isValidSignature(payload: WompiEvent, eventsSecret: string): boolean {
  const concatenated = payload.signature.properties
    .map((path) => String(getByPath(payload.data, path)))
    .join("");
  const toHash = `${concatenated}${payload.timestamp}${eventsSecret}`;
  const checksum = crypto.createHash("sha256").update(toHash).digest("hex");
  return checksum === payload.signature.checksum;
}

const STATUS_MAP: Record<string, string> = {
  APPROVED: "approved",
  DECLINED: "declined",
  VOIDED: "declined",
  ERROR: "error",
};

export async function POST(request: Request) {
  const payload: WompiEvent = await request.json();

  const eventsSecret = process.env.WOMPI_EVENTS_SECRET!;
  if (!isValidSignature(payload, eventsSecret)) {
    return NextResponse.json({ error: "Firma invalida" }, { status: 401 });
  }

  if (payload.event !== "transaction.updated") {
    return NextResponse.json({ received: true });
  }

  const { reference, status, id } = payload.data.transaction;
  const mappedStatus = STATUS_MAP[status] ?? "pending";

  const supabase = createAdminClient();
  await supabase
    .from("orders")
    .update({ status: mappedStatus, wompi_transaction_id: id })
    .eq("wompi_reference", reference);

  return NextResponse.json({ received: true });
}
