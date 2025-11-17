'use client';
import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// 🧠 Connect to your Supabase project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NeuralPulseListener() {
  const controls = useAnimation();
  const audioPing = useRef<HTMLAudioElement>(null);

  // 🎧 Listen for new memory_events in Supabase
  useEffect(() => {
    console.log('🧠 A.I.V.E. Neural Pulse Listener active...');

    // 🔌 Subscribe to the Supabase realtime channel
    const channel = supabase
      .channel('memory-events-listener')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'memory_events' },
        async (payload) => {
          console.log('⚡ New pulse detected:', payload.new);

          // ✨ Animate the pulse glow (Framer Motion)
          await controls.start({
            scale: [1, 1.4, 1],
            opacity: [0.6, 1, 0.6],
            transition: { duration: 1.2, ease: 'easeInOut' },
          });

          // 🎵 Play pulse-detect sound
          audioPing.current?.play();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [controls]);

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-center">
      <motion.div
        animate={controls}
        className="w-6 h-6 rounded-full bg-blue-500 shadow-lg shadow-blue-400/50"
      />
      <p className="text-[10px] text-slate-400 mt-2 font-mono tracking-wide">
        Pulse Active
      </p>
      <audio
        ref={audioPing}
        src="/sounds/pulse-detect.mp3"
        preload="auto"
        volume={0.05}
      />
    </div>
  );
}
