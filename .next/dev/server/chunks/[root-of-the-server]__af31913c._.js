module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/app/api/news/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rss$2d$parser$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/rss-parser/index.js [app-route] (ecmascript)");
;
async function GET(req) {
    const { searchParams } = new URL(req.url);
    const asset = searchParams.get("asset") || "";
    const topic = searchParams.get("topic") || "global";
    const region = searchParams.get("region") || "";
    const limit = Number(searchParams.get("limit") || 10);
    const parser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rss$2d$parser$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]();
    let feeds = [];
    if (topic.includes("energy") || asset === "OIL") {
        feeds = [
            "https://oilprice.com/rss/main",
            "https://www.reutersagency.com/feed/?best-sectors=energy"
        ];
    } else if (topic.includes("crypto") || [
        "BTC",
        "ETH",
        "SOL"
    ].includes(asset)) {
        feeds = [
            "https://cointelegraph.com/rss",
            "https://news.bitcoin.com/feed/",
            "https://decrypt.co/feed"
        ];
    } else if (topic.includes("politic") || topic.includes("geo")) {
        feeds = [
            "https://feeds.bbci.co.uk/news/world/rss.xml",
            "https://www.reutersagency.com/feed/?best-topics=politics"
        ];
    } else if (topic.includes("economy") || topic.includes("rates") || topic.includes("cpi")) {
        feeds = [
            "https://www.ft.com/rss/economy",
            "https://www.reutersagency.com/feed/?best-sectors=markets-economy"
        ];
    } else {
        feeds = [
            "https://www.reutersagency.com/feed/?best-sectors=markets",
            "https://www.cnbc.com/id/10001147/device/rss/rss.html"
        ];
    }
    try {
        const allItems = [];
        for (const url of feeds){
            try {
                const feed = await parser.parseURL(url);
                if (feed.items?.length) allItems.push(...feed.items);
            } catch (err) {
                console.error("⚠️ RSS fetch failed:", url, err);
            }
        }
        const items = allItems.filter((i)=>i.title && i.link).slice(0, limit).map((i)=>({
                title: i.title,
                link: i.link,
                pubDate: i.pubDate,
                source: new URL(i.link).hostname
            }));
        return Response.json({
            asset,
            topic,
            region,
            total: items.length,
            items
        });
    } catch (e) {
        console.error("❌ Failed to fetch news:", e);
        return Response.json({
            error: "Failed to fetch RSS feed"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__af31913c._.js.map