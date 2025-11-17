// scripts/seedMockIntel.ts
import { createClient } from "@supabase/supabase-js";

// 🔐 Use your Supabase credentials from .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 🌍 Global mock regions and themes
const regions = ["Asia", "Europe", "Americas", "Middle East", "Africa"];
const categories = ["Finance", "Geopolitics", "Weather", "Health"];

// 🧠 Mock headlines and summaries by category
const intelSamples: Record<string, { headline: string; summary: string }[]> = {
  Finance: [
    {
      headline: "Markets surge as investors anticipate rate cuts",
      summary:
        "Regional exchanges saw sharp gains amid expectations of central bank easing and stronger capital inflows.",
    },
    {
      headline: "Gold prices stabilize after volatility spike",
      summary:
        "Commodity traders in Asia and the Americas report reduced speculative positions and a return to fundamentals.",
    },
    {
      headline: "Emerging economies strengthen fiscal reserves",
      summary:
        "Governments across Africa and the Middle East are boosting FX reserves to shield against global uncertainty.",
    },
  ],
  Geopolitics: [
    {
      headline: "Diplomatic summit seeks new security frameworks",
      summary:
        "Leaders from major blocs met to discuss new regional treaties and stabilize ongoing tensions.",
    },
    {
      headline: "Trade corridors expand as sanctions ease",
      summary:
        "New trade routes across Europe and Asia aim to bypass former chokepoints, improving regional stability.",
    },
    {
      headline: "Political transitions reshape global alliances",
      summary:
        "Shifting leadership in key nations is expected to alter existing international partnerships.",
    },
  ],
  Weather: [
    {
      headline: "Heavy rains disrupt supply chains across Asia",
      summary:
        "Flooding in key ports led to shipment delays and infrastructure strains in several export-heavy regions.",
    },
    {
      headline: "Unseasonal heat wave challenges energy grids",
      summary:
        "Power consumption spikes across Europe and the Americas have raised calls for more resilient infrastructure.",
    },
    {
      headline: "Meteorologists warn of El Niño persistence",
      summary:
        "Experts note that weather anomalies may continue into the next quarter, impacting crop yields and logistics.",
    },
  ],
  Health: [
    {
      headline: "Vaccine rollout expands across developing nations",
      summary:
        "Global health agencies announce new funding for equitable vaccine distribution and emergency preparedness.",
    },
    {
      headline: "Hospitals adapt to digital patient monitoring",
      summary:
        "AI-driven triage systems are being piloted across Asia and Europe to improve care efficiency.",
    },
    {
      headline: "Health ministries increase outbreak surveillance",
      summary:
        "Cross-border data sharing improves detection of infectious disease clusters before they spread regionally.",
    },
  ],
};

// 🚀 Seed data into intel_feed_public
async function seedIntel() {
  const intelRecords = [];
  const now = new Date();

  for (const region of regions) {
    for (const category of categories) {
      const samples = intelSamples[category];
      for (let i = 0; i < 3; i++) {
        const item = samples[i % samples.length];
        intelRecords.push({
          region,
          category,
          headline: `${region}: ${item.headline}`,
          summary: item.summary,
          created_at: new Date(now.getTime() - Math.random() * 5 * 86400000).toISOString(),
        });
      }
    }
  }

  const { error } = await supabase.from("intel_feed_public").insert(intelRecords);
  if (error) {
    console.error("❌ Error inserting intel feed:", error.message);
  } else {
    console.log(`✅ Inserted ${intelRecords.length} mock intel records`);
  }
}

seedIntel();
