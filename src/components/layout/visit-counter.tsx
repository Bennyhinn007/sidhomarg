"use client";

import { useEffect, useState } from "react";
import { ChartNoAxesColumn } from "lucide-react";

// Marks that this tab session has already been counted. Only used to avoid
// asking the server to count again; the real total lives in Redis.
const SESSION_FLAG = "sm-visit-counted";

/**
 * Footer visit counter. Counts once per browsing session (the server also
 * de-duplicates), and renders nothing if the counter service is unavailable.
 */
export function VisitCounter({ label, locale }: { label: string; locale: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let counted = false;
    try {
      counted = sessionStorage.getItem(SESSION_FLAG) === "1";
    } catch {
      // Storage blocked: the server-side cookie still prevents double counting.
    }

    fetch("/api/visit", { method: counted ? "GET" : "POST", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { count: null }))
      .then((data: { count: number | null }) => {
        if (cancelled) return;
        if (typeof data.count === "number") setCount(data.count);
        try {
          sessionStorage.setItem(SESSION_FLAG, "1");
        } catch {}
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  return (
    <p className="inline-flex items-center gap-2 text-[0.95rem] text-sand/90">
      <ChartNoAxesColumn aria-hidden="true" className="size-4" />
      <span>
        {label}:{" "}
        <strong className="font-bold text-cream tabular-nums">
          {count.toLocaleString(locale === "kn" ? "kn-IN" : "en-IN")}
        </strong>
      </span>
    </p>
  );
}
