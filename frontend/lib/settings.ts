import { createAdminClient } from "@/lib/supabase/admin";
import type { SiteSetting } from "@/lib/api";

export async function getSettingsFromDB(): Promise<SiteSetting[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("id");

  if (error || !data) return [];

  return data.map((row) => ({
    key: row.key,
    value: row.value,
    updated_at: row.updated_at,
  }));
}
