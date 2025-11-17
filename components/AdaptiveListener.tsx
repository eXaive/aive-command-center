'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdaptiveListener() {
  const supabase = createClientComponentClient();
  const [metrics, setMetrics] = useState({
    confidence_bias: 0.8,
    sentiment_stability: 0.8,
    reflection_depth: 0.8,
  });

  useEffect(() => {
    const channel = supabase
      .channel('aive-adapt')
      .on('broadcast', { event: 'ADAPT_UPDATE' }, (payload) => {
        const data = payload.payload as any;
        setMetrics({
          confidence_bias: data.confidenceBias,
          sentiment_stability: data.sentimentStability,
          reflection_depth: data.reflectionDepth,
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <motion.div
      className="fixed bottom-6 left-6 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/70 text-[11px] text-slate-300 shadow-md"
      animate={{
        boxShadow: `0 0 ${8 + metrics.confidence_bias * 12}px rgba(56,189,248,${metrics.sentiment_stability})`,
      }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
    >
      <p>🧠 <span className="text-cyan-400">Adaptive State</span></p>
      <p>Confidence: {(metrics.confidence_bias * 100).toFixed(0)}%</p>
      <p>Stability: {(metrics.sentiment_stability * 100).toFixed(0)}%</p>
      <p>Depth: {(metrics.reflection_depth * 100).toFixed(0)}%</p>
    </motion.div>
  );
}
