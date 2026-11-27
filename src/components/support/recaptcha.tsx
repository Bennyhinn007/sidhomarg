"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

type Grecaptcha = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => number;
  reset: (id?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
    __smRecaptchaReady?: () => void;
  }
}

let loader: Promise<Grecaptcha> | null = null;

/** Loads Google reCAPTCHA v2 once per page, in the visitor's language. */
function loadRecaptcha(lang: string): Promise<Grecaptcha> {
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    window.__smRecaptchaReady = () => resolve(window.grecaptcha!);
    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?onload=__smRecaptchaReady&render=explicit&hl=${lang}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => {
      loader = null;
      reject(new Error("reCAPTCHA failed to load"));
    };
    document.head.appendChild(s);
  });
  return loader;
}

export type RecaptchaHandle = { reset: () => void };

/**
 * reCAPTCHA v2 checkbox. The script loads only when the widget is close to the
 * screen, to save data on low-end phones. Uses the compact size on narrow screens.
 */
export function Recaptcha({
  siteKey,
  lang,
  onToken,
  onLoadError,
  ref,
}: {
  siteKey: string;
  lang: string;
  onToken: (token: string | null) => void;
  onLoadError?: () => void;
  ref?: Ref<RecaptchaHandle>;
}) {
  const box = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const callbacks = useRef({ onToken, onLoadError });
  useEffect(() => {
    callbacks.current = { onToken, onLoadError };
  }, [onToken, onLoadError]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetId.current !== null) window.grecaptcha?.reset(widgetId.current);
      callbacks.current.onToken(null);
    },
  }));

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;

    const start = () => {
      loadRecaptcha(lang)
        .then((g) => {
          if (cancelled || widgetId.current !== null || !box.current) return;
          widgetId.current = g.render(box.current, {
            sitekey: siteKey,
            size: box.current.clientWidth < 304 ? "compact" : "normal",
            callback: (token: string) => callbacks.current.onToken(token),
            "expired-callback": () => callbacks.current.onToken(null),
            "error-callback": () => callbacks.current.onToken(null),
          });
        })
        .catch(() => callbacks.current.onLoadError?.());
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [siteKey, lang]);

  return <div ref={box} className="min-h-[78px] w-full" />;
}
