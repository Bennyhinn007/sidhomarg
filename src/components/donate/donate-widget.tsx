"use client";

import Image from "next/image";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, HeartHandshake, Info, QrCode, ShieldCheck, Smartphone } from "lucide-react";
import { site } from "@/lib/site";
import { parseAmount, upiPayUri } from "@/lib/upi";
import { cn } from "@/lib/utils";
import { UpiQr } from "./upi-qr";

const cfg = site.donate;
const noopSubscribe = () => () => {};
const detectPhone = () =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
  window.matchMedia("(pointer: coarse)").matches;

const formatRupees = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

/**
 * Direct UPI donation: pick an amount, then either open a UPI app (phones)
 * or scan the QR code (computers). There is no gateway, so the site never
 * claims a payment succeeded.
 */
export function DonateWidget() {
  const t = useTranslations("Donate");
  const uid = useId();
  const [choice, setChoice] = useState<number | "custom">(cfg.defaultAmount);
  const [custom, setCustom] = useState("");
  const [customTouched, setCustomTouched] = useState(false);
  const [started, setStarted] = useState(false);
  const [copied, setCopied] = useState(false);
  // Most visitors use phones, so the server render (and first paint) assumes a phone.
  const isPhone = useSyncExternalStore(noopSubscribe, detectPhone, () => true);
  const customRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const customAmount = parseAmount(custom, cfg.minAmount, cfg.maxAmount);
  const amount = choice === "custom" ? customAmount : choice;
  const uri = amount ? upiPayUri({ upiId: cfg.upiId, payeeName: cfg.payeeName, amount, note: cfg.note }) : null;
  const customError = choice === "custom" && customTouched && customAmount === null;

  function pick(value: number | "custom") {
    setChoice(value);
    setStarted(false);
    if (value === "custom") requestAnimationFrame(() => customRef.current?.focus());
  }

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(cfg.upiId);
    } catch {
      // Older browsers: select-and-copy fallback.
      const el = document.createElement("textarea");
      el.value = cfg.upiId;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  const ids = {
    legend: `${uid}-legend`,
    custom: `${uid}-custom`,
    customHint: `${uid}-custom-hint`,
    customError: `${uid}-custom-error`,
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-8">
      {/* Amount + Donate Now */}
      <div className="rounded-[var(--radius-card)] border border-line bg-paper p-5 shadow-[var(--shadow-soft)] sm:p-7">
        <fieldset>
          <legend id={ids.legend} className="text-[1.15rem] font-bold text-ink sm:text-xl">
            {t("chooseAmount")}
          </legend>

          <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
            {cfg.amounts.map((a) => {
              const selected = choice === a;
              return (
                <label
                  key={a}
                  className={cn(
                    "relative flex min-h-13 cursor-pointer items-center justify-center rounded-2xl border-2 text-[1.05rem] font-extrabold transition-all has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-amber sm:min-h-14 sm:text-lg",
                    selected
                      ? "border-walnut bg-walnut text-cream shadow-[0_10px_22px_-12px_rgb(59_42_30/0.8)]"
                      : "border-line bg-white text-ink hover:border-amber"
                  )}
                >
                  <input
                    type="radio"
                    name={`${uid}-amount`}
                    value={a}
                    checked={selected}
                    onChange={() => pick(a)}
                    className="sr-only"
                  />
                  {selected && (
                    <Check aria-hidden="true" className="absolute top-1.5 right-1.5 size-3.5 text-amber-soft" strokeWidth={3} />
                  )}
                  {formatRupees(a)}
                </label>
              );
            })}

            <label
              className={cn(
                "flex min-h-13 cursor-pointer items-center justify-center rounded-2xl border-2 px-1 text-center text-[0.95rem] leading-tight font-bold transition-all has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-amber sm:min-h-14",
                choice === "custom"
                  ? "border-walnut bg-walnut text-cream"
                  : "border-dashed border-field bg-white text-ink hover:border-amber"
              )}
            >
              <input
                type="radio"
                name={`${uid}-amount`}
                value="custom"
                checked={choice === "custom"}
                onChange={() => pick("custom")}
                className="sr-only"
              />
              {t("otherAmount")}
            </label>
          </div>
        </fieldset>

        {choice === "custom" && (
          <div className="mt-4 grid gap-2">
            <label htmlFor={ids.custom} className="text-base font-semibold text-ink">
              {t("enterAmount")}
            </label>
            <div
              className={cn(
                "flex min-h-13 items-center rounded-xl border-[1.5px] bg-white px-4 focus-within:border-amber focus-within:ring-[3px] focus-within:ring-amber/40",
                customError ? "border-danger" : "border-field"
              )}
            >
              <span aria-hidden="true" className="mr-2 text-lg font-bold text-muted">₹</span>
              <input
                ref={customRef}
                id={ids.custom}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setStarted(false);
                }}
                onBlur={() => setCustomTouched(true)}
                aria-invalid={customError || undefined}
                aria-describedby={customError ? ids.customError : ids.customHint}
                placeholder="1000"
                className="w-full bg-transparent text-[1.1rem] font-bold text-ink outline-none placeholder:font-medium placeholder:text-muted/60"
              />
            </div>
            {customError ? (
              <p id={ids.customError} className="text-[0.95rem] font-semibold text-danger">
                {t("amountError", { min: formatRupees(cfg.minAmount), max: formatRupees(cfg.maxAmount) })}
              </p>
            ) : (
              <p id={ids.customHint} className="text-[0.92rem] text-muted">
                {t("amountHint", { min: formatRupees(cfg.minAmount), max: formatRupees(cfg.maxAmount) })}
              </p>
            )}
          </div>
        )}

        <div className="mt-6">
          {uri ? (
            <a
              href={uri}
              onClick={() => {
                setStarted(true);
                requestAnimationFrame(() => statusRef.current?.focus());
              }}
              className="flex min-h-15 w-full items-center justify-center gap-2.5 rounded-full bg-amber px-6 text-[1.15rem] font-extrabold text-ink shadow-[0_14px_28px_-12px_rgb(213_133_31/0.85)] transition hover:-translate-y-0.5 hover:bg-amber-soft sm:text-xl"
            >
              <HeartHandshake aria-hidden="true" className="size-6" />
              {t("donateAmount", { amount: formatRupees(amount!) })}
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="flex min-h-15 w-full items-center justify-center gap-2.5 rounded-full bg-line px-6 text-[1.1rem] font-extrabold text-muted"
            >
              <HeartHandshake aria-hidden="true" className="size-6" />
              {t("donateNow")}
            </span>
          )}

          <p className="mt-3 flex items-center justify-center gap-2 text-center text-[0.92rem] text-muted">
            <Smartphone aria-hidden="true" className="size-4 shrink-0" />
            {isPhone ? t("opensApp") : t("desktopHint")}
          </p>
        </div>

        <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
          {started && amount && (
            <div className="mt-4 flex gap-3 rounded-2xl border-2 border-walnut bg-sand/40 p-4 text-[0.98rem] text-ink">
              <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
              <p>
                <strong className="block">{t("startedTitle", { amount: formatRupees(amount) })}</strong>
                {t("startedText")}
              </p>
            </div>
          )}
        </div>

        <ul className="mt-6 grid gap-2 border-t border-line pt-5 text-[0.95rem] text-ink/85">
          <li className="flex gap-2.5">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-sage-deep" />
            {t("trustDirect")}
          </li>
          <li className="flex gap-2.5">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-sage-deep" />
            {t("trustCheck")}
          </li>
        </ul>
      </div>

      {/* QR + UPI ID */}
      <div className="rounded-[var(--radius-card)] border border-line bg-sage-tint/60 p-5 sm:p-7">
        <h2 className="flex items-center gap-2 text-[1.15rem] sm:text-xl">
          <QrCode aria-hidden="true" className="size-5 text-sage-deep" />
          {t("scanTitle")}
        </h2>
        <p className="mt-1.5 text-[0.95rem] text-ink/85">
          {cfg.qrImage ? t("scanTextStatic") : t("scanText")}
        </p>

        <div className="mx-auto mt-5 w-full max-w-[15rem] rounded-2xl bg-white p-3 shadow-[var(--shadow-soft)] ring-1 ring-line sm:max-w-[17rem]">
          {cfg.qrImage ? (
            <Image
              src={cfg.qrImage}
              alt={t("qrAlt", { upiId: cfg.upiId })}
              width={600}
              height={600}
              sizes="17rem"
              className="h-auto w-full rounded-lg"
            />
          ) : uri ? (
            <UpiQr value={uri} label={t("qrAlt", { upiId: cfg.upiId })} className="h-auto w-full" />
          ) : (
            <div className="grid aspect-square place-items-center p-4 text-center text-[0.92rem] text-muted">
              {t("qrNeedsAmount")}
            </div>
          )}
          {amount && !cfg.qrImage && (
            <p className="mt-2 text-center text-[0.95rem] font-bold text-walnut">{formatRupees(amount)}</p>
          )}
        </div>

        <div className="mt-5">
          <p className="text-[0.92rem] font-semibold text-muted">{t("upiIdLabel")}</p>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-line bg-white p-1.5 pl-4">
            <code className="min-w-0 flex-1 truncate font-sans text-[1.05rem] font-bold text-ink">{cfg.upiId}</code>
            <button
              type="button"
              onClick={copyUpiId}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg px-3.5 text-[0.92rem] font-bold transition-colors",
                copied ? "bg-sage-deep text-cream" : "bg-walnut text-cream hover:bg-walnut-dark"
              )}
            >
              {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <p aria-live="polite" className="sr-only">{copied ? t("copiedAnnounce") : ""}</p>
          <p className="mt-2 text-[0.9rem] text-muted">{t("payeeLine", { name: cfg.payeeName })}</p>
        </div>
      </div>
    </div>
  );
}
