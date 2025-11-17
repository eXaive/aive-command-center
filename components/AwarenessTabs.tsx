"use client";

interface AwarenessTabsProps {
  activeTab: string;
  onChange: (tabId: string) => void;
}

export default function AwarenessTabs({ activeTab, onChange }: AwarenessTabsProps) {
  const tabs = [
    { id: "learning", label: "📘 Learning Feed" },
    { id: "quiz", label: "🧩 Quiz" },
    { id: "causality", label: "🌐 Causal Awareness" },
    { id: "predictions", label: "🔒 Predictions" },
    { id: "purse", label: "🔒 Purse Simulation" },
  ];

  return (
    <nav className="flex justify-center flex-wrap gap-3 sm:gap-4 p-3 text-sm sm:text-base font-medium">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 sm:px-4 py-2 rounded-full transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-blue-600 text-white shadow-md shadow-blue-700/40"
              : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/60"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
