// /lib/supabase/server.ts
// 🔐 A.I.V.E. — Server-Side Supabase Client
// Full-access Service Role client (MUST NOT run in the browser)

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

/**
 * Creates a secure Supabase client using the Service Role key.
 * - For API routes, server components, cron jobs, and CAS engines
 * - Never expose this client to the browser
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("❌ Missing env: NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!serviceRoleKey) {
    throw new Error("❌ Missing env: SUPABASE_SERVICE_ROLE_KEY");
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,      // No cookies, no browser-side auth
      autoRefreshToken: false,    // Safe for background tasks + cron
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...(init || {}),
          cache: "no-store",       // Ensures real-time accuracy
        }),
    },
  });
}
