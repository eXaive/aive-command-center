import { createClient } from "@supabase/supabase-js";

// ⚠️  TEMPORARY TEST — direct credentials (safe locally, remove later)
const supabaseUrl = "https://jtvseavjssmprfqnwyoe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0dnNlYXZqc3NtcHJmcW53eW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MDY3MDIsImV4cCI6MjA3NzA4MjcwMn0.LxxZFeXNH8k2cHFyvBvAiszHn12ebOTKNFXCBzkgFjk"; // paste your anon key

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials.");
  process.exit(1);
}

// Create the client
const supabase = createClient(supabaseUrl, supabaseKey);
console.log("✅ Supabase client initialized:", supabaseUrl);

// Simple test to list your storage buckets
async function checkBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("⚠️ Error listing buckets:", error.message);
  } else {
    console.log("🪣 Buckets found:", data);
  }
}

checkBuckets();
