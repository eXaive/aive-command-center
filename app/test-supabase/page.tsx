"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function TestSupabasePage() {
  const [status, setStatus] = useState("⏳ Checking connection...");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        const supabase = createClient(url, key);

        // Insert a test question
        const { data: inserted, error: insertError } = await supabase
          .from("quiz_questions")
          .insert([{ question: "What is ROI?", answer: "Return on Investment" }])
          .select();

        if (insertError) {
          setStatus("⚠️ Insert failed but Supabase connection works");
          setDetails(insertError);
          return;
        }

        // Fetch recent entries
        const { data, error } = await supabase
          .from("quiz_questions")
          .select("*")
          .order("id", { ascending: false })
          .limit(3);

        if (error) {
          setStatus("⚠️ Read failed but Supabase connection works");
          setDetails(error);
        } else {
          setStatus("✅ Read + Write successful!");
          setDetails(data);
        }
      } catch (err: any) {
        setStatus("💥 Unexpected error");
        setDetails({ message: err.message, stack: err.stack });
      }
    };

    checkConnection();
  }, []);

  return (
    <div
      style={{
        background: "#0f1117",
        color: "white",
        fontFamily: "monospace",
        padding: "2rem",
        borderRadius: "12px",
      }}
    >
      <h1 style={{ color: "#8ab4f8" }}>🧠 Supabase Read + Write Test</h1>
      <p>{status}</p>

      <pre
        style={{
          background: "#1a1c23",
          padding: "1rem",
          borderRadius: "8px",
          marginTop: "1rem",
          overflowX: "auto",
          whiteSpace: "pre-wrap",
        }}
      >
        {details ? JSON.stringify(details, null, 2) : "No details yet..."}
      </pre>
    </div>
  );
}
