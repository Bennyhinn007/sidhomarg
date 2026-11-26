import { createHash } from "node:crypto";

/**
 * Persistent website visit counter backed by Upstash Redis (REST API).
 * Server-only: the token is read from non-public environment variables and is
 * never sent to the browser. Every function returns null instead of throwing,
 * so a counter outage can never break a page.
 */

const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/+$/, "");
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const salt = process.env.VISIT_COUNTER_SALT ?? "sidhomarg-visits";

export const counterConfigured = Boolean(url && token);

const TOTAL_KEY = "sidhomarg:visits:total";
const SEEN_PREFIX = "sidhomarg:visits:seen:";
/** A visitor is counted at most once per this window, even if they clear cookies. */
export const SESSION_WINDOW_SECONDS = 30 * 60;

// Atomic in Redis: mark this visitor as seen for the window and increment the total
// only if they were not already marked. Returns the current total either way.
const RECORD_SCRIPT = `
if redis.call('SET', KEYS[2], '1', 'NX', 'EX', ARGV[1]) then
  return redis.call('INCR', KEYS[1])
end
return tonumber(redis.call('GET', KEYS[1]) or '0')
`;

async function command(args: (string | number)[]): Promise<unknown> {
  const res = await fetch(url!, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
    signal: AbortSignal.timeout(2500),
  });
  if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
  const data = (await res.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error(data.error);
  return data.result;
}

function toCount(value: unknown): number | null {
  const n = Number(value ?? 0);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Current total without counting a visit. */
export async function readVisitCount(): Promise<number | null> {
  if (!counterConfigured) return null;
  try {
    return toCount(await command(["GET", TOTAL_KEY]));
  } catch (err) {
    console.error("[visit-counter] read failed:", (err as Error).message);
    return null;
  }
}

/**
 * Counts one visit for this visitor unless they were already counted in the
 * current window. Only a one-way hash of IP + browser is stored, never the raw IP.
 */
export async function recordVisit(ip: string, userAgent: string): Promise<number | null> {
  if (!counterConfigured) return null;
  const fingerprint = createHash("sha256").update(`${salt}|${ip}|${userAgent}`).digest("hex").slice(0, 32);
  try {
    const result = await command([
      "EVAL",
      RECORD_SCRIPT,
      2,
      TOTAL_KEY,
      `${SEEN_PREFIX}${fingerprint}`,
      SESSION_WINDOW_SECONDS,
    ]);
    return toCount(result);
  } catch (err) {
    console.error("[visit-counter] record failed:", (err as Error).message);
    return null;
  }
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|scrape|fetch|monitor|preview|lighthouse|pagespeed|headless|phantom|puppeteer|playwright|selenium|curl|wget|python|httpclient|okhttp|axios|node-fetch|go-http|java\/|facebookexternalhit|whatsapp|telegram|discord|embedly|bingpreview/i;

/** Basic bot filter: missing or automated user agents, and browser prefetches. */
export function looksLikeBot(headers: Headers): boolean {
  const ua = headers.get("user-agent") ?? "";
  if (ua.length < 20 || BOT_PATTERN.test(ua)) return true;
  const purpose = `${headers.get("sec-purpose") ?? ""} ${headers.get("purpose") ?? ""}`;
  return /prefetch|prerender/i.test(purpose);
}
