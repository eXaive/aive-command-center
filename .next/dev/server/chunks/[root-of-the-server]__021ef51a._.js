module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/symbols.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// /lib/symbols.ts
// Maps between internal asset names and Yahoo Finance symbols.
__turbopack_context__.s([
    "mapAssetToSymbol",
    ()=>mapAssetToSymbol,
    "symbolToAsset",
    ()=>symbolToAsset
]);
function mapAssetToSymbol(asset) {
    if (!asset) return null;
    const a = asset.toUpperCase();
    const mapping = {
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
        NEAR: "NEAR-USD"
    };
    return mapping[a] || null;
}
function symbolToAsset(symbol) {
    if (!symbol) return null;
    const s = symbol.toUpperCase();
    const mapping = {
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
        "NEAR-USD": "NEAR"
    };
    return mapping[s] || null;
}
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/cache.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// /lib/cache.ts
__turbopack_context__.s([
    "fetchJSONWithCache",
    ()=>fetchJSONWithCache,
    "fetchTextWithCache",
    ()=>fetchTextWithCache,
    "readCache",
    ()=>readCache,
    "writeCache",
    ()=>writeCache
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
const ROOT = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), ".next", "cache", "gmmf");
async function ensureDir(dir) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(dir, {
        recursive: true
    }).catch(()=>{});
}
function keyToPath(key) {
    const h = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha1").update(key).digest("hex");
    return __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(ROOT, h + ".json");
}
async function readCache(key) {
    try {
        const file = keyToPath(key);
        const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(file, "utf8");
        const obj = JSON.parse(raw);
        if (!obj?.savedAt || !obj?.ttl) return null;
        const age = (Date.now() - obj.savedAt) / 1000;
        if (age > obj.ttl) return null;
        return obj.payload;
    } catch  {
        return null;
    }
}
async function writeCache(key, payload, ttlSeconds) {
    try {
        await ensureDir(ROOT);
        const file = keyToPath(key);
        const obj = {
            savedAt: Date.now(),
            ttl: ttlSeconds,
            payload
        };
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(file, JSON.stringify(obj), "utf8");
    } catch  {
    // ignore
    }
}
async function fetchJSONWithCache(url, ttlSeconds, init) {
    const key = `json:${url}`;
    const cached = await readCache(key);
    if (cached) return cached;
    const r = await fetch(url, {
        ...init || {},
        cache: "no-store"
    });
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
    const data = await r.json();
    await writeCache(key, data, ttlSeconds);
    return data;
}
async function fetchTextWithCache(url, ttlSeconds, init) {
    const key = `text:${url}`;
    const cached = await readCache(key);
    if (cached) return cached;
    const r = await fetch(url, {
        ...init || {},
        cache: "no-store"
    });
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
    const data = await r.text();
    await writeCache(key, data, ttlSeconds);
    return data;
}
}),
"[project]/pages/api/series.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// /pages/api/series.ts
__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$symbols$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/symbols.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cache.ts [api] (ecmascript)");
;
;
const TTL_SECONDS = 15 * 60; // 15 min
async function handler(req, res) {
    const asset = String(req.query.asset || "").toUpperCase();
    const qSym = String(req.query.symbol || "").toUpperCase();
    const symbol = qSym || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$symbols$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["mapAssetToSymbol"])(asset) || "SPY";
    const cacheKey = `yf:${symbol}`;
    const cached = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["readCache"])(cacheKey);
    if (cached) {
        res.status(200).json({
            ...cached,
            source: "cache"
        });
        return;
    }
    // Try yahoo-finance2 (ESM)
    try {
        const mod = await __turbopack_context__.A("[externals]/yahoo-finance2 [external] (yahoo-finance2, esm_import, async loader)").catch(()=>null);
        const yf = mod?.default;
        if (yf) {
            const to = new Date();
            const from = new Date(to.getTime() - 365 * 24 * 3600 * 1000);
            const rows = await yf.historical(symbol, {
                period1: from.toISOString().slice(0, 10),
                period2: to.toISOString().slice(0, 10)
            });
            const series = (rows || []).filter((r)=>r?.date && Number.isFinite(r?.close)).map((r)=>({
                    date: new Date(r.date).toISOString().slice(0, 10),
                    close: Number(r.close)
                }));
            const payload = {
                symbol,
                asset: asset || undefined,
                lastClose: series.length ? series[series.length - 1].close : null,
                series,
                source: "yahoo-finance2"
            };
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["writeCache"])(cacheKey, payload, TTL_SECONDS);
            res.status(200).json(payload);
            return;
        }
    } catch  {
    // fall through
    }
    // Synthetic fallback
    const series = [];
    const today = new Date();
    let base = 100;
    for(let i = 180; i >= 0; i--){
        const d = new Date(today.getTime() - i * 24 * 3600 * 1000);
        if (d.getDay() !== 0 && d.getDay() !== 6) {
            base *= 1 + (Math.random() - 0.5) * 0.01 + Math.sin(i / 12) * 0.001;
            series.push({
                date: d.toISOString().slice(0, 10),
                close: Number(base.toFixed(2))
            });
        }
    }
    const payload = {
        symbol,
        asset: asset || undefined,
        lastClose: series.length ? series[series.length - 1].close : null,
        series,
        source: "synthetic"
    };
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["writeCache"])(cacheKey, payload, TTL_SECONDS);
    res.status(200).json(payload);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__021ef51a._.js.map