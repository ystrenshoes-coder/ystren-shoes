import "server-only";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const BAN_DURATION = "876000h"; // 100 years

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;
  const role = data.user.app_metadata?.role ?? data.user.user_metadata?.role ?? "staff";
  return role === "admin";
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const { role, password, disabled } = body;

  if (role == null && password == null && disabled == null) {
    return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const attributes: {
    password?: string;
    ban_duration?: string | "none";
    app_metadata?: Record<string, unknown>;
    user_metadata?: Record<string, unknown>;
  } = {};

  if (role) {
    attributes.app_metadata = { role };
    attributes.user_metadata = { role };
  }
  if (password) {
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contrasena debe tener al menos 6 caracteres" },
        { status: 400 },
      );
    }
    attributes.password = password;
  }
  if (disabled != null) {
    attributes.ban_duration = disabled ? BAN_DURATION : "none";
  }

  const { error } = await supabase.auth.admin.updateUserById(userId, attributes);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: "updated" });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: "deleted" });
}