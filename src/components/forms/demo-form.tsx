"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Info, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { FieldConfig, FieldKey, FormKey, FormMsg } from "./fields";

type Errors = Partial<Record<FieldKey, FormMsg>>;

function validate(field: FieldConfig, value: string): FormMsg | undefined {
  const v = value.trim();
  if (field.kind === "select") return undefined;
  if (field.required && !v) return field.error;
  if (field.kind === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return field.error;
  if (field.kind === "tel" && v.replace(/\D/g, "").length < 10) return field.error;
  return undefined;
}

/**
 * Accessible demo form. Validates input and explains clearly that nothing is
 * sent. Replace `onSubmit` with a real handler (e.g. a Server Action) once a
 * submission method is chosen.
 */
export function DemoForm({
  formKey,
  title,
  fields,
  submitLabel,
}: {
  formKey: FormKey;
  title: string;
  fields: FieldConfig[];
  submitLabel: FormMsg;
}) {
  const t = useTranslations("Form");
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [notSent, setNotSent] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const id = (name: string) => `${uid}-${formKey}-${name}`;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    for (const f of fields) {
      const err = validate(f, String(data.get(f.name) ?? ""));
      if (err) next[f.name] = err;
    }
    setErrors(next);
    setAttempted(true);

    const firstInvalid = fields.find((f) => next[f.name]);
    if (firstInvalid) {
      setNotSent(false);
      requestAnimationFrame(() => {
        summaryRef.current?.focus();
      });
      return;
    }
    // No submission backend yet: say so plainly instead of pretending it worked.
    setNotSent(true);
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  function onBlur(field: FieldConfig, value: string) {
    if (!attempted) return;
    setErrors((prev) => ({ ...prev, [field.name]: validate(field, value) }));
  }

  const errorCount = Object.values(errors).filter(Boolean).length;
  const titleId = id("title");
  const demoId = id("demo");

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-labelledby={titleId}
      aria-describedby={demoId}
      className="grid gap-5 rounded-[var(--radius-card)] border border-line bg-paper p-5 sm:p-7"
    >
      <h2 id={titleId} className="text-2xl">{title}</h2>

      <div
        id={demoId}
        className="flex gap-3 rounded-2xl border-2 border-amber bg-amber/10 p-4 text-[0.98rem] text-ink"
      >
        <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-deep" />
        <p>
          <strong className="block">{t("demoTitle")}</strong>
          {t("demoText")}
        </p>
      </div>

      {errorCount > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-2xl border-2 border-danger bg-danger/5 p-4 font-semibold text-danger"
        >
          {t("errorSummary")}
        </div>
      )}

      {fields.map((f) => {
        const fid = id(f.name);
        const errId = `${fid}-error`;
        const err = errors[f.name];
        const common = {
          id: fid,
          name: f.name,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? errId : undefined,
          "aria-required": f.required || undefined,
          className: "min-h-13 rounded-xl border-[1.5px] bg-white px-4 text-[1.05rem] md:text-[1.05rem]",
          onBlur: (e: { currentTarget: { value: string } }) => onBlur(f, e.currentTarget.value),
        };

        return (
          <div key={f.name} className="grid gap-2">
            <Label htmlFor={fid}>
              {t(f.label)}
              {f.required && (
                <span className="text-[0.85rem] font-medium text-muted">({t("required")})</span>
              )}
            </Label>

            {f.kind === "textarea" ? (
              <Textarea {...common} rows={5} className={`${common.className} py-3`} />
            ) : f.kind === "select" ? (
              <NativeSelect {...common} className={`${common.className} w-full`} defaultValue={f.options[0]}>
                {f.options.map((o) => (
                  <NativeSelectOption key={o} value={o}>{t(o)}</NativeSelectOption>
                ))}
              </NativeSelect>
            ) : (
              <Input
                {...common}
                type={f.kind}
                autoComplete={f.autoComplete}
                inputMode={f.kind === "tel" ? "tel" : f.kind === "email" ? "email" : undefined}
              />
            )}

            {err && (
              <p id={errId} className="flex items-center gap-1.5 text-[0.95rem] font-semibold text-danger">
                <Ban aria-hidden="true" className="size-4 shrink-0" />
                {t(err)}
              </p>
            )}
          </div>
        );
      })}

      <Button type="submit" size="lg" className="min-h-14 w-full rounded-full text-[1.05rem] font-bold">
        {t(submitLabel)}
      </Button>

      <div ref={resultRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {notSent && (
          <p className="flex gap-3 rounded-2xl border-2 border-walnut bg-sand/40 p-4 text-[0.98rem] font-semibold text-ink">
            <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            {t("notSent")}
          </p>
        )}
      </div>
    </form>
  );
}
