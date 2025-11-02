import { createClient } from '@supabase/supabase-js'

// ✅ Supabase environment variables with safe fallbacks
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jtvseavjssmprfqnwyoe.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0dnNlYXZqc3NtcHJmcW53eW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MDY3MDIsImV4cCI6MjA3NzA4MjcwMn0.LxxZFeXNH8k2cHFyvBvAiszHn12ebOTKNFXCBzkgFjk";

// ✅ Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
