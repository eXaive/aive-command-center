'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function NeuralHalo({ status = 'Stable' }: { status?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pulseLevel, setPulseLevel] = useState(1);
  const [colorSet, setColorSet] = useState({
    base: '#38bdf8',
    glow: '#0ea5e9',
  });

  // 🧠 Listen for global pulse with sentiment-based color
  useEffect(() => {
    const handler = (event: any) => {
      const sentiment = event.detail?.sentiment || 'Neutral';

      const sentimentColors = {
        Positive: { base: '#5eead4', glow: '#2dd4bf' },
        Negative: { base: '#f87171', glow: '#ef4444' },
        Neutral: { base: '#fbbf24', glow: '#f59e0b' },
      };

      setColorSet(sentimentColors[sentiment] || sentimentColors.Neutral);

      // Pulse intensity spike
      setPulseLevel(2.2);
      setTimeout(() => setPulseLevel(1), 1200);
    };

    window.addEventListener('aive-pulse', handler as EventListener);
    return () => window.removeEventListener('aive-pulse', handler as EventListener);
  }, []);

  // 🔄 Animate neurons
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    const branches = Array.from({ length: 28 }).map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: 40 + Math.random() * 60,
      speed: 0.01 + Math.random() * 0.02,
      offset: Math.random() * 100,
    }));

    function render(t: number) {
      const w = (canvas.width = 220);
      const h = (canvas.height = 220);
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);

      // aura background
      const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 110);
      gradient.addColorStop(0, `${colorSet.base}33`);
      gradient.addColorStop(1, 'rgba(15,23,42,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 2);
      ctx.fill();

      // neuron filaments
      ctx.lineWidth = 1.3;
      ctx.shadowBlur = 15 * pulseLevel;
      ctx.shadowColor = colorSet.glow;
      ctx.strokeStyle = colorSet.base;

      branches.forEach((b) => {
        const pulse = Math.sin(t * 0.002 + b.offset) * 0.4 + 1;
        const r = b.radius * pulse;
        const x = Math.cos(b.angle) * r;
        const y = Math.sin(b.angle) * r;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.stroke();
        b.angle += b.speed;
      });

      ctx.restore();
      animationFrame = requestAnimationFrame(render);
    }

    animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, [pulseLevel, colorSet]);

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colorSet.base}33 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.05 * pulseLevel, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2 / pulseLevel,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      ></motion.div>

      <motion.div
        className="w-[220px] h-[220px] rounded-full border flex items-center justify-center"
        style={{
          borderColor: `${colorSet.base}88`,
          boxShadow: `0 0 ${40 * pulseLevel}px ${colorSet.glow}55`,
        }}
        animate={{
          boxShadow: [
            `0 0 ${30 * pulseLevel}px ${colorSet.glow}33`,
            `0 0 ${70 * pulseLevel}px ${colorSet.glow}99`,
            `0 0 ${30 * pulseLevel}px ${colorSet.glow}33`,
          ],
        }}
        transition={{
          duration: 2 / pulseLevel,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <canvas ref={canvasRef} className="mix-blend-screen" />
      </motion.div>

      <div className="absolute -bottom-6 text-xs text-sky-400 tracking-widest font-light">
        Neural Pulse: {status}
      </div>
    </div>
  );
}
