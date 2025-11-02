import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const u = String(req.query.u || "");
    if (!u || !/^https?:\/\//i.test(u)) {
      res.status(400).send("Bad image URL");
      return;
    }
    if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/i.test(u)) {
      res.status(400).send("Forbidden host");
      return;
    }
    const r = await fetch(u, {
      headers: {
        "User-Agent": "Mozilla/5.0 (CrownedX/1.0)",
        "Accept": "image/avif,image/webp,image/*,*/*;q=0.8",
        "Accept-Language": "en",
      },
    });
    if (!r.ok) {
      res.status(502).send("Upstream image error " + r.status);
      return;
    }
    const ct = r.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", ct);
    res.setHeader("Cache-Control", "public, max-age=21600, s-maxage=21600, stale-while-revalidate=86400");
    const buf = Buffer.from(await r.arrayBuffer());
    res.status(200).send(buf);
  } catch {
    res.status(500).send("img proxy failed");
  }
}
