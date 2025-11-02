'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AiveCoreProps {
  trigger: boolean;
}

export default function AiveCore({ trigger }: AiveCoreProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setActive(true);
      const timer = setTimeout(() => setActive(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const particles = Array.from({ length: 12 }); // number of orbiting data points

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
      <div className="relative w-[180px] h-[180px] flex items-center justify-center">
        {/* === Persistent Idle Core Glow === */}
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            opacity: active ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2],
            scale: active ? [1, 1.3, 1] : [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* === Central Core Orb === */}
        <motion.div
          className="w-16 h-16 rounded-full bg-cyan-400/40 blur-xl shadow-[0_0_20px_#22d3ee]"
          animate={{
            scale: active ? [1, 1.4, 1] : [1, 1.1, 1],
            opacity: active ? [0.6, 1, 0.6] : [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* === Rotating Halo Ring === */}
        <motion.div
          className="absolute w-36 h-36 rounded-full border border-cyan-400/20 blur-[1px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        {/* === Orbiting Data Particles (Now Always Visible) === */}
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee]"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: '0 -85px', // orbit distance
              zIndex: 50,
            }}
            animate={{
              rotate: 360,
              opacity: active ? [0.6, 1, 0.6] : [0.2, 0.4, 0.2],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </div>
  );
}
