export type Influence = {
  id: string; label: string;
  layer: "outer"|"inner"|"mid";
  group: "Intel"|"Macro"|"MarketCore";
  polarity: number; strength: number;
  value?: number; unit?: string; lastUpdated?: string; sourceUrl?: string;
};
export type FocusState = { asset: "GOLD"|"SPY"|"BTC"|"ETH"|"CUSTOM"; influences: Influence[]; };
