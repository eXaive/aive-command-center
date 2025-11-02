// components/OrbitWithCalendar.tsx
"use client";

import React, { useEffect, useState } from "react";
import OrbitGalaxy from "./OrbitGalaxy";

type Node = { label: string; slug: string; color?: string };
type Ring = { radius: number; nodes: Node[] };

export default function OrbitWithCalendar({
  size = 700,
  rings,
  region = "ALL",
  onNodeClick,
}: {
  size?: number;
  rings: Ring[];
  region?: "ALL" | "US" | "EU" | "ASIA";
  onNodeClick?: (slug: string) => void;
}) {
  const [meta, setMeta] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/calendar?region=${encodeURIComponent(region)}`)
      .then(r => r.json())
      .then(d => { if (alive) setMeta(d.events || {}); })
      .catch(() => { if (alive) setMeta({}); });
    return () => { alive = false; };
  }, [region]);

  return (
    <OrbitGalaxy
      size={size}
      rings={rings}
      onNodeClick={onNodeClick}
      pulse
      meta={meta || undefined}
    />
  );
}
