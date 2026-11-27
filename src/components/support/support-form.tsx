"use client";

import Image from "next/image";
import { useCallback, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Check,
  CircleCheckBig,
  CircleX,
  Copy,
  HeartHandshake,
  Info,
  LoaderCircle,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { emailjsConfig, supportFormConfigured } from "@/lib/emailjs";
import { site } from "@/lib/site";
import {
  buildUpiNote,
  formatIndianMobile,
  formatIstTimestamp,
  hashString,
  isValidName,
  makeReferenceId,
  normalizeIndianMobile,
} from "@/lib/support";
import { parseAmount, upiPayUri } from "@/lib/upi";
import { cn } from "@/lib/utils";
import { UpiQr } from "./upi-qr";
import { Recaptcha, type RecaptchaHandle } from "./recaptcha";

const cfg = site.donate;
const SENT_KEY = "sm-support-sent";
const LAST_SENT_KEY = "sm-support-last-sent";
const THROTTLE_MS = 10_000;

function lastSentAt() {
  try {
    return Number(localStorage.getItem(LAST_SENT_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

const interests = ["none", "anna", "akshara", "arogya", "any"] as const;
type Interest = (typeof interests)[number];
type Choice = number | "custom" | "none";
type FieldError = "name" | "phone" | "choice" | "custom" | "consent" | "captcha";
type Status = "idle" | "sending" | "sent" | "error";
type SendFailure = "send" | "captcha" | "rate";
type Result = { ref: string; at: string; amount: number | null; note: string; phone: string; already: boolean };

const interestKey = {
  none: "interestNone",
  anna: "interestAnna",
  akshara: "interestAkshara",
  arogya: "interestArogya",
  any: "interestAny",
} as const;

// The email goes to the Trust, so it is always written in English.
const interestEmail: Record<Interest, string> = {
  none: "Not volunteering (donation only)",
  anna: "Anna (food)",
  akshara: "Akshara (education)",
  arogya: "Arogya (health)",
  any: "Anything that is needed",
};

const rupees = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const noopSubscribe = () => () => {};
const detectPhone = () =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.matchMedia("(pointer: coarse)").matches;

function readSent(): Record<string, Omit<Result, "already">> {
  try {
    return JSON.parse(sessionStorage.getItem(SENT_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/**
 * Support Us: one form for donating, volunteering, or both.
 * Details are emailed to the Trust through EmailJS (reCAPTCHA-protected), then the donor
 * pays in their own UPI app. The site never sees the payment, so it never claims success:
 * the email always says "Pending Verification".
 */
export function SupportForm() {
  const t = useTranslations("Support");
  const locale = useLocale();
  const uid = useId();
  const isPhone = useSyncExternalStore(noopSubscribe, detectPhone, () => true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<Interest>("none");
  const [choice, setChoice] = useState<Choice>(cfg.defaultAmount);
  const [custom, setCustom] = useState("");
  const [consent, setConsent] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [captchaLoadError, setCaptchaLoadError] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<SendFailure | null>(null);
  const [pendingRef, setPendingRef] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [started, setStarted] = useState(false);
  const [copied, setCopied] = useState(false);

  const sendingRef = useRef(false);
  const captchaRef = useRef<RecaptchaHandle>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const customRef = useRef<HTMLInputElement>(null);

  const customAmount = parseAmount(custom, cfg.minAmount, cfg.maxAmount);
  const amount: number | null =
    choice === "none" ? null : choice === "custom" ? customAmount : choice;
  const phone10 = normalizeIndianMobile(phone);
  const locked = status === "sending" || status === "sent";

  const errors: Partial<Record<FieldError, string>> = {};
  if (!isValidName(name)) errors.name = t("errorName");
  if (!phone10) errors.phone = t("errorPhone");
  if (interest === "none" && choice === "none") errors.choice = t("errorChoice");
  if (choice === "custom" && customAmount === null)
    errors.custom = t("amountError", { min: rupees(cfg.minAmount), max: rupees(cfg.maxAmount) });
  if (!consent) errors.consent = t("errorConsent");
  if (supportFormConfigured && !captchaLoadError && !token) errors.captcha = t("errorCaptcha");
  const shown = attempted ? errors : {};
  const errorCount = Object.keys(shown).length;

  // UPI note: reference + phone + name once a reference exists, otherwise a general note.
  const refForNote = result?.ref ?? pendingRef;
  const note =
    result?.note ??
    (refForNote && phone10 ? buildUpiNote({ ref: refForNote, phone: phone10, name }) : cfg.note);
  const payAmount = result ? result.amount : amount;
  const uri = payAmount
    ? upiPayUri({ upiId: cfg.upiId, payeeName: cfg.payeeName, amount: payAmount, note })
    : null;

  const onToken = useCallback((v: string | null) => setToken(v), []);
  const onCaptchaLoadError = useCallback(() => setCaptchaLoadError(true), []);

  function resetAfterChange() {
    if (status === "error") {
      setStatus("idle");
      setFailure(null);
    }
    setPendingRef(null);
  }

  function pickAmount(value: Choice) {
    setChoice(value);
    resetAfterChange();
    if (value === "custom") requestAnimationFrame(() => customRef.current?.focus());
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sendingRef.current || status === "sent") return; // no double submissions
    setAttempted(true);

    if (Object.keys(errors).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    if (!supportFormConfigured || !phone10) return;

    const fingerprint = hashString(
      JSON.stringify([name.trim().toLowerCase(), phone10, interest, amount ?? 0])
    );
    const previous = readSent()[fingerprint];
    if (previous) {
      setResult({ ...previous, already: true });
      setStatus("sent");
      requestAnimationFrame(() => resultRef.current?.focus());
      return;
    }

    // Anti-spam: one new submission per 10 seconds after a successful send.
    // Retries after a failure are not limited.
    if (Date.now() - lastSentAt() < THROTTLE_MS) {
      setFailure("rate");
      setStatus("error");
      requestAnimationFrame(() => resultRef.current?.focus());
      return;
    }

    sendingRef.current = true;
    setStatus("sending");
    setFailure(null);

    const ref = pendingRef ?? makeReferenceId();
    setPendingRef(ref); // a retry keeps the same reference
    const at = new Date();
    const upiNote = buildUpiNote({ ref, phone: phone10, name });

    const params = {
      reference_id: ref,
      submitted_at: formatIstTimestamp(at),
      submitted_at_iso: at.toISOString(),
      full_name: name.trim().replace(/\s+/g, " "),
      phone: formatIndianMobile(phone10),
      volunteer_interest: interestEmail[interest],
      donation_amount: amount ? `₹${amount.toFixed(2)}` : "No donation (volunteer only)",
      payment_status: amount ? "Pending Verification" : "Not applicable (volunteer only)",
      upi_id: cfg.upiId,
      upi_note: amount ? upiNote : "-",
      consent: `Given on ${formatIstTimestamp(at)}`,
      language: locale === "kn" ? "Kannada" : "English",
      page_url: window.location.href,
      "g-recaptcha-response": token ?? "",
    };

    try {
      const { send } = await import("@emailjs/browser");
      await send(emailjsConfig.serviceId, emailjsConfig.templateId, params, {
        publicKey: emailjsConfig.publicKey,
      });
      const saved = { ref, at: at.toISOString(), amount, note: upiNote, phone: phone10 };
      try {
        sessionStorage.setItem(SENT_KEY, JSON.stringify({ ...readSent(), [fingerprint]: saved }));
        localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
      } catch {}
      setResult({ ...saved, already: false });
      setStatus("sent");
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch (err) {
      const { status: code = 0, text = "" } = (err ?? {}) as { status?: number; text?: string };
      setFailure(code === 429 ? "rate" : /recaptcha/i.test(text) ? "captcha" : "send");
      setStatus("error");
      captchaRef.current?.reset(); // tokens work only once
      requestAnimationFrame(() => resultRef.current?.focus());
    } finally {
      sendingRef.current = false;
    }
  }

  function startOver() {
    setName("");
    setPhone("");
    setInterest("none");
    setChoice(cfg.defaultAmount);
    setCustom("");
    setConsent(false);
    setAttempted(false);
    setStatus("idle");
    setFailure(null);
    setPendingRef(null);
    setResult(null);
    setStarted(false);
    captchaRef.current?.reset();
  }

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(cfg.upiId);
    } catch {
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

  const id = (k: string) => `${uid}-${k}`;
  const describe = (field: FieldError, hint?: string) =>
    shown[field] ? id(`${field}-err`) : hint;
  const fieldClass = (field: FieldError) =>
    cn(
      "min-h-13 rounded-xl border-[1.5px] bg-white px-4 text-[1.05rem] md:text-[1.05rem]",
      shown[field] && "border-danger"
    );
  const fieldErr = (field: FieldError) =>
    shown[field] ? (
      <p id={id(`${field}-err`)} className="flex items-center gap-1.5 text-[0.95rem] font-semibold text-danger">
        <CircleX aria-hidden="true" className="size-4 shrink-0" />
        {shown[field]}
      </p>
    ) : null;

  const payLink = (label: string) =>
    uri ? (
      <a
        href={uri}
        onClick={() => setStarted(true)}
        className="flex min-h-15 w-full items-center justify-center gap-2.5 rounded-full bg-amber px-6 text-center text-[1.1rem] font-extrabold text-ink shadow-[0_14px_28px_-12px_rgb(213_133_31/0.85)] transition hover:-translate-y-0.5 hover:bg-amber-soft sm:text-xl"
      >
        <HeartHandshake aria-hidden="true" className="size-6 shrink-0" />
        {label}
      </a>
    ) : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-8">
      <form
        noValidate
        onSubmit={onSubmit}
        aria-labelledby={id("title")}
        aria-busy={status === "sending" || undefined}
        className="rounded-[var(--radius-card)] border border-line bg-paper p-5 shadow-[var(--shadow-soft)] sm:p-7"
      >
        <h2 id={id("title")} className="text-[1.25rem] sm:text-2xl">{t("formTitle")}</h2>

        {!supportFormConfigured && (
          <div className="mt-4 flex gap-3 rounded-2xl border-2 border-amber bg-amber/10 p-4 text-[0.98rem]">
            <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-deep" />
            <p>{t("notConfigured")}</p>
          </div>
        )}

        {errorCount > 0 && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="mt-4 rounded-2xl border-2 border-danger bg-danger/5 p-4 font-semibold text-danger outline-none"
          >
            {t("errorSummary")}
          </div>
        )}

        <fieldset disabled={locked} className="mt-5 grid gap-5 disabled:opacity-75">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor={id("name")}>
              {t("fullName")} <span className="text-[0.85rem] font-medium text-muted">({t("required")})</span>
            </Label>
            <Input
              id={id("name")}
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                resetAfterChange();
              }}
              aria-invalid={shown.name ? true : undefined}
              aria-describedby={describe("name")}
              aria-required
              className={fieldClass("name")}
            />
            {fieldErr("name")}
          </div>

          {/* Mobile */}
          <div className="grid gap-2">
            <Label htmlFor={id("phone")}>
              {t("phone")} <span className="text-[0.85rem] font-medium text-muted">({t("required")})</span>
            </Label>
            <Input
              id={id("phone")}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                resetAfterChange();
              }}
              aria-invalid={shown.phone ? true : undefined}
              aria-describedby={describe("phone", id("phone-hint"))}
              aria-required
              className={fieldClass("phone")}
            />
            {shown.phone ? (
              fieldErr("phone")
            ) : (
              <p id={id("phone-hint")} className="text-[0.92rem] text-muted">{t("phoneHint")}</p>
            )}
          </div>

          {/* Volunteer interest */}
          <div className="grid gap-2">
            <Label htmlFor={id("interest")}>{t("interestLabel")}</Label>
            <NativeSelect
              id={id("interest")}
              name="interest"
              value={interest}
              onChange={(e) => {
                setInterest(e.target.value as Interest);
                resetAfterChange();
              }}
              aria-describedby={shown.choice ? id("choice-err") : undefined}
              className={cn(fieldClass("choice"), "w-full")}
            >
              {interests.map((k) => (
                <NativeSelectOption key={k} value={k}>
                  {t(interestKey[k])}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          {/* Amount */}
          <div role="radiogroup" aria-labelledby={id("amount-legend")} aria-describedby={describe("choice")}>
            <p id={id("amount-legend")} className="text-base font-semibold text-ink">{t("chooseAmount")}</p>
            <div className="mt-3 grid grid-cols-3 gap-2.5 sm:gap-3">
              {[...cfg.amounts, "custom" as const].map((a) => {
                const selected = choice === a;
                return (
                  <label
                    key={a}
                    className={cn(
                      "relative flex min-h-13 cursor-pointer items-center justify-center rounded-2xl border-2 px-1 text-center font-extrabold transition-all has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-amber sm:min-h-14",
                      a === "custom" ? "text-[0.95rem] leading-tight font-bold" : "text-[1.05rem] sm:text-lg",
                      selected
                        ? "border-walnut bg-walnut text-cream shadow-[0_10px_22px_-12px_rgb(59_42_30/0.8)]"
                        : a === "custom"
                          ? "border-dashed border-field bg-white text-ink hover:border-amber"
                          : "border-line bg-white text-ink hover:border-amber"
                    )}
                  >
                    <input
                      type="radio"
                      name={id("amount")}
                      checked={selected}
                      onChange={() => pickAmount(a)}
                      className="sr-only"
                    />
                    {selected && a !== "custom" && (
                      <Check aria-hidden="true" className="absolute top-1.5 right-1.5 size-3.5 text-amber-soft" strokeWidth={3} />
                    )}
                    {a === "custom" ? t("otherAmount") : rupees(a)}
                  </label>
                );
              })}
              <label
                className={cn(
                  "col-span-3 flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border-2 px-3 text-center text-[0.95rem] font-bold transition-all has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-amber",
                  choice === "none"
                    ? "border-sage-deep bg-sage-deep text-cream"
                    : "border-dashed border-field bg-white text-ink hover:border-sage-deep"
                )}
              >
                <input
                  type="radio"
                  name={id("amount")}
                  checked={choice === "none"}
                  onChange={() => pickAmount("none")}
                  className="sr-only"
                />
                {t("noDonation")}
              </label>
            </div>
            <div className="mt-2">
              {fieldErr("choice")}
            </div>
          </div>

          {choice === "custom" && (
            <div className="grid gap-2">
              <Label htmlFor={id("custom")}>{t("enterAmount")}</Label>
              <div
                className={cn(
                  "flex min-h-13 items-center rounded-xl border-[1.5px] bg-white px-4 focus-within:border-amber focus-within:ring-[3px] focus-within:ring-amber/40",
                  shown.custom ? "border-danger" : "border-field"
                )}
              >
                <span aria-hidden="true" className="mr-2 text-lg font-bold text-muted">₹</span>
                <input
                  ref={customRef}
                  id={id("custom")}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="1000"
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value);
                    resetAfterChange();
                  }}
                  aria-invalid={shown.custom ? true : undefined}
                  aria-describedby={describe("custom", id("custom-hint"))}
                  className="w-full bg-transparent text-[1.1rem] font-bold text-ink outline-none placeholder:font-medium placeholder:text-muted/60"
                />
              </div>
              {shown.custom ? (
                fieldErr("custom")
              ) : (
                <p id={id("custom-hint")} className="text-[0.92rem] text-muted">
                  {t("amountHint", { min: rupees(cfg.minAmount), max: rupees(cfg.maxAmount) })}
                </p>
              )}
            </div>
          )}

          {/* Consent */}
          <div className="grid gap-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white p-4 text-[0.98rem] leading-snug has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-amber">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-invalid={shown.consent ? true : undefined}
                aria-describedby={describe("consent")}
                className="mt-0.5 size-5 shrink-0 accent-walnut"
              />
              <span>{t("consent")}</span>
            </label>
            {fieldErr("consent")}
          </div>

          {/* CAPTCHA */}
          {supportFormConfigured && status !== "sent" && (
            <div className="grid gap-2">
              <p className="text-[0.95rem] font-semibold text-ink">{t("captchaLabel")}</p>
              <Recaptcha
                ref={captchaRef}
                siteKey={emailjsConfig.recaptchaSiteKey}
                lang={locale === "kn" ? "kn" : "en"}
                onToken={onToken}
                onLoadError={onCaptchaLoadError}
              />
              {captchaLoadError && <p className="text-[0.95rem] font-semibold text-danger">{t("sendError")}</p>}
              {fieldErr("captcha")}
            </div>
          )}
        </fieldset>

        {/* Submit */}
        {status !== "sent" && (
          <div className="mt-6">
            {supportFormConfigured ? (
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex min-h-15 w-full items-center justify-center gap-2.5 rounded-full bg-amber px-6 text-center text-[1.05rem] font-extrabold text-ink shadow-[0_14px_28px_-12px_rgb(213_133_31/0.85)] transition hover:-translate-y-0.5 hover:bg-amber-soft disabled:translate-y-0 disabled:cursor-wait disabled:opacity-80 sm:text-[1.15rem]"
              >
                {status === "sending" ? (
                  <>
                    <LoaderCircle aria-hidden="true" className="size-6 shrink-0 animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <HeartHandshake aria-hidden="true" className="size-6 shrink-0" />
                    {amount ? t("submitDonate", { amount: rupees(amount) }) : t("submitVolunteer")}
                  </>
                )}
              </button>
            ) : (
              // Fallback while EmailJS is not set up: direct UPI payment still works.
              payLink(amount ? t("donateAmount", { amount: rupees(amount) }) : t("donateNow"))
            )}
            {supportFormConfigured && (
              <p className="mt-3 text-center text-[0.88rem] text-muted">{t("privacyNote")}</p>
            )}
          </div>
        )}

        {/* Result / errors (announced to screen readers) */}
        <div ref={resultRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
          {status === "error" && failure && (
            <div className="mt-5 grid gap-3 rounded-2xl border-2 border-danger bg-danger/5 p-4">
              <p className="flex gap-2.5 font-semibold text-danger">
                <CircleX aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <span>
                  {failure === "rate" ? t("rateLimited") : failure === "captcha" ? t("captchaFailed") : t("sendError")}{" "}
                  {amount ? t("noPaymentYet") : null}
                </span>
              </p>
              {amount && uri && (
                <a
                  href={uri}
                  onClick={() => setStarted(true)}
                  className="text-center text-[0.95rem] font-bold text-walnut underline decoration-amber decoration-2 underline-offset-4"
                >
                  {t("payWithoutSending", { amount: rupees(amount) })}
                </a>
              )}
            </div>
          )}

          {status === "sent" && result && (
            <div className="mt-6 grid gap-4 rounded-2xl border-2 border-sage-deep bg-sage-tint/70 p-5">
              <p className="flex gap-2.5 text-[1.05rem] font-bold text-ink">
                <CircleCheckBig aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-sage-deep" />
                {result.already ? t("alreadySent") : t("sentTitle")}
              </p>

              <div className="rounded-xl bg-white p-4 ring-1 ring-line">
                <p className="text-[0.9rem] font-semibold text-muted">{t("refLabel")}</p>
                <p className="mt-0.5 font-mono text-[1.35rem] font-extrabold tracking-wide text-walnut">{result.ref}</p>
                {result.amount && <p className="mt-1.5 text-[0.92rem] text-ink/85">{t("refHint")}</p>}
              </div>

              {result.amount ? (
                <>
                  {payLink(t("payNow", { amount: rupees(result.amount) }))}
                  <p className="flex items-center justify-center gap-2 text-center text-[0.92rem] text-muted">
                    <Smartphone aria-hidden="true" className="size-4 shrink-0" />
                    {isPhone ? t("opensApp") : t("desktopHint")}
                  </p>
                  <p className="flex gap-2.5 rounded-xl border border-walnut/30 bg-sand/40 p-3.5 text-[0.95rem] text-ink">
                    <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                    <span>
                      {started && (
                        <strong className="block">{t("startedTitle", { amount: rupees(result.amount) })}</strong>
                      )}
                      {t("paymentPending")}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-[1rem] text-ink">{t("volunteerThanks", { phone: formatIndianMobile(result.phone) })}</p>
              )}

              <button
                type="button"
                onClick={startOver}
                className="inline-flex min-h-11 items-center justify-center gap-2 justify-self-center rounded-full px-4 text-[0.95rem] font-bold text-walnut underline decoration-amber decoration-2 underline-offset-4"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                {t("newSubmission")}
              </button>
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
      </form>

      {/* QR code + UPI ID */}
      <div className="rounded-[var(--radius-card)] border border-line bg-sage-tint/60 p-5 sm:p-7">
        <h2 className="flex items-center gap-2 text-[1.15rem] sm:text-xl">
          <QrCode aria-hidden="true" className="size-5 text-sage-deep" />
          {t("scanTitle")}
        </h2>
        <p className="mt-1.5 text-[0.95rem] text-ink/85">
          {cfg.qrImage ? t("scanTextStatic") : result?.amount ? t("scanTextNote") : t("scanText")}
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
              {choice === "none" && !result ? t("qrNoDonation") : t("qrNeedsAmount")}
            </div>
          )}
          {payAmount && !cfg.qrImage && (
            <p className="mt-2 text-center text-[0.95rem] font-bold text-walnut">{rupees(payAmount)}</p>
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
