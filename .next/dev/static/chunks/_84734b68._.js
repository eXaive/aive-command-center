(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/NewsFeed.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewsFeed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function NewsFeed({ asset, topic, region }) {
    _s();
    const [news, setNews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NewsFeed.useEffect": ()=>{
            let active = true;
            async function load() {
                setLoading(true);
                try {
                    const res = await fetch(`/api/news?asset=${asset || ""}&topic=${topic || ""}&region=${region || ""}`);
                    const data = await res.json();
                    if (active) setNews(data.items || []);
                } catch (err) {
                    console.error("❌ News fetch failed", err);
                    if (active) setNews([]);
                } finally{
                    if (active) setLoading(false);
                }
            }
            load();
            const timer = setInterval(load, 10 * 60 * 1000); // auto-refresh every 10 minutes
            return ({
                "NewsFeed.useEffect": ()=>{
                    active = false;
                    clearInterval(timer);
                }
            })["NewsFeed.useEffect"];
        }
    }["NewsFeed.useEffect"], [
        asset,
        topic,
        region
    ]);
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-sm text-slate-500",
        children: "Loading news..."
    }, void 0, false, {
        fileName: "[project]/components/NewsFeed.tsx",
        lineNumber: 52,
        columnNumber: 12
    }, this);
    if (!news.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-sm text-slate-500",
        children: "No recent articles found."
    }, void 0, false, {
        fileName: "[project]/components/NewsFeed.tsx",
        lineNumber: 55,
        columnNumber: 12
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3 animate-fadeIn",
        children: news.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: item.link,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "block border rounded-md p-3 hover:bg-slate-50 transition",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm font-medium text-slate-900",
                        children: item.title
                    }, void 0, false, {
                        fileName: "[project]/components/NewsFeed.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[11px] text-slate-500 mt-0.5",
                        children: [
                            item.source && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: item.source
                            }, void 0, false, {
                                fileName: "[project]/components/NewsFeed.tsx",
                                lineNumber: 69,
                                columnNumber: 29
                            }, this),
                            " ",
                            item.pubDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "• ",
                                    new Date(item.pubDate).toLocaleDateString()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/NewsFeed.tsx",
                                lineNumber: 71,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/NewsFeed.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/components/NewsFeed.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/NewsFeed.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(NewsFeed, "F6yDZrO2rMZs5jzX1Q2MMfiqj9g=");
