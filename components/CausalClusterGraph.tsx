"use client";

import { motion } from "framer-motion";

export default function CausalClusterGraph({
  cause,
  related,
}: {
  cause: string;
  related: string[];
}) {
  const nodes = [
    { id: "root", label: cause, root: true, x: 200, y: 80 },
    ...related.map((r, i) => ({
      id: "n" + i,
      label: r,
      root: false,
      x: 80 + i * 90,
      y: 200,
    })),
  ];

  return (
    <div
      className="
        w-full 
        h-[260px] 
        bg-slate-800/40 
        border 
        border-purple-600/20 
        rounded-xl 
        flex 
        items-center 
        justify-center 
        overflow-visible
      "
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Links */}
        {nodes
          .filter((n) => !n.root)
          .map((n) => (
            <motion.line
              key={n.id + "-line"}
              x1={200}
              y1={80}
              x2={n.x}
              y2={n.y}
              stroke="rgba(168,85,247,0.4)"
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
          ))}

        {/* Nodes */}
        {nodes.map((n) => (
          <motion.g key={n.id}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={n.root ? 26 : 18}
              fill={
                n.root
                  ? "rgba(168,85,247,0.65)"
                  : "rgba(168,85,247,0.35)"
              }
              animate={{
                filter: [
                  "drop-shadow(0 0 0px rgba(168,85,247,0.0))",
                  "drop-shadow(0 0 14px rgba(168,85,247,0.5))",
                  "drop-shadow(0 0 0px rgba(168,85,247,0.0))",
                ],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />

            <text
              x={n.x}
              y={n.y + 4}
              fill="white"
              textAnchor="middle"
              fontSize={n.root ? 11 : 10}
            >
              {n.label}
            </text>
          </motion.g>
        ))}
      </motion.svg>
    </div>
  );
}
