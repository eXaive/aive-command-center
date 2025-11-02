// /lib/cache.ts
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = path.join(process.cwd(), ".next", "cache", "gmmf");
async function ensureDir(dir: string) { await fs.mkdir(dir, { recursive: true }).catch(() => {}); }

function keyToPath(key: string) {
  const h = crypto.createHash("sha1").update(key).digest("hex");
  return path.join(ROOT, h + ".json");
}

export type Cached<T> = { savedAt: number; ttl: number; payload: T };

/** Read JSON cache; returns null if missing or expired. */
export async function readCache<T = any>(key: string): Promise<T | null> {
  try {
    const file = keyToPath(key);
    const raw = await fs.readFile(file, "utf8");
    const obj = JSON.parse(raw) as Cached<T>;
    if (!obj?.savedAt || !obj?.ttl) return null;
    const age = (Date.now() - obj.savedAt) / 1000;
    if (age > obj.ttl) return null;
    return obj.payload;
  } catch {
    return null;
  }
}

/** Write JSON cache with TTL seconds. */
export async function writeCache<T = any>(key: string, payload: T, ttlSeconds: number): Promise<void> {
  try {
    await ensureDir(ROOT);
    const file = keyToPath(key);
    const obj: Cached<T> = { savedAt: Date.now(), ttl: ttlSeconds, payload };
    await fs.writeFile(file, JSON.stringify(obj), "utf8");
  } catch {
    // ignore
  }
}

/** Fetch JSON with cache */
export async function fetchJSONWithCache<T = any>(url: string, ttlSeconds: number, init?: RequestInit): Promise<T> {
  const key = `json:${url}`;
  const cached = await readCache<T>(key);
  if (cached) return cached;
  const r = await fetch(url, { ...(init || {}), cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  const data = (await r.json()) as T;
  await writeCache(key, data, ttlSeconds);
  return data;
}

/** Fetch text with cache */
export async function fetchTextWithCache(url: string, ttlSeconds: number, init?: RequestInit): Promise<string> {
  const key = `text:${url}`;
  const cached = await readCache<string>(key);
  if (cached) return cached;
  const r = await fetch(url, { ...(init || {}), cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  const data = await r.text();
  await writeCache(key, data, ttlSeconds);
  return data;
}
