// /supabase/functions/process_aive_reflection/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 🧩 Handle preflight (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // 🧠 Log the received reflection
    console.log("🪞 A.I.V.E. Reflection Received:", body);

    const { source, reflection, sentiment, confidence, mood_index } = body;

    // ✅ Respond to caller
    return new Response(
      JSON.stringify({
        message: "Reflection processed successfully",
        received: { source, reflection, sentiment, confidence, mood_index },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (err) {
    console.error("❌ Error in process_aive_reflection:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
