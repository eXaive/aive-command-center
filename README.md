# GMMF Donut (Next.js)

Multi-layer donut landing with Crowned X center, asset focus mode, blue/red influence coloring,
and a one-click PDF report API.

## Quickstart
```bash
# unzip
cd gmmf_donut_nextjs
npm install
npm run dev
# open http://localhost:3000
```

## Customize
- Rings: edit `rings` arrays in `app/page.tsx` and `app/focus/page.tsx`
- Influencers: change the sample arrays (later wire to APIs/Streamlit outputs)
- Colors: red↔blue gradient in `lib/color.ts`
- Net Influence: formula in `lib/metrics.ts`
