import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Content width wrapper used by every section. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

type PillTone = "sage" | "amber" | "light";

const pillTones: Record<PillTone, string> = {
  sage: "bg-sage-tint text-sage-deep",
  amber: "bg-amber/15 text-amber-deep",
  light: "bg-cream/15 text-cream",
};

/** Small rounded label above headings. */
export function Pill({ tone = "sage", children }: { tone?: PillTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "tracking-label inline-block rounded-full px-3 py-1 text-[0.75rem] font-bold sm:px-3.5 sm:py-1.5 sm:text-[0.8rem]",
        pillTones[tone]
      )}
    >
      {children}
    </span>
  );
}

/** Heading block at the top of inner pages: pill + the page's single h1. */
export function PageHead({ pill, title }: { pill: string; title: string }) {
  return (
    <Container className="pt-7 sm:pt-14">
      <Pill tone="amber">{pill}</Pill>
      <h1 className="mt-3 max-w-[16em] text-[clamp(1.65rem,6.2vw,3.4rem)] sm:mt-4">{title}</h1>
    </Container>
  );
}

/** Rounded tinted band used for the founder section and Founders Corner. */
export function Panel({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("mx-2 rounded-[1.5rem] bg-sage-tint/70 py-9 sm:mx-5 sm:rounded-[var(--radius-panel)] sm:py-16", className)}
      {...props}
    >
      {children}
    </section>
  );
}

/** Dashed box used wherever real content (photos, names) has not been supplied yet. */
export function PendingBox({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-[1.25rem] border-2 border-dashed border-field/60 bg-paper/70 p-4 text-center text-[0.92rem] font-medium text-muted",
        className
      )}
    >
      {children}
      <span>{label}</span>
    </div>
  );
}
