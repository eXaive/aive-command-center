// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

/**
 * 🔐 Universal Supabase Client
 * Used for both client-side and server-side rendering.
 * - Reads public (anon) env vars automatically from .env.local
 * - Enables real-time subscriptions for assets, intel, and predictions
 * - Disables persistent session storage to keep memory clean
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 🧠 Shared Supabase client (read + realtime)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 5 } }, // keeps neural feeds smooth
});

// Optional utility for debugging current connection
export const logSupabaseStatus = () => {
  console.log("🔗 Supabase Connected →", supabaseUrl);
};
