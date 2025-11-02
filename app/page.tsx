'use client';
import { useState, useEffect } from 'react';
import IntelFeed from '@/components/IntelFeed';
import SubmitIntel from '@/components/SubmitIntel';
import NeuralHalo from '@/components/NeuralHalo';
import TrendPanel from '@/components/TrendPanel';
import CategoryPanel from '@/components/CategoryPanel';
import StarField from '@/components/StarField';
import GlobeBackground from '@/components/GlobeBackground';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'trends' | 'regions'>('feed');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-6 relative overflow-hidden">
      
      {/* === Space + Globe + Neural Core === */}
      <div className="absolute inset-0 -z-10">
        <StarField />
        <GlobeBackground activeCountry="Global" />
      </div>

      {/* ===== Header Section ===== */}
      <div className="text-center mb-2 z-10">
        <h1 className="text-3xl font-bold text-blue-400 drop-shadow-md">
          🧠 A.I.V.E. Command Center
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Awareness • Intelligence • Verification • Evolution
        </p>
      </div>

      {/* ===== Neural Halo Visualization ===== */}
      <NeuralHalo status="listening" />

      {/* ===== Collapsible Intelligence Panel ===== */}
      <CategoryPanel selectedCategory={activeTab === 'feed' ? 'Countries' : activeTab} />

      {/* ===== Tab Switcher ===== */}
      <div className="flex gap-4 mt-4 mb-6 z-10">
        {['feed', 'trends', 'regions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'feed' | 'trends' | 'regions')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-700/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ===== Dynamic Panels ===== */}
      <div className="w-full max-w-3xl flex flex-col items-center z-10">
        {activeTab === 'feed' && (
          <>
            <SubmitIntel />
            <IntelFeed />
            <TrendPanel />
          </>
        )}

        {activeTab === 'trends' && (
          <div className="p-6 bg-slate-900 rounded-xl text-center w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-2">📈 Trend Awareness</h2>
            <p className="text-sm text-slate-400 mb-3">
              A.I.V.E. aggregates average sentiment and impact scores by region.
              <br />
              (Phase 3-B will visualize this with live analytics.)
            </p>

            <div className="grid grid-cols-3 gap-3 text-xs text-gray-300">
              <div className="p-3 bg-slate-800 rounded-lg">
                <p className="font-semibold text-blue-400">USA</p>
                <p>Pos: 67 % • Impact 78</p>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg">
                <p className="font-semibold text-green-400">India</p>
                <p>Neu: 45 % • Impact 74</p>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg">
                <p className="font-semibold text-amber-400">Canada</p>
                <p>Pos: 72 % • Impact 82</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'regions' && (
          <div className="p-6 bg-slate-900 rounded-xl text-center w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-2">🌍 Regional Intelligence</h2>
            <p className="text-sm text-slate-400 mb-3">
              Each region’s feed and sentiment clusters will appear here.
              Future builds will support collapsible inline panels.
            </p>

            <div className="flex flex-col gap-2 text-xs">
              <div className="p-3 bg-slate-800 rounded-lg">
                <p className="font-semibold text-blue-400">North America</p>
                <p>8 entries • Avg impact 79</p>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg">
                <p className="font-semibold text-green-400">Asia</p>
                <p>12 entries • Avg impact 82</p>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg">
                <p className="font-semibold text-amber-400">Europe</p>
                <p>6 entries • Avg impact 73</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== Footer Tagline ===== */}
      <footer className="mt-8 text-xs text-gray-600 text-center z-10">
        © {new Date().getFullYear()} eX Intelligence Systems • Powered by A.I.V.E.
      </footer>
    </main>
  );
}
