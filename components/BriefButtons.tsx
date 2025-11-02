"use client";

import React from "react";

export default function BriefButton({ label = "Download Investor Brief (PDF)" }: { label?: string }) {
  return (
    <button
      onClick={() => {
        const params = new URLSearchParams(window.location.search);
        const asset = (params.get("asset") || "GOLD").toUpperCase();
        const v = Date.now().toString(); // cache-buster
        window.open(`/api/brief?asset=${asset}&v=${v}`, "_blank");
      }}
      className="px-3 py-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
      title="Download Investor Brief (PDF)"
    >
      {label}
    </button>
  );
}
