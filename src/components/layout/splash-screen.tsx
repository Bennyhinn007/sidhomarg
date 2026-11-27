import { getTranslations } from "next-intl/server";

/** How long the opening loader stays on screen before fading out. */
export const SPLASH_MS = 3000;
const SEEN_KEY = "sm-splash-seen";

/*
 * Runs while the page is still being parsed, before anything below is painted.
 * Shows the loader only on the first page of a browsing session (per tab), and
 * never for bots, link previews or visitors who prefer reduced motion.
 * Hiding is done by a CSS animation, so the loader can never get stuck, even if
 * the rest of the site's JavaScript fails to load.
 */
const script = `(function () {
  var d = document.documentElement;
  try {
    if (sessionStorage.getItem("${SEEN_KEY}")) return;
    if (/bot|crawl|spider|slurp|preview|lighthouse|pagespeed|headless/i.test(navigator.userAgent)) return;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    sessionStorage.setItem("${SEEN_KEY}", "1");
  } catch (e) { return; }
  var s = document.getElementById("sm-splash");
  var v = document.getElementById("sm-splash-video");
  if (!s || !v) return;
  d.setAttribute("data-splash", "");
  v.muted = true;
  v.setAttribute("muted", "");
  v.poster = v.getAttribute("data-poster");
  v.src = v.getAttribute("data-src");
  var p = v.play && v.play();
  if (p && p.catch) p.catch(function () {});
  var done = false;
  function end() {
    if (done) return;
    done = true;
    d.removeAttribute("data-splash");
    try { v.pause(); v.removeAttribute("src"); v.load(); } catch (e) {}
  }
  s.addEventListener("animationend", end);
  setTimeout(end, ${SPLASH_MS + 1200});
  var b = document.getElementById("sm-splash-skip");
  if (b) b.addEventListener("click", end);
})();`;

/**
 * Opening loader: plays /loading/loader.mp4 (the Sidhomarg seal) on a white screen
 * for 3 seconds, once per visit. Hidden by default; the inline script turns it on.
 */
export async function SplashScreen() {
  const t = await getTranslations("Splash");

  return (
    <>
      <div id="sm-splash" className="splash" role="status" aria-label={t("label")}>
        <video
          id="sm-splash-video"
          data-src="/loading/loader.mp4"
          data-poster="/loading/loader-poster.webp"
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          // src/poster are set by the inline script only when the loader is shown.
          suppressHydrationWarning
          // brightness() lifts the video's near-white compression noise to pure white,
          // so no faint square shows against the white screen.
          className="size-[min(78vw,62vh,30rem)] object-contain brightness-[1.05]"
        />
        <button
          id="sm-splash-skip"
          type="button"
          className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 min-h-11 -translate-x-1/2 rounded-full px-5 text-[0.95rem] font-semibold text-muted underline decoration-line decoration-2 underline-offset-4 hover:text-ink"
        >
          {t("skip")}
        </button>
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
