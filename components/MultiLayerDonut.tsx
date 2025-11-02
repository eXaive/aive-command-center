"use client";

import React from "react";

type Segment = { label: string; slug: string; color: string };
type Ring = { inner: number; outer: number; segments: Segment[] };

type LabelMode = "center" | "below" | "path";

type Props = {
  size: number;
  rings: Ring[];
  hideCenter?: boolean;
  onWedgeClick?: (slug: string) => void;
  labelMode?: LabelMode; // NEW
};

function polar(cx: number, cy: number, r: number, ang: number) {
  return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
}

export default function MultiLayerDonut({
  size,
  rings,
  hideCenter,
  onWedgeClick,
  labelMode = "center",
}: Props) {
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} className="select-none">
      {rings.map((ring, rIdx) => {
        const count = ring.segments.length;
        const aStep = (Math.PI * 2) / count;
        const midR = (ring.inner + ring.outer) / 2;

        // subtle ring outline
        return (
          <g key={`ring-${rIdx}`}>
            <circle cx={cx} cy={cy} r={ring.outer} fill="none" stroke="#E5E7EB" strokeWidth={1} />

            {/* optional curved guide for path labels */}
            {labelMode === "path" && (
              <defs>
                <path
                  id={`ring-path-${rIdx}`}
                  d={describeCircle(cx, cy, midR)}
                  fill="none"
                  stroke="none"
                />
              </defs>
            )}

            {ring.segments.map((seg, i) => {
              const ang = i * aStep - Math.PI / 2; // start at top
              const peg = polar(cx, cy, midR, ang);
              const pegRadius = Math.min(20, Math.max(12, size * 0.018));

              return (
                <g
                  key={`seg-${rIdx}-${i}`}
                  onClick={() => onWedgeClick && onWedgeClick(seg.slug)}
                  className="cursor-pointer"
                >
                  {/* peg */}
                  <circle
                    cx={peg.x}
                    cy={peg.y}
                    r={pegRadius}
                    fill={seg.color.startsWith("#") ? seg.color : undefined}
                    className={!seg.color.startsWith("#") ? seg.color : undefined}
                    stroke="#FFF"
                    strokeWidth={1.5}
                    style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,0.08))" }}
                  />

                  {/* label */}
                  {labelMode === "center" && (
                    <text
                      x={peg.x}
                      y={peg.y}
                      fontSize={Math.max(9, size * 0.012)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#111827"
                      style={{ fontWeight: 600 }}
                    >
                      {seg.label}
                    </text>
                  )}

                  {labelMode === "below" && (
                    <text
                      x={peg.x}
                      y={peg.y + pegRadius + 12}
                      fontSize={Math.max(9, size * 0.014)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#111827"
                    >
                      {seg.label}
                    </text>
                  )}

                  {labelMode === "path" && (
                    <text
                      fontSize={Math.max(9, size * 0.014)}
                      fill="#111827"
                      textAnchor="middle"
                    >
                      <textPath
                        href={`#ring-path-${rIdx}`}
                        startOffset={`${(i / count) * 100}%`}
                        dominantBaseline="middle"
                      >
                        {seg.label}
                      </textPath>
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}

      {!hideCenter && (
        <>
          <defs>
            <radialGradient id="centerFade" r="65%">
              <stop offset="0%" stopColor="#fffbe7" />
              <stop offset="100%" stopColor="white" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={rings[0]?.inner ?? size * 0.2} fill="url(#centerFade)" />
        </>
      )}
    </svg>
  );
}

/* Helper: SVG arc for a full circle path (for labelMode="path") */
function describeCircle(x: number, y: number, r: number) {
  const d = [
    `M ${x - r},${y}`,
    `a ${r},${r} 0 1,0 ${r * 2},0`,
    `a ${r},${r} 0 1,0 ${-r * 2},0`,
  ].join(" ");
  return d;
}
