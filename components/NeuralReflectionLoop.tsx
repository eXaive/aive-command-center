'use client';
import { useEffect } from 'react';

export default function NeuralReflectionLoop() {
  useEffect(() => {
    console.log('🧬 A.I.V.E. reflection loop initialized...');

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/reflect', { method: 'POST' });
        const data = await res.json();

        if (data.success) {
          console.log('🤔 A.I.V.E. self-reflected:', data.summary);
          // optional: broadcast a pulse event
          window.dispatchEvent(new CustomEvent('aive-pulse', { detail: { sentiment: 'Neutral' } }));
        }
      } catch (err) {
        console.warn('⚠️ Reflection loop error:', err);
      }
    }, 60000); // every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}
