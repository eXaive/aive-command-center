// /lib/symbols.ts
// Maps between internal asset names and Yahoo Finance symbols.

export function mapAssetToSymbol(asset?: string): string | null {
  if (!asset) return null;
  const a = asset.toUpperCase();

  const mapping: Record<string, string> = {
    // ---- Legacy assets ----
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

    // ---- Emerging / Crypto ----
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

  return mapping[a] || null;
}

/**
 * Reverse lookup — converts a Yahoo symbol (like "GC=F" or "BTC-USD")
 * back to the internal app name (like "GOLD" or "BTC").
 */
export function symbolToAsset(symbol?: string): string | null {
  if (!symbol) return null;
  const s = symbol.toUpperCase();

  const mapping: Record<string, string> = {
    // Legacy
    "GC=F": "GOLD",
    "SI=F": "SILVER",
    "CL=F": "OIL",
    "SPY": "SPY",
    "^IXIC": "NASDAQ",
    "^TNX": "US10Y",
    "DX-Y.NYB": "DXY",
    "EURUSD=X": "EURUSD",
    "JPYUSD=X": "JPYUSD",
    "AAPL": "AAPL",
    "TSLA": "TSLA",
    "NVDA": "NVDA",

    // Crypto
    "BTC-USD": "BTC",
    "ETH-USD": "ETH",
    "SOL-USD": "SOL",
    "ADA-USD": "ADA",
    "AVAX-USD": "AVAX",
    "BNB-USD": "BNB",
    "XRP-USD": "XRP",
    "DOGE-USD": "DOGE",
    "LTC-USD": "LTC",
    "DOT-USD": "DOT",
    "MATIC-USD": "MATIC",
    "LINK-USD": "LINK",
    "ATOM-USD": "ATOM",
    "ARB-USD": "ARB",
    "OP-USD": "OP",
    "APT-USD": "APT",
    "NEAR-USD": "NEAR",
  };

  return mapping[s] || null;
}
