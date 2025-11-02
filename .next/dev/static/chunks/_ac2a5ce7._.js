(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/symbols.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/NewsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function NewsPanel({ asset }) {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NewsPanel.useEffect": ()=>{
            async function loadNews() {
                try {
                    setLoading(true);
                    const res = await fetch(`/api/news?asset=${asset}`);
                    const data = await res.json();
                    setItems(data || []);
                } catch (err) {
                    console.error("⚠️ Failed to load RSS feed:", err);
                } finally{
                    setLoading(false);
                }
            }
            loadNews();
        }
    }["NewsPanel.useEffect"], [
        asset
    ]);
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-3 text-sm text-slate-500",
        children: [
            "Loading ",
            asset,
            " headlines..."
        ]
    }, void 0, true, {
        fileName: "[project]/components/NewsPanel.tsx",
        lineNumber: 38,
        columnNumber: 7
    }, this);
    if (!items.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-3 text-sm text-slate-500",
        children: [
            "No headlines found for ",
            asset,
            "."
        ]
    }, void 0, true, {
        fileName: "[project]/components/NewsPanel.tsx",
        lineNumber: 45,
        columnNumber: 7
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: items.map((n, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border bg-white p-3 hover:shadow-md transition cursor-pointer",
                onClick: ()=>n.link && window.open(n.link, "_blank"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: `https://source.unsplash.com/600x400/?${asset},finance,market`,
                                alt: n.title,
                                width: 100,
                                height: 70,
                                className: "rounded-md object-cover",
                                unoptimized: true
                            }, void 0, false, {
                                fileName: "[project]/components/NewsPanel.tsx",
                                lineNumber: 60,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/NewsPanel.tsx",
                            lineNumber: 59,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-[13px] text-slate-800 leading-tight",
                                    children: n.title
                                }, void 0, false, {
                                    fileName: "[project]/components/NewsPanel.tsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, this),
                                n.summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-slate-600 mt-1 line-clamp-2",
                                    children: n.summary
                                }, void 0, false, {
                                    fileName: "[project]/components/NewsPanel.tsx",
                                    lineNumber: 76,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mt-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-[11px] px-1.5 py-0.5 rounded ${n.sentiment && n.sentiment > 0.2 ? "bg-green-100 text-green-700" : n.sentiment && n.sentiment < -0.2 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`,
                                            children: n.sentiment && n.sentiment > 0.2 ? "Positive" : n.sentiment && n.sentiment < -0.2 ? "Negative" : "Neutral"
                                        }, void 0, false, {
                                            fileName: "[project]/components/NewsPanel.tsx",
                                            lineNumber: 82,
                                            columnNumber: 17
                                        }, this),
                                        n.source && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[11px] text-slate-500",
                                            children: n.source
                                        }, void 0, false, {
                                            fileName: "[project]/components/NewsPanel.tsx",
                                            lineNumber: 98,
                                            columnNumber: 19
                                        }, this),
                                        n.pubDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[11px] text-slate-400",
                                            children: new Date(n.pubDate).toLocaleDateString()
                                        }, void 0, false, {
                                            fileName: "[project]/components/NewsPanel.tsx",
                                            lineNumber: 101,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/NewsPanel.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/NewsPanel.tsx",
                            lineNumber: 70,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/NewsPanel.tsx",
                    lineNumber: 58,
                    columnNumber: 11
                }, this)
            }, i, false, {
                fileName: "[project]/components/NewsPanel.tsx",
                lineNumber: 53,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/NewsPanel.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(NewsPanel, "X0A+44AtCQpjgFsTFhgdow3TGVs=");
_c = NewsPanel;
var _c;
__turbopack_context__.k.register(_c, "NewsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/focus/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FocusPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$symbols$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/symbols.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$NewsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/NewsPanel.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function LineChart({ rows }) {
    if (!rows?.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-[160px] grid place-items-center text-xs text-slate-500 bg-white rounded border",
            children: "No price data"
        }, void 0, false, {
            fileName: "[project]/app/focus/page.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, this);
    }
    const w = 520, h = 180, pad = 16;
    const values = rows.map((r)=>r.close);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const x = (i)=>pad + i * (w - 2 * pad) / Math.max(rows.length - 1, 1);
    const y = (v)=>max > min ? h - pad - (v - min) * (h - 2 * pad) / (max - min) : h / 2;
    const path = rows.map((r, i)=>`${i ? "L" : "M"} ${x(i)} ${y(r.close)}`).join(" ");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: w,
        height: h,
        className: "w-full h-[180px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: 0,
                y: 0,
                width: w,
                height: h,
                fill: "white"
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: path,
                fill: "none",
                stroke: "#2563eb",
                strokeWidth: 2
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: x(0),
                cy: y(values[0]),
                r: 2.5,
                fill: "#94a3b8"
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: x(rows.length - 1),
                cy: y(values[values.length - 1]),
                r: 3,
                fill: "#0f172a"
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/focus/page.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_c = LineChart;
/* ---------- Sentiment Gauge ---------- */ function SentimentGauge({ avg }) {
    const label = avg > 0.3 ? "Bullish" : avg < -0.3 ? "Bearish" : "Neutral";
    const color = avg > 0.3 ? "#22c55e" : avg < -0.3 ? "#ef4444" : "#9ca3af";
    const intensity = Math.abs(avg) * 100;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full border rounded-lg p-4 bg-white flex flex-col items-center justify-center text-center shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs uppercase text-slate-500 mb-1",
                children: "Current Market Sentiment"
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-2xl font-bold",
                style: {
                    color
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full mt-2 h-2 rounded-full bg-slate-100 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full transition-all duration-500",
                    style: {
                        width: `${intensity}%`,
                        backgroundColor: color
                    }
                }, void 0, false, {
                    fileName: "[project]/app/focus/page.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-[11px] text-slate-500 mt-1",
                children: [
                    "Average Score: ",
                    avg.toFixed(2)
                ]
            }, void 0, true, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/focus/page.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_c1 = SentimentGauge;
/* ---------- NEW: Sentiment Trend Chart ---------- */ function SentimentTrendChart({ data }) {
    if (!data?.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-[160px] grid place-items-center text-xs text-slate-500 bg-white rounded border",
            children: "No sentiment history"
        }, void 0, false, {
            fileName: "[project]/app/focus/page.tsx",
            lineNumber: 71,
            columnNumber: 7
        }, this);
    }
    const w = 520, h = 180, pad = 20;
    const min = Math.min(...data.map((d)=>d.avg));
    const max = Math.max(...data.map((d)=>d.avg));
    const x = (i)=>pad + i * (w - 2 * pad) / Math.max(data.length - 1, 1);
    const y = (v)=>h / 2 - v * (h / 2 - pad); // center baseline
    const path = data.map((d, i)=>`${i ? "L" : "M"} ${x(i)} ${y(d.avg)}`).join(" ");
    const fillColor = "url(#grad)";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: w,
        height: h,
        className: "w-full h-[180px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                    id: "grad",
                    x1: "0",
                    y1: "0",
                    x2: "0",
                    y2: "1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "0%",
                            stopColor: "#22c55e",
                            stopOpacity: "0.7"
                        }, void 0, false, {
                            fileName: "[project]/app/focus/page.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "50%",
                            stopColor: "#9ca3af",
                            stopOpacity: "0.4"
                        }, void 0, false, {
                            fileName: "[project]/app/focus/page.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "100%",
                            stopColor: "#ef4444",
                            stopOpacity: "0.7"
                        }, void 0, false, {
                            fileName: "[project]/app/focus/page.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/focus/page.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: 0,
                y: 0,
                width: w,
                height: h,
                fill: "white"
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: path,
                fill: "none",
                stroke: fillColor,
                strokeWidth: 2.5
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: 0,
                x2: w,
                y1: h / 2,
                y2: h / 2,
                stroke: "#e2e8f0",
                strokeDasharray: "4 2"
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                x: w - pad,
                y: pad + 10,
                fontSize: "10",
                fill: "#22c55e",
                children: "Bullish"
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                x: w - pad,
                y: h - pad,
                fontSize: "10",
                fill: "#ef4444",
                children: "Bearish"
            }, void 0, false, {
                fileName: "[project]/app/focus/page.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/focus/page.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_c2 = SentimentTrendChart;
function FocusPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const asset = (params.get("asset") || "GOLD").toUpperCase();
    const symbol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$symbols$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapAssetToSymbol"])(asset);
    const [series, setSeries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [news, setNews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [avgSentiment, setAvgSentiment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [sentimentHistory, setSentimentHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FocusPage.useEffect": ()=>{
            async function fetchData() {
                setLoading(true);
                try {
                    const [seriesRes, newsRes] = await Promise.all([
                        fetch(`/api/series?symbol=${symbol}`),
                        fetch(`/api/news?asset=${asset}&limit=20`)
                    ]);
                    const sJson = await seriesRes.json();
                    const nJson = await newsRes.json();
                    setSeries(sJson.series || []);
                    const items = nJson.items || [];
                    setNews(items);
                    // Calculate current average sentiment
                    const scores = items.map({
                        "FocusPage.useEffect.fetchData.scores": (x)=>x.sentiment || 0
                    }["FocusPage.useEffect.fetchData.scores"]);
                    const avg = scores.length ? scores.reduce({
                        "FocusPage.useEffect.fetchData": (a, b)=>a + b
                    }["FocusPage.useEffect.fetchData"], 0) / scores.length : 0;
                    setAvgSentiment(avg);
                    // Build fake 7-day sentiment memory (simulated history)
                    const hist = [];
                    for(let i = 6; i >= 0; i--){
                        const day = new Date();
                        day.setDate(day.getDate() - i);
                        // Small variance simulation (you can later replace with a real DB)
                        const noise = (Math.random() - 0.5) * 0.3;
                        hist.push({
                            date: day.toISOString().slice(0, 10),
                            avg: Math.max(-1, Math.min(1, avg + noise))
                        });
                    }
                    setSentimentHistory(hist);
                } catch (err) {
                    console.error("FOCUS PAGE ERROR:", err);
                } finally{
                    setLoading(false);
                }
            }
            fetchData();
        }
    }["FocusPage.useEffect"], [
        asset,
        symbol
    ]);
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen grid place-items-center text-slate-500",
        children: [
            "Loading ",
            asset,
            " analysis..."
        ]
    }, void 0, true, {
        fileName: "[project]/app/focus/page.tsx",
        lineNumber: 158,
        columnNumber: 7
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-50 py-8 px-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-5xl mx-auto space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold text-slate-900",
                    children: [
                        asset,
                        " Focus Analysis"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/focus/page.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SentimentGauge, {
                    avg: avgSentiment
                }, void 0, false, {
                    fileName: "[project]/app/focus/page.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg border bg-white p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-semibold text-slate-700 mb-2",
                            children: "7-Day Sentiment Trend"
                        }, void 0, false, {
                            fileName: "[project]/app/focus/page.tsx",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SentimentTrendChart, {
                            data: sentimentHistory
                        }, void 0, false, {
                            fileName: "[project]/app/focus/page.tsx",
                            lineNumber: 174,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/focus/page.tsx",
                    lineNumber: 172,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg border bg-white p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-semibold text-slate-700 mb-2",
                            children: [
                                "Recent Price Trend (",
                                symbol,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/focus/page.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineChart, {
                            rows: series
                        }, void 0, false, {
                            fileName: "[project]/app/focus/page.tsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/focus/page.tsx",
                    lineNumber: 178,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg border bg-white p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-semibold text-slate-700 mb-3",
                            children: "News Sentiment Feed"
                        }, void 0, false, {
                            fileName: "[project]/app/focus/page.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$NewsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            asset: asset
                        }, void 0, false, {
                            fileName: "[project]/app/focus/page.tsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/focus/page.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-[11px] text-slate-500 italic mt-4",
                    children: "This information is for educational purposes only and should not be construed as financial advice."
                }, void 0, false, {
                    fileName: "[project]/app/focus/page.tsx",
                    lineNumber: 190,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/focus/page.tsx",
            lineNumber: 165,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/focus/page.tsx",
        lineNumber: 164,
        columnNumber: 5
    }, this);
}
_s(FocusPage, "yIzqsUUo5rNwvNl6S82X9dQUw0s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c3 = FocusPage;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "LineChart");
__turbopack_context__.k.register(_c1, "SentimentGauge");
__turbopack_context__.k.register(_c2, "SentimentTrendChart");
__turbopack_context__.k.register(_c3, "FocusPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_ac2a5ce7._.js.map