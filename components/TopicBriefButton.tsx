"use client";
import React from "react";

export default function TopicBriefButton({
  slug,
  label = "Download Topic Brief (PDF)",
}: {
  slug: string;
  label?: string;
}) {
  return (
    <button
      onClick={() => {
        const params = new URLSearchParams(window.location.search);
        const asset = (params.get("asset") || "GOLD").toUpperCase();
        const v = Date.now().toString(); // cache-buster
        window.open(`/api/brief.topic?slug=${encodeURIComponent(slug)}&asset=${asset}&v=${v}`, "_blank");
      }}
      className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
      title="Download Topic Brief (PDF)"
    >
      {label}
    </button>
  );
}
