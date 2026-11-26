import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // Language is chosen by URL prefix or by the visitor's saved choice (cookie).
  // The browser's Accept-Language header is ignored on purpose, so new
  // visitors always start in English.
  const headers = new Headers(request.headers);
  headers.delete("accept-language");
  return intl(new NextRequest(request, { headers }));
}

export const config = {
  // Run on every page, but not on API routes, Next internals or files with an extension.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
