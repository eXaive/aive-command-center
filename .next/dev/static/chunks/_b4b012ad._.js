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
"[project]/components/GlobeView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GlobeView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$globe$2e$gl$2f$dist$2f$react$2d$globe$2e$gl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-globe.gl/dist/react-globe.gl.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://jtvseavjssmprfqnwyoe.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0dnNlYXZqc3NtcHJmcW53eW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MDY3MDIsImV4cCI6MjA3NzA4MjcwMn0.LxxZFeXNH8k2cHFyvBvAiszHn12ebOTKNFXCBzkgFjk"));
const COUNTRY_COORDS = {
    US: {
        lat: 37.0902,
        lng: -95.7129
    },
    CN: {
        lat: 35.8617,
        lng: 104.1954
    },
    IN: {
        lat: 20.5937,
        lng: 78.9629
    },
    DE: {
        lat: 51.1657,
        lng: 10.4515
    },
    JP: {
        lat: 36.2048,
        lng: 138.2529
    },
    BR: {
        lat: -14.235,
        lng: -51.9253
    },
    NG: {
        lat: 9.082,
        lng: 8.6753
    },
    RU: {
        lat: 61.524,
        lng: 105.3188
    },
    ZA: {
        lat: -30.5595,
        lng: 22.9375
    },
    AU: {
        lat: -25.2744,
        lng: 133.7751
    }
};
function GlobeView({ width = 320, height = 320, regionPing }) {
    _s();
    const globeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [hovered, setHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [angle, setAngle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // === Fetch from Supabase ===
    async function loadData() {
        const { data, error } = await supabase.from("countries").select("*");
        if (error) console.error("❌ Error loading Supabase data:", error);
        if (data) setData(data);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobeView.useEffect": ()=>{
            loadData();
            const channel = supabase.channel("countries-live").on("postgres_changes", {
                event: "UPDATE",
                schema: "public",
                table: "countries"
            }, {
                "GlobeView.useEffect.channel": (payload)=>{
                    const updated = payload.new;
                    setData({
                        "GlobeView.useEffect.channel": (prev)=>prev.map({
                                "GlobeView.useEffect.channel": (c)=>c.id === updated.id ? updated : c
                            }["GlobeView.useEffect.channel"])
                    }["GlobeView.useEffect.channel"]);
                }
            }["GlobeView.useEffect.channel"]).subscribe();
            return ({
                "GlobeView.useEffect": ()=>{
                    supabase.removeChannel(channel);
                }
            })["GlobeView.useEffect"];
        }
    }["GlobeView.useEffect"], []);
    // === Build globe labels ===
    const labels = Object.keys(COUNTRY_COORDS).map((code)=>{
        const match = data.find((c)=>c.region?.toUpperCase() === code.toUpperCase());
        const score = match?.risk_score ?? 0;
        let color = "rgba(147,197,253,0.9)";
        if (score >= 80) color = "rgba(239,68,68,0.9)";
        else if (score >= 60) color = "rgba(251,191,36,0.9)";
        return {
            ...COUNTRY_COORDS[code],
            text: code,
            size: hovered === code ? 3.2 : 1.6,
            color: hovered === code ? "rgba(255,255,255,1)" : color,
            risk_score: score,
            name: match?.name || code
        };
    });
    // === Auto-focus on selected region ===
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobeView.useEffect": ()=>{
            if (!globeRef.current) return;
            if (regionPing && COUNTRY_COORDS[regionPing]) {
                const coords = COUNTRY_COORDS[regionPing];
                globeRef.current.pointOfView({
                    lat: coords.lat,
                    lng: coords.lng,
                    altitude: 1.5
                }, 1500);
            }
        }
    }["GlobeView.useEffect"], [
        regionPing
    ]);
    // === Rotate radar sweep head ===
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobeView.useEffect": ()=>{
            const timer = setInterval({
                "GlobeView.useEffect.timer": ()=>{
                    setAngle({
                        "GlobeView.useEffect.timer": (prev)=>(prev + 2) % 360
                    }["GlobeView.useEffect.timer"]);
                }
            }["GlobeView.useEffect.timer"], 100);
            return ({
                "GlobeView.useEffect": ()=>clearInterval(timer)
            })["GlobeView.useEffect"];
        }
    }["GlobeView.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-9982f52ab4faa8ae" + " " + "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$globe$2e$gl$2f$dist$2f$react$2d$globe$2e$gl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                ref: globeRef,
                width: width,
                height: height,
                backgroundColor: "rgba(0,0,0,0)",
                globeImageUrl: "//unpkg.com/three-globe/example/img/earth-dark.jpg",
                bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png",
                showAtmosphere: true,
                atmosphereColor: "lightskyblue",
                atmosphereAltitude: 0.2,
                labelsData: labels,
                labelLat: (d)=>d.lat,
                labelLng: (d)=>d.lng,
                labelText: (d)=>d.text,
                labelSize: (d)=>d.size,
                labelColor: (d)=>d.color,
                labelDotRadius: 0.6,
                labelResolution: 2,
                animateIn: true,
                onLabelHover: (label)=>setHovered(label ? label.text : null),
                onLabelClick: (label)=>setHovered(label.text),
                labelAltitude: (d)=>hovered === d.text ? 0.05 : 0.01
            }, void 0, false, {
                fileName: "[project]/components/GlobeView.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            hovered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-9982f52ab4faa8ae" + " " + "absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900/90 text-slate-100 text-xs rounded-md px-3 py-2 shadow-lg backdrop-blur-sm border border-slate-700 pointer-events-none animate-fade",
                children: (()=>{
                    const country = labels.find((l)=>l.text === hovered);
                    const risk = country?.risk_score ?? 0;
                    const status = risk >= 80 ? "⚠️ High Risk" : risk >= 60 ? "🟡 Moderate" : "🟦 Stable";
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9982f52ab4faa8ae",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9982f52ab4faa8ae" + " " + "font-semibold text-sm",
                                children: country?.name
                            }, void 0, false, {
                                fileName: "[project]/components/GlobeView.tsx",
                                lineNumber: 158,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9982f52ab4faa8ae" + " " + "text-amber-300",
                                children: [
                                    "Risk Score: ",
                                    risk
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/GlobeView.tsx",
                                lineNumber: 159,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9982f52ab4faa8ae" + " " + "text-slate-400",
                                children: status
                            }, void 0, false, {
                                fileName: "[project]/components/GlobeView.tsx",
                                lineNumber: 160,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/GlobeView.tsx",
                        lineNumber: 157,
                        columnNumber: 15
                    }, this);
                })()
            }, void 0, false, {
                fileName: "[project]/components/GlobeView.tsx",
                lineNumber: 146,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-9982f52ab4faa8ae" + " " + "absolute inset-0 flex items-center justify-center pointer-events-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9982f52ab4faa8ae" + " " + "w-[160%] h-[160%] rounded-full bg-[conic-gradient(from_0deg,rgba(59,130,246,0.2)_0deg,rgba(250,204,21,0.25)_60deg,transparent_120deg)] animate-radar blur-xl opacity-40"
                    }, void 0, false, {
                        fileName: "[project]/components/GlobeView.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            transform: `rotate(${angle}deg) translateX(120px)`
                        },
                        className: "jsx-9982f52ab4faa8ae" + " " + "absolute w-4 h-4 rounded-full bg-amber-300 blur-md opacity-80 animate-pulse"
                    }, void 0, false, {
                        fileName: "[project]/components/GlobeView.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/GlobeView.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-9982f52ab4faa8ae" + " " + "absolute top-3 right-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-md text-[11px] text-slate-700 p-2 shadow-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9982f52ab4faa8ae" + " " + "font-semibold text-[12px] mb-1 text-slate-800",
                        children: "Legend"
                    }, void 0, false, {
                        fileName: "[project]/components/GlobeView.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9982f52ab4faa8ae" + " " + "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-9982f52ab4faa8ae" + " " + "w-3 h-3 rounded-full bg-blue-400"
                            }, void 0, false, {
                                fileName: "[project]/components/GlobeView.tsx",
                                lineNumber: 184,
                                columnNumber: 11
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-9982f52ab4faa8ae",
                                children: "Stable"
                            }, void 0, false, {
                                fileName: "[project]/components/GlobeView.tsx",
                                lineNumber: 184,
                                columnNumber: 65
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/GlobeView.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9982f52ab4faa8ae" + " " + "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-9982f52ab4faa8ae" + " " + "w-3 h-3 rounded-full bg-amber-400"
                            }, void 0, false, {
                                fileName: "[project]/components/GlobeView.tsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-9982f52ab4faa8ae",
                                children: "Moderate"
                            }, void 0, false, {
                                fileName: "[project]/components/GlobeView.tsx",
                                lineNumber: 187,
                                columnNumber: 66
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/GlobeView.tsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9982f52ab4faa8ae" + " " + "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-9982f52ab4faa8ae" + " " + "w-3 h-3 rounded-full bg-red-500"
                            }, void 0, false, {
                                fileName: "[project]/components/GlobeView.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-9982f52ab4faa8ae",
                                children: "High Risk"
                            }, void 0, false, {
                                fileName: "[project]/components/GlobeView.tsx",
                                lineNumber: 190,
                                columnNumber: 64
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/GlobeView.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/GlobeView.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "9982f52ab4faa8ae",
                children: "@keyframes fade{0%{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}.animate-fade{animation:.3s ease-out forwards fade}@keyframes radar{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.animate-radar{transform-origin:50%;animation:6s linear infinite radar}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/GlobeView.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_s(GlobeView, "ruvEWe4gaf33uKtAFIpVLKUalyY=");
_c = GlobeView;
var _c;
__turbopack_context__.k.register(_c, "GlobeView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CrashWatch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CrashWatch.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlobeView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GlobeView.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function HomePage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-50 text-slate-800 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-30 bg-white/80 backdrop-blur border-b shadow-sm mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-6 py-4 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl md:text-3xl font-bold tracking-tight text-slate-900",
                                    children: "eX Intelligence Dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 13,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-600",
                                    children: "Real-time global financial risk intelligence powered by Supabase ⚡️"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 16,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 12,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/crowned_x.svg",
                            alt: "eX Logo",
                            className: "w-10 h-10 opacity-80"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto grid md:grid-cols-[260px,1fr,260px] gap-4 items-start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CrashWatch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "rounded-xl border bg-white p-6 shadow-sm min-h-[600px] grid place-items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between",
                                    children: [
                                        "🌍 Global Overview",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-slate-500 font-normal",
                                            children: "Connected to Supabase ✅"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 39,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border rounded-lg bg-slate-100 grid place-items-center h-[400px]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlobeView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        width: 420,
                                        height: 360,
                                        title: "Global Risk View"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 44,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 43,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "rounded-xl border bg-white p-6 shadow-sm min-h-[600px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm uppercase tracking-wide text-slate-500 mb-2",
                                children: "Predictive Timeline"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-600 mb-4",
                                children: "This panel will visualize risk trajectories and prediction trends over time."
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border rounded-lg p-3 text-center text-slate-400 text-sm",
                                children: "Coming soon: Timeline with historical alerts, market data, and forecast indicators."
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "text-center text-xs text-slate-500 mt-10 pb-6",
                children: "v1.0 — GMMF Baseline · Powered by Supabase + Next.js · Designed by eX 🜲"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_b4b012ad._.js.map