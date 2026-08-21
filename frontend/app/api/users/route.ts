import "server-only";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  const { data: { users }, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mapped = users.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    role: u.app_metadata?.role ?? u.user_metadata?.role ?? "staff",
    created_at: u.created_at ?? null,
    last_sign_in_at: u.last_sign_in_at ?? null,
  }));

  return NextResponse.json(mapped);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, role } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Falta email o password" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    app_metadata: { role: role ?? "staff" },
    user_metadata: { role: role ?? "staff" },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.user.id, email: data.user.email, status: "created" });
}
