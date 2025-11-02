(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CrashWatch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CrashWatch.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// ✅ Supabase connection
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://jtvseavjssmprfqnwyoe.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0dnNlYXZqc3NtcHJmcW53eW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MDY3MDIsImV4cCI6MjA3NzA4MjcwMn0.LxxZFeXNH8k2cHFyvBvAiszHn12ebOTKNFXCBzkgFjk"));
function CountryIntelPage() {
    _s();
    const { country } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [intelFeed, setIntelFeed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [sentimentAvg, setSentimentAvg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [risk, setRisk] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [glowColor, setGlowColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("blue");
    // 🌍 Map slug → ISO code
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
    // 🧠 Fetch regional intel
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CountryIntelPage.useEffect": ()=>{
            const fetchIntel = {
                "CountryIntelPage.useEffect.fetchIntel": async ()=>{
                    const { data, error } = await supabase.from("intel_feed").select("*").eq("region", slug).order("created_at", {
                        ascending: false
                    });
                    if (error) console.error("❌ Error fetching intel:", error);
                    else setIntelFeed(data || []);
                }
            }["CountryIntelPage.useEffect.fetchIntel"];
            fetchIntel();
        }
    }["CountryIntelPage.useEffect"], [
        slug
    ]);
    // 🔁 Real-time listener
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CountryIntelPage.useEffect": ()=>{
            const channel = supabase.channel(`intel-${slug}`).on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "intel_feed"
            }, {
                "CountryIntelPage.useEffect.channel": (payload)=>{
                    const newIntel = payload.new;
                    if (newIntel.region.toLowerCase() === slug) {
                        setIntelFeed({
                            "CountryIntelPage.useEffect.channel": (prev)=>[
                                    newIntel,
                                    ...prev
                                ]
                        }["CountryIntelPage.useEffect.channel"]);
                    }
                }
            }["CountryIntelPage.useEffect.channel"]).subscribe();
            return ({
                "CountryIntelPage.useEffect": ()=>supabase.removeChannel(channel)
            })["CountryIntelPage.useEffect"];
        }
    }["CountryIntelPage.useEffect"], [
        slug
    ]);
    // 🎚️ Calculate sentiment & risk dynamically
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CountryIntelPage.useEffect": ()=>{
            if (intelFeed.length === 0) return;
            const scores = intelFeed.map({
                "CountryIntelPage.useEffect.scores": (i)=>i.impact_score || 50
            }["CountryIntelPage.useEffect.scores"]);
            const avg = scores.reduce({
                "CountryIntelPage.useEffect": (a, b)=>a + b
            }["CountryIntelPage.useEffect"], 0) / scores.length;
            setRisk(Math.round(avg));
            const pos = intelFeed.filter({
                "CountryIntelPage.useEffect": (i)=>i.sentiment_level?.toLowerCase().includes("positive")
            }["CountryIntelPage.useEffect"]).length;
            const neg = intelFeed.filter({
                "CountryIntelPage.useEffect": (i)=>i.sentiment_level?.toLowerCase().includes("negative")
            }["CountryIntelPage.useEffect"]).length;
            const total = intelFeed.length;
            const score = Math.round((pos - neg) / total * 100);
            setSentimentAvg(score);
            if (score > 20) setGlowColor("emerald");
            else if (score < -20) setGlowColor("red");
            else setGlowColor("blue");
        }
    }["CountryIntelPage.useEffect"], [
        intelFeed
    ]);
    // ✨ Display
    const sentimentText = sentimentAvg > 20 ? "🟢 Positive — constructive sentiment" : sentimentAvg < -20 ? "🔴 Negative — cautious outlook" : "🟡 Neutral tone";
    const formattedCountry = slug.replace(/-/g, " ").replace(/\b\w/g, (c)=>c.toUpperCase()) || "Unknown";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-slate-100 px-6 py-10 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-[0.05] flex justify-center items-start pointer-events-none",
                style: {
                    backgroundImage: `url(https://flagcdn.com/w320/${isoCode}.png)`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center 60px",
                    backgroundSize: "60%"
                }
            }, void 0, false, {
                fileName: "[project]/app/intel/[country]/page.tsx",
                lineNumber: 115,
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
                                                className: `absolute inset-0 rounded-full blur-xl animate-pulse bg-${glowColor}-400/30`
                                            }, void 0, false, {
                                                fileName: "[project]/app/intel/[country]/page.tsx",
                                                lineNumber: 131,
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
                                                lineNumber: 134,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 130,
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
                                                lineNumber: 144,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-slate-400",
                                                children: "Live financial and geopolitical signals by region"
                                            }, void 0, false, {
                                                fileName: "[project]/app/intel/[country]/page.tsx",
                                                lineNumber: 147,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 143,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push("/"),
                                className: "px-3 py-1.5 rounded-md border border-slate-600 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition",
                                children: "← Back"
                            }, void 0, false, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/intel/[country]/page.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-2 gap-4 mb-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg border border-slate-700 bg-slate-800/60 p-4 shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xs uppercase text-slate-400 mb-1",
                                        children: "Risk Index"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 163,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `text-3xl font-bold text-${glowColor}-400`,
                                        children: risk || "--"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 164,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg border border-slate-700 bg-slate-800/60 p-4 shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xs uppercase text-slate-400 mb-1",
                                        children: "Sentiment Level"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 168,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `text-3xl font-bold text-${glowColor}-400`,
                                        children: sentimentAvg > 0 ? `+${sentimentAvg}` : sentimentAvg
                                    }, void 0, false, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 169,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-400 mt-1",
                                        children: sentimentText
                                    }, void 0, false, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 172,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/intel/[country]/page.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold text-blue-300 mb-3",
                                children: "🧠 Regional Intel Feed"
                            }, void 0, false, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this),
                            intelFeed.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-400",
                                children: "No intel available yet for this region."
                            }, void 0, false, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: intelFeed.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border border-slate-700 rounded-lg p-4 bg-slate-800/60 hover:bg-slate-700 transition",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-slate-200 font-medium",
                                                children: item.headline
                                            }, void 0, false, {
                                                fileName: "[project]/app/intel/[country]/page.tsx",
                                                lineNumber: 190,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-slate-400 mt-1",
                                                children: item.summary
                                            }, void 0, false, {
                                                fileName: "[project]/app/intel/[country]/page.tsx",
                                                lineNumber: 191,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-slate-500 mt-2",
                                                children: [
                                                    "💥 ",
                                                    item.impact_score,
                                                    " | 🧭 ",
                                                    item.sentiment_level
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/intel/[country]/page.tsx",
                                                lineNumber: 192,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/app/intel/[country]/page.tsx",
                                        lineNumber: 186,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 184,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/intel/[country]/page.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mt-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm uppercase text-slate-400 mb-2",
                                children: "🌐 Global Crash Overview"
                            }, void 0, false, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CrashWatch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/intel/[country]/page.tsx",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/intel/[country]/page.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/intel/[country]/page.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/intel/[country]/page.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
_s(CountryIntelPage, "+tplfAzolFjANNs/P7hi2eLeYo8=", false, function() {
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

//# sourceMappingURL=_958b0795._.js.map