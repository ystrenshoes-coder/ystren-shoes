import "server-only";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const DAY_LABELS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export async function GET() {
  const supabase = createAdminClient();

  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const { data: orders } = await supabase
    .from("orders")
    .select("subtotal, created_at, status")
    .gte("created_at", monday.toISOString())
    .lte("created_at", sunday.toISOString())
    .not("status", "eq", "declined")
    .not("status", "eq", "error");

  const result = DAY_LABELS.map((label, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().slice(0, 10);

    const dayOrders = (orders ?? []).filter((o) => {
      if (!o.created_at) return false;
      return o.created_at.slice(0, 10) === dateStr;
    });

    return {
      day: dateStr,
      label,
      total: dayOrders.reduce((sum, o) => sum + (o.subtotal ?? 0), 0),
      count: dayOrders.length,
    };
  });

  return NextResponse.json(result);
}
