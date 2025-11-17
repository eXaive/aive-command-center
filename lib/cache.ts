// /lib/cache.ts
// A.I.V.E. Universal Cache Engine
// Local JSON cache for API responses, country intel, predictions, models, etc.

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/* ────────────────────────────────────────────────
   📁 ROOT CACHE DIRECTORY
   Each hash-key becomes a JSON file inside:
   .next/cache/gmmf/
────────────────────────────────────────────────── */

const ROOT = path.join(process.cwd(), ".next", "cache", "gmmf");

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    /* ignore */
  }
}

/* ────────────────────────────────────────────────
   🔑 Hash key → file path
   Ensures consistent, collision-resistant cache keys.
────────────────────────────────────────────────── */

function keyToPath(key: string) {
  const h = crypto.createHash("sha1").update(key).digest("hex");
  return path.join(ROOT, `${h}.json`);
}

/* ────────────────────────────────────────────────
   📦 Cache object structure
────────────────────────────────────────────────── */

export type Cached<T> = {
  savedAt: number; // timestamp (ms)
  ttl: number; // seconds
  payload: T;
};

/* ────────────────────────────────────────────────
   📘 readCache()
   Load cached JSON if still valid.
────────────────────────────────────────────────── */

export async function readCache<T = any>(key: string): Promise<T | null> {
  try {
    const file = keyToPath(key);
    const raw = await fs.readFile(file, "utf8");
    const obj = JSON.parse(raw) as Cached<T>;

    // strong validation
    if (
      !obj ||
      typeof obj.savedAt !== "number" ||
      typeof obj.ttl !== "number" ||
      obj.savedAt <= 0 ||
      obj.ttl <= 0
    ) {
      return null;
    }

    const ageSeconds = (Date.now() - obj.savedAt) / 1000;
    if (ageSeconds > obj.ttl) return null;

    return obj.payload;
  } catch {
    return null;
  }
}

/* ────────────────────────────────────────────────
   💾 writeCache()
   Write JSON with TTL seconds.
────────────────────────────────────────────────── */

export async function writeCache<T = any>(
  key: string,
  payload: T,
  ttlSeconds: number
): Promise<void> {
  try {
    if (ttlSeconds <= 0) return; // skip useless cache entry

    await ensureDir(ROOT);

    const file = keyToPath(key);
    const obj: Cached<T> = {
      savedAt: Date.now(),
      ttl: ttlSeconds,
      payload,
    };

    await fs.writeFile(file, JSON.stringify(obj), "utf8");
  } catch {
    /* ignore — cache is non-critical */
  }
}

/* ────────────────────────────────────────────────
   🌐 fetchJSONWithCache()
   Cache wrapper for GET JSON API calls.
────────────────────────────────────────────────── */

export async function fetchJSONWithCache<T = any>(
  url: string,
  ttlSeconds: number,
  init?: RequestInit
): Promise<T> {
  const key = `json:${url}`;

  const cached = await readCache<T>(key);
  if (cached !== null) return cached;

  const response = await fetch(url, {
    ...(init || {}),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`❌ HTTP ${response.status} for ${url}`);
  }

  const data = (await response.json()) as T;

  await writeCache(key, data, ttlSeconds);

  return data;
}

/* ────────────────────────────────────────────────
   📝 fetchTextWithCache()
   Cached text fetcher (HTML, CSV, etc.)
────────────────────────────────────────────────── */

export async function fetchTextWithCache(
  url: string,
  ttlSeconds: number,
  init?: RequestInit
): Promise<string> {
  const key = `text:${url}`;

  const cached = await readCache<string>(key);
  if (cached !== null) return cached;

  const response = await fetch(url, {
    ...(init || {}),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`❌ HTTP ${response.status} for ${url}`);
  }

  const data = await response.text();

  await writeCache(key, data, ttlSeconds);

  return data;
}

/* ────────────────────────────────────────────────
   🧠 Namespace Helper (NEW)
   e.g. "country:intel:USA"
   e.g. "predictions:gold:1d"
   e.g. "cas:confidence:Jamaica"
────────────────────────────────────────────────── */

export function key(namespace: string, id: string | number) {
  return `${namespace}:${id}`;
}
