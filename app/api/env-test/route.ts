import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase.from("countries").select("*").limit(1);
    if (error) throw error;

    return Response.json({
      connected: true,
      sample: data,
    });
  } catch (e: any) {
    return Response.json({
      connected: false,
      error: e.message,
    });
  }
}
