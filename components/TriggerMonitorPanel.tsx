"use client";

import { useEffect, useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

type TriggerLog = {
  source_table: string;
  function_triggered: string;
  country: string;
  cause: string;
  category: string;
  event_time: string;
};

export default function TriggerMonitorPanel() {
  const [events, setEvents] = useState<TriggerLog[]>([]);
  const [stalledChains, setStalledChains] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const lastActivityRef = useRef(Date.now());

  /* 🧠 Live subscription */
  useEffect(() => {
    const channel = supabase
      .channel("aive_trigger_log_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "aive_trigger_log" },
        (payload) => {
          const newEvent = payload.new as TriggerLog;
          setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
          lastActivityRef.current = Date.now(); // reset inactivity timer
          setIsCollapsed(false); // auto-expand when new events arrive
        }
      )
      .subscribe();

    const fetchLogs = async () => {
      const { data } = await supabase
        .from("aive_trigger_log")
        .select("*")
        .order("event_time", { ascending: false })
        .limit(50);
      setEvents(data || []);
    };
    fetchLogs();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  /* ⚠️ Detect stalled causal→quiz→CAS chains */
  useEffect(() => {
    const checkChains = () => {
      const stalled = new Set<string>();
      const recent = events.slice(0, 50);
      const now = Date.now();

      recent.forEach((ev) => {
        if (ev.source_table === "causal_entries") {
          const chainId = ev.country + "-" + ev.cause;
          const hasQuiz = recent.find(
            (q) =>
              q.source_table === "quiz_questions" &&
              q.country === ev.country &&
              Math.abs(
                new Date(q.event_time).getTime() -
                  new Date(ev.event_time).getTime()
              ) < 10000
          );
          const hasCAS = recent.find(
            (c) =>
              c.source_table === "cas_memory" &&
              c.country === ev.country &&
              Math.abs(
                new Date(c.event_time).getTime() -
                  new Date(ev.event_time).getTime()
              ) < 10000
          );
          if (!hasQuiz || !hasCAS) {
            const age = now - new Date(ev.event_time).getTime();
            if (age > 10000) stalled.add(chainId);
          }
        }
      });
      setStalledChains(stalled);
    };

    const interval = setInterval(checkChains, 3000);
    return () => clearInterval(interval);
  }, [events]);

  /* ⏱️ Auto-collapse after 1 minute of inactivity */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivityRef.current > 60000 && !isCollapsed) {
        setIsCollapsed(true);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isCollapsed]);

  /* 🎨 Color logic */
  const colorForSource = (table: string) => {
    if (table === "causal_entries") return "bg-green-500";
    if (table === "quiz_questions") return "bg-blue-500";
    if (table === "cas_memory") return "bg-purple-500";
    return "bg-yellow-500";
  };

  /* 🪶 Floating non-blocking container */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-24 right-4 z-[40] w-[320px]
                 rounded-xl bg-slate-900/60 border border-slate-700
                 shadow-lg backdrop-blur-md text-xs text-slate-300
                 overflow-hidden flex flex-col pointer-events-auto"
    >
      {/* Header / Toggle */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between px-3 py-2 cursor-pointer
                   bg-slate-800/60 hover:bg-slate-800/90 transition rounded-t-xl"
      >
        <h3 className="text-blue-300 font-semibold text-[11px] uppercase tracking-wider">
          Neural Trigger Monitor
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">
            {events.length > 0
              ? `${events.length} events`
              : "Awaiting signals..."}
          </span>
          {isCollapsed ? (
            <ChevronUp className="w-3 h-3 text-slate-400" />
          ) : (
            <ChevronDown className="w-3 h-3 text-slate-400" />
          )}
        </div>
      </div>

      {/* Collapsible Body */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="p-3 space-y-1.5 overflow-y-auto max-h-[45vh] scrollbar-thin 
                       scrollbar-thumb-slate-700 scrollbar-track-slate-900"
          >
            {events.map((e, i) => {
              const chainId = e.country + "-" + e.cause;
              const isStalled = stalledChains.has(chainId);

              return (
                <motion.div
                  key={e.event_time + i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center justify-between py-1 px-2 rounded-lg 
                             bg-slate-800/60 hover:bg-slate-800/90 transition-colors 
                             ${isStalled ? "border border-yellow-400/40" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        isStalled
                          ? "bg-yellow-400 animate-pulse"
                          : colorForSource(e.source_table)
                      }`}
                    ></span>
                    <span className="text-slate-200 font-medium truncate max-w-[80px]">
                      {e.country || "—"}
                    </span>
                    {e.category && (
                      <span className="text-slate-400 truncate max-w-[60px]">
                        · {e.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 italic hidden sm:inline truncate max-w-[90px]">
                      {e.function_triggered?.replace(/_/g, " ")}
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      {new Date(e.event_time).toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {events.length === 0 && (
              <p className="text-center text-slate-500 text-xs mt-2">
                No trigger activity yet.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
