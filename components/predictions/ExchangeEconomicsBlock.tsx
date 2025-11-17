"use client";

import { usePredictionFilter } from "@/context/PredictionFilterContext";

export default function ExchangeEconomicsBlock() {
  const { fiscalProfile, exchange } = usePredictionFilter();

  if (!fiscalProfile && !exchange) return null;

  return (
    <div className="p-4 rounded-xl bg-slate-900/50 border border-cyan-800/30">
      <h3 className="text-cyan-300 text-sm font-semibold mb-3">
        📊 Exchange & Economic Profile
      </h3>

      <div className="space-y-2 text-sm text-slate-200">
        {exchange && (
          <p>
            <span className="text-cyan-400 font-semibold">Exchange:</span>{" "}
            {exchange.name} ({exchange.code})
          </p>
        )}

        {fiscalProfile && (
          <>
            <p>
              <span className="text-cyan-400 font-semibold">Interest Rate:</span>{" "}
              {fiscalProfile.interest_rate}
            </p>
            <p>
              <span className="text-cyan-400 font-semibold">
                Inflation Target:
              </span>{" "}
              {fiscalProfile.inflation_target}
            </p>
            <p>
              <span className="text-cyan-400 font-semibold">GDP Growth:</span>{" "}
              {fiscalProfile.gdp_growth}
            </p>

            <p className="text-slate-400 text-xs italic mt-2 border-t border-slate-700/40 pt-2">
              🏦 {fiscalProfile.central_bank} — {fiscalProfile.notes}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
