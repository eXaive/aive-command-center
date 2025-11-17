"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface HeartbeatContextType {
  isPulsing: boolean;
  triggerPulse: () => void;
}

const HeartbeatContext = createContext<HeartbeatContextType>({
  isPulsing: false,
  triggerPulse: () => {},
});

export function HeartbeatProvider({ children }: { children: React.ReactNode }) {
  const [isPulsing, setIsPulsing] = useState(false);

  const triggerPulse = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1500);
  };

  return (
    <HeartbeatContext.Provider value={{ isPulsing, triggerPulse }}>
      {children}
    </HeartbeatContext.Provider>
  );
}

export const useHeartbeat = () => useContext(HeartbeatContext);
