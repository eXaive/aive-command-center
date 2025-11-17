// scripts/seedCausalLinks.mjs
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// 🧠 Init Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedCausalLinks() {
  console.log('🌍 Seeding causal links between predictions ↔ intel...');

  const { data: predictions, error: predErr } = await supabase
    .from('predictions')
    .select('id, region, category, subcategory, predicted_for_date, confidence')
    .limit(200);

  const { data: intel, error: intelErr } = await supabase
    .from('intel_feed_public')
    .select('id, region, category, headline, created_at')
    .limit(200);

  if (predErr || intelErr) {
    console.error('❌ Fetch failed:', predErr?.message, intelErr?.message);
    return;
  }

  const links = [];
  const now = new Date();

  for (const p of predictions ?? []) {
    const related = intel?.filter(
      (i) => i.region === p.region && i.category === p.category
    );
    const sample = related?.sort(() => Math.random() - 0.5).slice(0, 3) ?? [];

    for (const i of sample) {
      links.push({
        prediction_id: p.id,
        intel_id: i.id,
        region: p.region,
        category: p.category,
        relationship_strength: Math.round(50 + Math.random() * 50),
        created_at: now.toISOString(),
        explanation: `Intel "${i.headline}" likely influenced predictive outcome in ${p.region} (${p.category}).`,
      });
    }
  }

  const { error: insertErr } = await supabase.from('causal_links').insert(links);

  if (insertErr) console.error('❌ Error inserting causal links:', insertErr);
  else console.log(`✅ Inserted ${links.length} causal links`);
}

seedCausalLinks().catch((err) => {
  console.error('🚨 Unexpected error:', err);
});
