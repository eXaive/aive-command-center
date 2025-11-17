"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AlertFeed() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data } = await supabase
        .from("watchlist_notifications")
        .select("*, predictions(*)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) setAlerts(data);
    };

    fetchAlerts();

    const channel = supabase
      .channel("watchlist_notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "watchlist_notifications" },
        (payload) => {
          setAlerts((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-xl mt-4">
      <h2 className="text-lg text-yellow-300 font-semibold mb-3">
        ⚡ Real-Time Alerts
      </h2>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-3 bg-slate-800/40 border border-slate-700 rounded"
          >
            <p className="text-slate-300">{alert.message}</p>

            {alert.predictions && (
              <p className="text-blue-300 text-sm mt-2">
                → {alert.predictions.headline}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