_c = NewsFeed;
var _c;
__turbopack_context__.k.register(_c, "NewsFeed");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/CrashWatch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CrashWatch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://jtvseavjssmprfqnwyoe.supabase.co");
const supabaseKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0dnNlYXZqc3NtcHJmcW53eW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MDY3MDIsImV4cCI6MjA3NzA4MjcwMn0.LxxZFeXNH8k2cHFyvBvAiszHn12ebOTKNFXCBzkgFjk");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
function CrashWatch() {
    _s();
    const [countries, setCountries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [prevCountries, setPrevCountries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [fade, setFade] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [heartbeatSpeed, setHeartbeatSpeed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(3);
    const [utcTime, setUtcTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [flashColor, setFlashColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const prevAvgRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const audioCtx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // === smooth harmonic tone ===
    function playAlertSound(type = "warning") {
        if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        const ctx = audioCtx.current;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        if (type === "warning") {
            osc1.frequency.value = 440;
            osc2.frequency.value = 660;
        } else {
            osc1.frequency.value = 240;
            osc2.frequency.value = 360;
        }
        const start = ctx.currentTime;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.25, start + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 1.8);
        osc1.start();
        osc2.start();
        osc1.stop(start + 2);
        osc2.stop(start + 2);
    }
    // === Supabase fetch ===
    async function fetchCountries() {
        try {
            const { data, error } = await supabase.from("countries").select("*").order("risk_score", {
                ascending: false
            });
            if (error) throw error;
            const map = {};
            data?.forEach((c)=>map[c.id] = c.risk_score);
            setPrevCountries((prev)=>({
                    ...prev,
                    ...map
                }));
            setCountries(data || []);
            setLastUpdated(new Date().toLocaleTimeString());
            setFade(true);
            setTimeout(()=>setFade(false), 400);
        } catch (err) {
            console.error("❌ Error loading countries", err);
        } finally{
            setLoading(false);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrashWatch.useEffect": ()=>{
            fetchCountries();
            const interval = setInterval(fetchCountries, 60_000);
            return ({
                "CrashWatch.useEffect": ()=>clearInterval(interval)
            })["CrashWatch.useEffect"];
        }
    }["CrashWatch.useEffect"], []);
    // === global average ===
    const avgRisk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CrashWatch.useMemo[avgRisk]": ()=>{
            if (!countries.length) return 0;
            return countries.reduce({
                "CrashWatch.useMemo[avgRisk]": (sum, c)=>sum + (c.risk_score || 0)
            }["CrashWatch.useMemo[avgRisk]"], 0) / countries.length;
        }
    }["CrashWatch.useMemo[avgRisk]"], [
        countries
    ]);
    // === global alert trigger ===
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrashWatch.useEffect": ()=>{
            if (!countries.length) return;
            if (prevAvgRisk.current < 80 && avgRisk >= 80) {
                playAlertSound("warning");
                setFlashColor("red");
                setTimeout({
                    "CrashWatch.useEffect": ()=>setFlashColor("")
                }["CrashWatch.useEffect"], 1800);
            } else if (prevAvgRisk.current >= 80 && avgRisk < 80) {
                playAlertSound("stable");
                setFlashColor("blue");
                setTimeout({
                    "CrashWatch.useEffect": ()=>setFlashColor("")
                }["CrashWatch.useEffect"], 1800);
            }
            prevAvgRisk.current = avgRisk;
        }
    }["CrashWatch.useEffect"], [
        avgRisk,
        countries
    ]);
    // === heartbeat / UTC clock ===
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrashWatch.useEffect": ()=>{
            const update = {
                "CrashWatch.useEffect.update": ()=>{
                    const hour = new Date().getUTCHours();
                    setHeartbeatSpeed(hour >= 0 && hour < 7 ? 2 : hour < 14 ? 2.5 : hour < 21 ? 2 : 4);
                    setUtcTime(new Date().toUTCString().split(" ")[4]);
                }
            }["CrashWatch.useEffect.update"];
            update();
            const i1 = setInterval(update, 1000);
            return ({
                "CrashWatch.useEffect": ()=>clearInterval(i1)
            })["CrashWatch.useEffect"];
        }
    }["CrashWatch.useEffect"], []);
    // === color logic ===
    const shimmerColor = avgRisk >= 80 ? "from-red-500 via-rose-500 to-red-400" : avgRisk >= 50 ? "from-amber-400 via-yellow-400 to-amber-300" : "from-blue-400 via-sky-500 to-blue-400";
    const shimmerLabel = avgRisk >= 80 ? "⚠️ Global Stress High" : avgRisk >= 50 ? "🟡 Moderate Risk" : "🟦 Stable Conditions";
    const clockGlow = avgRisk >= 80 ? "text-red-600" : avgRisk >= 50 ? "text-amber-500" : "text-blue-500";
    const flashClass = flashColor === "red" ? "animate-flashRed" : flashColor === "blue" ? "animate-flashBlue" : "";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-aa0b95d6393ec54d" + " " + `bg-white border rounded-lg shadow-sm h-full flex flex-col transition-all relative overflow-hidden ${flashClass}`,
        children: [
            flashColor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-aa0b95d6393ec54d" + " " + `absolute top-0 left-0 right-0 h-1 ${flashColor === "red" ? "bg-red-500" : "bg-blue-500"}`
            }, void 0, false, {
                fileName: "[project]/components/CrashWatch.tsx",
                lineNumber: 167,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-aa0b95d6393ec54d" + " " + "p-4 flex items-center justify-between mb-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "jsx-aa0b95d6393ec54d" + " " + "text-sm font-semibold uppercase tracking-wide text-slate-600",
                        children: "Crash Watch"
                    }, void 0, false, {
                        fileName: "[project]/components/CrashWatch.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            animation: `heartbeat ${heartbeatSpeed}s ease-in-out infinite`
                        },
                        className: "jsx-aa0b95d6393ec54d" + " " + `w-3 h-3 rounded-full bg-gradient-to-r ${shimmerColor}`
                    }, void 0, false, {
                        fileName: "[project]/components/CrashWatch.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CrashWatch.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textShadow: avgRisk >= 80 ? "0 0 8px rgba(220,38,38,0.8)" : avgRisk >= 50 ? "0 0 8px rgba(245,158,11,0.7)" : "0 0 8px rgba(59,130,246,0.7)",
                    animation: `glowPulse ${heartbeatSpeed}s ease-in-out infinite`
                },
                className: "jsx-aa0b95d6393ec54d" + " " + `text-[11px] font-semibold mb-3 ${clockGlow} px-4`,
                children: [
                    "🌐 UTC Time | ",
                    utcTime || "Loading..."
                ]
            }, void 0, true, {
                fileName: "[project]/components/CrashWatch.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-aa0b95d6393ec54d" + " " + `text-xs font-medium mb-2 text-right px-4 ${avgRisk >= 80 ? "text-red-600" : avgRisk >= 50 ? "text-amber-500" : "text-blue-600"}`,
                children: shimmerLabel
            }, void 0, false, {
                fileName: "[project]/components/CrashWatch.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-aa0b95d6393ec54d" + " " + "px-4 pb-4 flex-1 overflow-y-auto",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-aa0b95d6393ec54d" + " " + "text-slate-500 text-sm",
                    children: "Loading countries…"
                }, void 0, false, {
                    fileName: "[project]/components/CrashWatch.tsx",
                    lineNumber: 219,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "jsx-aa0b95d6393ec54d" + " " + `space-y-2 transition-opacity duration-500 ${fade ? "opacity-50" : "opacity-100"}`,
                    children: countries.map((c)=>{
                        const prev = prevCountries[c.id];
                        const hasChanged = prev !== undefined && prev !== c.risk_score;
                        const changeColor = c.risk_score >= 80 ? "bg-red-100" : c.risk_score >= 50 ? "bg-amber-100" : "bg-blue-100";
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "jsx-aa0b95d6393ec54d" + " " + `flex justify-between items-center border-b pb-1 text-sm px-1 rounded transition-all duration-[1500ms] ease-in-out ${hasChanged ? changeColor : "bg-transparent"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-aa0b95d6393ec54d" + " " + "font-medium text-slate-700",
                                    children: c.name
                                }, void 0, false, {
                                    fileName: "[project]/components/CrashWatch.tsx",
                                    lineNumber: 243,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-aa0b95d6393ec54d" + " " + `font-semibold ${c.risk_score >= 80 ? "text-red-600" : c.risk_score >= 50 ? "text-amber-500" : "text-blue-600"}`,
                                    children: c.risk_score
                                }, void 0, false, {
                                    fileName: "[project]/components/CrashWatch.tsx",
                                    lineNumber: 244,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, c.id, true, {
                            fileName: "[project]/components/CrashWatch.tsx",
                            lineNumber: 237,
                            columnNumber: 17
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/CrashWatch.tsx",
                    lineNumber: 221,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/CrashWatch.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-aa0b95d6393ec54d" + " " + "mt-1 text-[11px] text-slate-400 text-right px-4 pb-2",
                children: [
                    "Last updated ",
                    lastUpdated || "–"
                ]
            }, void 0, true, {
                fileName: "[project]/components/CrashWatch.tsx",
                lineNumber: 263,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "aa0b95d6393ec54d",
                children: "@keyframes heartbeat{0%,to{opacity:.85;transform:scale(1)}30%{opacity:1;transform:scale(1.3)}60%{opacity:.95;transform:scale(1.1)}}@keyframes glowPulse{0%,to{filter:brightness();opacity:.9}30%{filter:brightness(1.3);opacity:1}60%{filter:brightness(1.1);opacity:.95}}@keyframes flashRed{0%{box-shadow:0 0 #dc262600}25%{box-shadow:0 0 25px #dc262699}to{box-shadow:0 0 #dc262600}}@keyframes flashBlue{0%{box-shadow:0 0 #3b82f600}25%{box-shadow:0 0 25px #3b82f699}to{box-shadow:0 0 #3b82f600}}.animate-flashRed{animation:2s ease-out flashRed}.animate-flashBlue{animation:2s ease-out flashBlue}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CrashWatch.tsx",
        lineNumber: 162,
        columnNumber: 5
    }, this);
}
_s(CrashWatch, "rJywgYE0+a+FpirU4XvIQOleDDU=");
_c = CrashWatch;
var _c;
__turbopack_context__.k.register(_c, "CrashWatch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/intel/[country]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CountryIntelPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$NewsFeed$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/NewsFeed.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CrashWatch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CrashWatch.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function CountryIntelPage() {
    _s();
    const { country } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [risk, setRisk] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sentiment, setSentiment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Normalize slug and map to ISO code
    const slug = (country ?? "").toString().trim().toLowerCase();
    const COUNTRY_MAP = {
        "united-states": "us",
        "china": "cn",
        "india": "in",
        "russia": "ru",
        "brazil": "br",
        "germany": "de",
        "france": "fr",
        "mexico": "mx",
        "saudi-arabia": "sa",
        "canada": "ca",
        "australia": "au",
        "united-kingdom": "gb",
        "japan": "jp",
        "south-korea": "kr",
        "italy": "it",
        "argentina": "ar",
        "turkey": "tr",
        "south-africa": "za",
        "indonesia": "id",
        "european-union": "eu",
        "nigeria": "ng",
        "egypt": "eg",
        "israel": "il",
        "iran": "ir",
        "pakistan": "pk",
        "singapore": "sg",
        "thailand": "th",
        "vietnam": "vn",
        "philippines": "ph",
        "uae": "ae",
        "qatar": "qa"
    };
    const isoCode = COUNTRY_MAP[slug] || "us";
    const flagUrl = `https://flagcdn.com/h80/${isoCode}.png`;
    const emojiFlag = String.fromCodePoint(...isoCode.toUpperCase().split("").map((ch)=>127397 + ch.charCodeAt(0)));
    // Demo metrics
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CountryIntelPage.useEffect": ()=>{
            const riskLevels = {
                us: 82,
                cn: 76,
                br: 64,
                de: 48,
                jp: 42,
                in: 38
            };
            setRisk(riskLevels[isoCode] ?? Math.floor(Math.random() * 100));
            setSentiment(Math.round(Math.random() * 100) - 50);
        }
    }["CountryIntelPage.useEffect"], [
        isoCode
    ]);
    const color = risk && risk > 70 ? "text-red-400" : risk && risk > 50 ? "text-yellow-300" : "text-emerald-400";
    const sentimentColor = sentiment && sentiment < 0 ? "text-red-400" : "text-emerald-400";
    const sentimentText = sentiment && sentiment < 0 ? "Negative tone — cautious outlook" : "Positive tone — constructive sentiment";
    const formattedCountry = slug.replace(/-/g, " ").replace(/\b\w/g, (c)=>c.toUpperCase()) || "Unknown";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-slate-100 px-6 py-10 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-[0.05] flex justify-center items-start pointer-events-none select-none",
                style: {
                    backgroundImage: `url(https://flagcdn.com/w320/${isoCode}.png)`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center 60px",
                    backgroundSize: "60%"
                }
            }, void 0, false, {
                fileName: "[project]/app/intel/[country]/page.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative max-w-5xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex items-center justify-center w-16 h-12",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/app/intel/[country]/page.tsx",
                                                lineNumber: 73,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: flagUrl,
                                                alt: formattedCountry,
                                                width: 64,
                                                height: 48,
                                                className: "rounded-sm border border-slate-600 bg-slate-900 relative z-10",
                                                unoptimized: true
                                            }, void 0, false, {
                                                fileName: "[project]/app/intel/[country]/page.tsx",
                                                lineNumber: 74,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute text-3xl z-0 opacity-30",
                                                children: emojiFlag
                                            }, void 0, false, {
                                                fileName: "[project]/app/intel/[country]/page.tsx",
                                                lineNumber: 82,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 72,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-2xl font-semibold text-blue-300",
                                                children: [
                                                    formattedCountry,
                                                    " — Intelligence Dashboard"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/intel/[country]/page.tsx",
                                                lineNumber: 86,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-slate-400",
                                                children: "Live financial and geopolitical signals by region"
                                            }, void 0, false, {
                                                fileName: "[project]/app/intel/[country]/page.tsx",
                                                lineNumber: 89,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 85,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push("/"),
                                className: "px-3 py-1.5 rounded-md border border-slate-600 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition",
                                children: "← Back"
                            }, void 0, false, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/intel/[country]/page.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-2 gap-4 mb-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg border border-slate-700 bg-slate-800/60 p-4 shadow-sm backdrop-blur-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xs uppercase text-slate-400 mb-1",
                                        children: "Risk Index"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `text-3xl font-bold ${color}`,
                                        children: risk ?? "--"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-400 mt-1",
                                        children: risk && risk > 70 ? "⚠️ Elevated systemic stress" : risk && risk > 50 ? "⚠️ Caution — medium risk" : "✅ Stable financial conditions"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 107,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg border border-slate-700 bg-slate-800/60 p-4 shadow-sm backdrop-blur-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xs uppercase text-slate-400 mb-1",
                                        children: "News Sentiment"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 117,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `text-3xl font-bold ${sentimentColor}`,
                                        children: sentiment
                                    }, void 0, false, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-400 mt-1",
                                        children: sentimentText
                                    }, void 0, false, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/intel/[country]/page.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold text-blue-300 mb-3",
                                children: "📰 Latest Reports & Analysis"
                            }, void 0, false, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$NewsFeed$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                asset: formattedCountry.toUpperCase(),
                                topic: "macro",
                                region: formattedCountry.toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/intel/[country]/page.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mt-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm uppercase text-slate-400 mb-2",
                                children: "Global Crash Overview"
                            }, void 0, false, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CrashWatch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 140,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/intel/[country]/page.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/intel/[country]/page.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/intel/[country]/page.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s(CountryIntelPage, "IotP4V0v5c4fhFu6Zm4AX68Qmf4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CountryIntelPage;
var _c;
__turbopack_context__.k.register(_c, "CountryIntelPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_84734b68._.js.map