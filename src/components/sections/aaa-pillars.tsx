import { BookOpen, HeartPulse, Utensils } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

const pillars = [
  { name: "anna", meaning: "annaMeaning", icon: Utensils },
  { name: "akshara", meaning: "aksharaMeaning", icon: BookOpen },
  { name: "arogya", meaning: "arogyaMeaning", icon: HeartPulse },
] as const;

/** Anna, Akshara, Arogya: the Trust's three pillars. */
export async function AaaPillars({ className, label }: { className?: string; label?: string }) {
  const t = await getTranslations("AAA");

  return (
    <ul aria-label={label} className={cn("grid grid-cols-3 gap-2.5", className)}>
      {pillars.map(({ name, meaning, icon: Icon }) => (
        <li
          key={name}
          className="rounded-2xl border border-line bg-cream px-2 py-3.5 text-center"
        >
          <Icon aria-hidden="true" className="mx-auto mb-1 size-5 text-amber-deep" />
          <span className="block text-lg leading-tight font-extrabold text-amber-deep">{t(name)}</span>
          <span className="text-[0.85rem] text-muted">{t(meaning)}</span>
        </li>
      ))}
    </ul>
  );
}
