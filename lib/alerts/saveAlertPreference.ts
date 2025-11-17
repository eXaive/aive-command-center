import { supabase } from "@/lib/supabaseClient";

export async function saveAlertPreference(email: string) {
  return supabase.from("alert_preferences").insert([{ email }]);
}
