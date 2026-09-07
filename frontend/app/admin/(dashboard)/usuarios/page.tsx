import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UsersManager from "@/components/admin/UsersManager";

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const role = data.user?.app_metadata?.role ?? data.user?.user_metadata?.role ?? "staff";

  if (role !== "admin") {
    redirect("/admin");
  }

  return <UsersManager isAdmin={role === "admin"} />;
}