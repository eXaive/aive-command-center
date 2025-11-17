"use client";

import AssetCard from "./AssetCard";

export default function AssetsGrid({
  assets = ["gold", "silver", "oil", "btc"],
}: { assets?: string[] }) {
  return (
    <section className="w-full">
      <h2 className="text-xl font-semibold mb-4">Live Predictions</h2>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {assets.map((a) => (
          <AssetCard key={a} asset={a} />
        ))}
      </div>
    </section>
  );
}
