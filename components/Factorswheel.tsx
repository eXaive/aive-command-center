"use client";

import React, { useEffect, useMemo, useState } from "react";

/** Lightweight heuristic sentiment via keywords (client-side) */
const POS = ["beats","surge","soar","record","bull","expands","grow","rises","gain","optimism"];
const NEG = ["miss","falls","drop","slump","recession","bear","cuts","loss","default","war"];

function scoreTitle(t: string) {
  const s = (t || "").toLowerCase();
  let sc = 0;
  POS.forEach((w) => (sc += s.includes(w) ? 1 : 0));
  NEG.forEach((w) => (sc -= s.includes(w) ? 1 : 0));
  return sc;
}

type TopicItem = { title: string; pubDate?: string; link?: string };
async function fetchTopic(slug: string) {
  try {
    const r = await fetch(`/api/topic/${slug}`);
    if (!r.ok) return null;
    const d = await r.json();
    return Array.isArray(d?.items) ? d.items as TopicItem[] : null;
  } catch { return null; }
}

/** Convert avg score to fill color */
function colorFor(avg: number) {
  if (avg > 0.6) return "#2563eb";      // strong blue
  if (avg > 0.1) return "#60a5fa";      // mild blue
  if (avg < -0.6) return "#dc2626";     // strong red
  if (avg < -0.1) return "#f87171";     // mild red
  return "#94a3b8";                      // neutral slate
}

/** Simple radial wheel: equal wedges around a circle */
export default function FactorsWheel({
  topics,
  onClickTopic,
  size = 320,
}: {
  topics: string[];
  onClickTopic?: (slug: string) => void;
  size?: number;
}) {
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    let live = true;
    (async () => {
      const result: Record<string, number> = {};
      // pull up to ~20 items per topic and get quick avg
      await Promise.all(
        topics.map(async (slug) => {
          const items = await fetchTopic(slug);
          if (!items || !items.length) { result[slug] = 0; return; }
          const vals = items.slice(0, 20).map((i) => scoreTitle(i.title));
          result[slug] = vals.reduce((a,b)=>a+b,0) / vals.length;
        })
      );
      if (live) setScores(result);
    })();
    return () => { live = false; };
  }, [topics.join(",")]);

  const cx = size/2, cy = size/2, r = size/2 - 12;
  const n = topics.length || 1;
  const arc = (2*Math.PI)/n;

  function wedgePath(i: number) {
    const a0 = -Math.PI/2 + i*arc;
    const a1 = a0 + arc;
    const x0 = cx + r*Math.cos(a0), y0 = cy + r*Math.sin(a0);
    const x1 = cx + r*Math.cos(a1), y1 = cy + r*Math.sin(a1);
    return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`;
  }

  function labelPos(i: number) {
    const a = -Math.PI/2 + i*arc + arc/2;
    const rr = r*0.72;
    return { x: cx + rr*Math.cos(a), y: cy + rr*Math.sin(a), rot: (a*180/Math.PI)+90 };
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-2 text-sm font-semibold">Factors Wheel</div>
      <svg width={size} height={size} className="block mx-auto">
        {/* base ring */}
        <circle cx={cx} cy={cy} r={r} fill="#f1f5f9" />
        {topics.map((slug, i) => {
          const avg = scores[slug] ?? 0;
          const fill = colorFor(avg);
          const {x,y,rot} = labelPos(i);
          return (
            <g key={slug} className="cursor-pointer" onClick={() => onClickTopic?.(slug)}>
              <path d={wedgePath(i)} fill={fill} opacity={0.85} />
              <text
                x={x} y={y}
                fontSize={11}
                textAnchor="middle"
                fill="#0f172a"
                transform={`rotate(${rot.toFixed(1)}, ${x}, ${y})`}
              >
                {slug.replace(/-/g," ")}
              </text>
            </g>
          );
        })}
        {/* center cap */}
        <circle cx={cx} cy={cy} r={r*0.35} fill="white" stroke="#e2e8f0" />
      </svg>
      <div className="mt-2 text-xs text-slate-500">
        Blue = supportive, Red = headwind (quick headline heuristic). Click any wedge to pivot to that topic.
      </div>
    </div>
  );
}
