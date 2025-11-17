// /lib/symbols.ts
// Centralized Asset ↔ Symbol Mapping Engine for A.I.V.E.

/**
 * A.I.V.E. asset → Yahoo Finance compatible symbol.
 * Fully uppercase, whitespace-safe, future-expandable.
 */

const ASSET_TO_SYMBOL: Record<string, string> = {
  // ---- Legacy Markets ----
  GOLD: "GC=F",
  SILVER: "SI=F",
  OIL: "CL=F",
  SPY: "SPY",
  NASDAQ: "^IXIC",
  US10Y: "^TNX",
  DXY: "DX-Y.NYB",
  EURUSD: "EURUSD=X",
  JPYUSD: "JPYUSD=X",

  AAPL: "AAPL",
  TSLA: "TSLA",
  NVDA: "NVDA",

  // ---- Crypto ----
  BTC: "BTC-USD",
  ETH: "ETH-USD",
  SOL: "SOL-USD",
  ADA: "ADA-USD",
  AVAX: "AVAX-USD",
  BNB: "BNB-USD",
  XRP: "XRP-USD",
  DOGE: "DOGE-USD",
  LTC: "LTC-USD",
  DOT: "DOT-USD",
  MATIC: "MATIC-USD",
  LINK: "LINK-USD",
  ATOM: "ATOM-USD",
  ARB: "ARB-USD",
  OP: "OP-USD",
  APT: "APT-USD",
  NEAR: "NEAR-USD",
};

/**
 * Reverse lookup for Yahoo Finance symbol → internal asset code.
 */
const SYMBOL_TO_ASSET: Record<string, string> = Object.fromEntries(
  Object.entries(ASSET_TO_SYMBOL).map(([asset, symbol]) => [symbol, asset])
);

/**
 * Convert internal asset code → Yahoo symbol
 */
export function mapAssetToSymbol(asset?: string): string | null {
  if (!asset) return null;

  const key = asset.trim().toUpperCase();
  return ASSET_TO_SYMBOL[key] ?? null;
}

/**
 * Convert Yahoo symbol → internal asset name
 */
export function symbolToAsset(symbol?: string): string | null {
  if (!symbol) return null;

  const key = symbol.trim().toUpperCase();
  return SYMBOL_TO_ASSET[key] ?? null;
}

/**
 * Utility — returns all supported assets
 * Useful for auto-complete and UI dropdowns.
 */
export function listSupportedAssets(): string[] {
  return Object.keys(ASSET_TO_SYMBOL);
}

/**
 * Utility — returns all supported Yahoo symbols
 */
export function listSupportedSymbols(): string[] {
  return Object.values(ASSET_TO_SYMBOL);
}
