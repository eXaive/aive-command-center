// components/hive/useSelfAwakeningLoop.ts
"use client";

import { useEffect, useRef } from "react";

/**
 * 💤 useSelfAwakeningLoop — Rebuild
 * Handles automatic "rest" and "awake" dispatch events based on inactivity.
 * If you want A.I.V.E. to remain always awake, simply don't import this file.
 * If you want to re-enable resting cycles, import and call it from page.tsx.
 */
export default function useSelfAwakeningLoop(
  setAwakeState?: (awake: boolean) => void
) {
  const lastInteraction = useRef(Date.now());
  const isResting = useRef(false);

  useEffect(() => {
    const REST_TIMEOUT_MS = 20000; // 20 seconds idle → rest
    const checkInterval = setInterval(() => {
      const now = Date.now();
      const inactiveFor = now - lastInteraction.current;

      if (!isResting.current && inactiveFor > REST_TIMEOUT_MS) {
        console.log("🌙 A.I.V.E. entering rest mode");
        isResting.current = true;
        setAwakeState?.(false);
        window.dispatchEvent(new Event("aive-rest"));
      }
    }, 1000);

    const wake = () => {
      lastInteraction.current = Date.now();
      if (isResting.current) {
        console.log("☀️ A.I.V.E. waking up");
        isResting.current = false;
        setAwakeState?.(true);
        window.dispatchEvent(new Event("aive-awake"));
      }
    };

    // Track user activity
    window.addEventListener("pointerdown", wake);
    window.addEventListener("keydown", wake);
    window.addEventListener("mousemove", wake);

    return () => {
      clearInterval(checkInterval);
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("mousemove", wake);
    };
  }, [setAwakeState]);
}
