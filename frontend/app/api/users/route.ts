import "server-only";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;
  const role = data.user.app_metadata?.role ?? data.user.user_metadata?.role ?? "staff";
  return role === "admin";
}

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
    disabled: u.banned_until != null,
  }));

  return NextResponse.json(mapped);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

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