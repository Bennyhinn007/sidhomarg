import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_WINDOW_SECONDS,
  looksLikeBot,
  readVisitCount,
  recordVisit,
} from "@/lib/visit-counter";

// Always run on the server per request; never cache counts.
export const dynamic = "force-dynamic";

const SESSION_COOKIE = "sm_visit";

function respond(count: number | null, setSession = false) {
  const res = NextResponse.json({ count }, { headers: { "Cache-Control": "no-store" } });
  if (setSession) {
    res.cookies.set(SESSION_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // Ends with the browser session, capped at the counting window.
      maxAge: SESSION_WINDOW_SECONDS,
    });
  }
  return res;
}

/** Read the total without counting. Used for page loads later in the same session. */
export async function GET() {
  return respond(await readVisitCount());
}

/** Count a new browsing session (once), then return the total. */
export async function POST(request: NextRequest) {
  const h = request.headers;

  // Only accept calls made by this website's own pages.
  const site = h.get("sec-fetch-site");
  const origin = h.get("origin");
  let originOk = origin === null;
  if (origin) {
    try {
      originOk = new URL(origin).host === request.nextUrl.host;
    } catch {
      originOk = false; // e.g. "null" from sandboxed frames
    }
  }
  const sameOrigin = (site === null || site === "same-origin") && originOk;

  const alreadyCounted = request.cookies.has(SESSION_COOKIE);

  if (!sameOrigin || alreadyCounted || looksLikeBot(h)) {
    return respond(await readVisitCount(), sameOrigin && !alreadyCounted);
  }

  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const count = await recordVisit(ip, h.get("user-agent") ?? "");
  return respond(count, true);
}
