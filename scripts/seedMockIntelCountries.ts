// scripts/seedMockIntelCountries.ts
import { createClient } from "@supabase/supabase-js";

// 🔐 Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 🌍 Country mapping by region
const countryMap: Record<string, string[]> = {
  Asia: ["India", "China", "Japan"],
  Europe: ["UK", "Germany", "France"],
  Americas: ["USA", "Canada", "Brazil"],
  "Middle East": ["UAE", "Saudi Arabia", "Israel"],
  Africa: ["Nigeria", "South Africa", "Egypt"],
};

const categories = ["Finance", "Geopolitics", "Weather", "Health"];

// 🧠 Headline templates by category
const intelSamples: Record<string, string[]> = {
  Finance: [
    "Stock market gains amid investor optimism",
    "Central bank signals cautious rate approach",
    "Currency fluctuations affect import costs",
  ],
  Geopolitics: [
    "Leaders meet for new trade agreement",
    "Regional summit addresses diplomatic challenges",
    "Shifts in alliances reshape policy priorities",
  ],
  Weather: [
    "Unusual temperature swings affect agriculture",
    "Heavy rainfall causes transportation delays",
    "Meteorologists track upcoming tropical storm",
  ],
  Health: [
    "Hospitals increase preparedness for seasonal outbreaks",
    "New telemedicine programs expand rural access",
    "Authorities monitor viral spread with AI systems",
  ],
};

async function seedIntel() {
  const intelRecords = [];
  const now = new Date();

  for (const region of Object.keys(countryMap)) {
    for (const country of countryMap[region]) {
      for (const category of categories) {
        const samples = intelSamples[category];
        const sample =
          samples[Math.floor(Math.random() * samples.length)];
        intelRecords.push({
          region,
          category,
          headline: `${country}: ${sample}`,
          summary: `Analysts in ${country} report new ${category.toLowerCase()} developments impacting the region.`,
          created_at: new Date(
            now.getTime() - Math.random() * 7 * 86400000
          ).toISOString(),
        });
      }
    }
  }

  const { error } = await supabase
    .from("intel_feed_public")
    .insert(intelRecords);

  if (error) console.error("❌ Error inserting country intel:", error);
  else console.log(`✅ Inserted ${intelRecords.length} localized intel records`);
}

seedIntel();
