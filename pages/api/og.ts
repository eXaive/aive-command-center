// /pages/api/og.ts
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Simple image proxy:
 * - Accepts ?url=<remote image>
 * - Adds UA headers to avoid some CDNs returning low-res/favicons
 * - Pipes the image back with correct content-type & cache headers
 * Use: <img src={`/api/og?url=${encodeURIComponent(imgUrl)}`} />
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const raw = (req.query.url || "") as string;
    if (!raw) return res.status(400).json({ error: "Missing url" });

    let target: URL;
    try {
      target = new URL(raw);
    } catch {
      return res.status(400).json({ error: "Invalid url" });
    }

    // Basic allowlist: only http/https
    if (!/^https?:$/i.test(target.protocol)) {
      return res.status(400).json({ error: "Unsupported protocol" });
    }

    // Fetch with a decent UA; many news CDNs serve different assets by UA
    const r = await fetch(target.toString(), {
      redirect: "follow",
      headers: {
        // Pretend to be a real browser
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        accept:
          "image/avif,image/webp,image/apng,image/*;q=0.8,*/*;q=0.5",
        referer: target.origin,
      },
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: `Upstream ${r.status}` });
    }

    const ct = r.headers.get("content-type") || "image/jpeg";
    const buf = Buffer.from(await r.arrayBuffer());

    res.setHeader("Content-Type", ct);
    // Cache for an hour; tweak as you like
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(buf);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "proxy failed" });
  }
}
