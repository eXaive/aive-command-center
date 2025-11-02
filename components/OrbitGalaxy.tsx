// components/OrbitGalaxy.tsx
"use client";

import React, { useMemo, useRef, useState } from "react";

type Node = { label: string; slug: string; color?: string };
type Ring = { radius: number; nodes: Node[] };

type Meta = {
  [slug: string]: {
    date?: string;
    headline?: string;
    est?: string;
    unit?: string;
    region?: string;
  };
};

export default function OrbitGalaxy({
  size = 700,
  rings,
  onNodeClick,
  pulse = true,
  meta, // NEW: calendar meta keyed by slug
}: {
  size?: number;
  rings: Ring[];
  onNodeClick?: (slug: string) => void;
  pulse?: boolean;
  meta?: Meta;
}) {
  const cx = size / 2;
  const cy = size / 2;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{
    x: number; y: number; label: string; slug: string; color: string;
  } | null>(null);

  const tip = useMemo(() => {
    if (!hover) return { style: { display: "none" } as React.CSSProperties, lines: [] as string[] };

    const pad = 10;
    const m = meta?.[hover.slug];
    const lines: string[] = [hover.label];
    if (m?.date || m?.headline || m?.est) {
      const one = m.date ? `Next: ${m.date}` : "Upcoming";
      const two = m.headline ? `• ${m.headline}` : "";
      const three = m.est ? ` • Est: ${m.est}` : "";
      lines.push(`${one} ${two}${three}`);
    }

    return {
      style: {
        left: hover.x + pad,
        top: hover.y + pad,
        display: "block",
        borderColor: `${hover.color}55`,
        boxShadow: `0 6px 14px ${hover.color}22`,
      } as React.CSSProperties,
      lines,
    };
  }, [hover, meta]);

  return (
    <div ref={wrapRef} className="relative inline-block">
      <style jsx>{`
        @keyframes ringPulse {
          0%   { transform: scale(0.9); opacity: 0.45; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .pulse { animation: ringPulse 1.8s ease-out infinite; transform-origin: center; }
      `}</style>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} onMouseLeave={() => setHover(null)}>
        {/* center glow */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="rgba(234,179,8,0.33)" />
            <stop offset="65%" stopColor="rgba(234,179,8,0.12)" />
            <stop offset="100%" stopColor="rgba(234,179,8,0)" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={Math.max(40, size * 0.12)} fill="url(#centerGlow)" />

        {/* orbits */}
        {rings.map((r, i) => (
          <circle key={`o-${i}`} cx={cx} cy={cy} r={r.radius} fill="none" stroke="#E5E7EB" strokeWidth={1.5} />
        ))}

        {/* nodes */}
        {rings.map((ring, ri) => {
          const N = Math.max(1, ring.nodes.length);
          return ring.nodes.map((n, k) => {
            const color = n.color || "#0F172A";
            const angle = (k / N) * Math.PI * 2 - Math.PI / 2;
            const x = cx + ring.radius * Math.cos(angle);
            const y = cy + ring.radius * Math.sin(angle);
            const lx = cx + (ring.radius + 18) * Math.cos(angle);
            const ly = cy + (ring.radius + 18) * Math.sin(angle);

            const enter = (evt: React.MouseEvent<SVGElement>) => {
              const svg = (evt.currentTarget.ownerSVGElement as SVGSVGElement)!;
              const pt = svg.createSVGPoint();
              pt.x = x; pt.y = y;
              const m = svg.getScreenCTM();
              if (!m) return;
              const s = pt.matrixTransform(m);
              const rect = wrapRef.current?.getBoundingClientRect();
              if (!rect) return;
              setHover({ x: s.x - rect.left, y: s.y - rect.top, label: n.label, slug: n.slug, color });
            };

            return (
              <g key={`n-${ri}-${k}`} className="cursor-pointer">
                {hover?.slug === n.slug && pulse && (
                  <circle cx={x} cy={y} r={10} fill="none" stroke={color} strokeWidth={5} className="pulse" />
                )}
                <circle
                  cx={x} cy={y} r={hover?.slug === n.slug ? 9.5 : 8}
                  fill={color} stroke="white" strokeWidth={1.5}
                  onMouseEnter={enter} onMouseMove={enter}
                  onClick={() => onNodeClick?.(n.slug)}
                />
                <text
                  x={lx} y={ly} fontSize={10.5} textAnchor="middle" alignmentBaseline="middle"
                  fill="#1F2937" style={{ userSelect: "none" }}
                  onMouseEnter={enter} onMouseMove={enter} onClick={() => onNodeClick?.(n.slug)}
                >
                  {n.label}
                </text>
              </g>
            );
          });
        })}
      </svg>

      {/* tooltip */}
      <div
        className="absolute z-30 bg-white border rounded-md px-2.5 py-1.5 text-[12px] text-slate-800 pointer-events-none"
        style={tip.style}
      >
        {tip.lines.map((ln, i) => (
          <div key={i}>{ln}</div>
        ))}
      </div>
    </div>
  );
}
