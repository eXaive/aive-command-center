// /lib/supabase/client.ts
// 🌐 A.I.V.E. — Browser/Client Supabase Wrapper (SSR-Safe)

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a new browser-safe Supabase client.
 * Used inside client components only.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "❌ Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      // Disable session persistence to match your command-center behavior
      lifetime: 0,
    },
  });
}

/**
 * Optional mini-debugger
 * Helps verify the client is initialized in the right environment.
 */
export function logClientInit() {
  console.log("🔗 A.I.V.E. Browser Supabase Client initialized");
}
