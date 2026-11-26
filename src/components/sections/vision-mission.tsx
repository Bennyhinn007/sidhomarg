import { Eye, Flag } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "./primitives";

export async function VisionMission() {
  const t = await getTranslations("Home");

  const items = [
    { id: "vision", icon: Eye, title: t("visionTitle"), text: t("visionText"), iconBg: "bg-walnut text-cream" },
    { id: "mission", icon: Flag, title: t("missionTitle"), text: t("missionText"), iconBg: "bg-amber text-ink" },
  ];

  return (
    <Container className="grid gap-3 py-8 sm:gap-4 sm:py-14 md:grid-cols-2 md:gap-6">
      {items.map(({ id, icon: Icon, title, text, iconBg }) => (
        <section
          key={id}
          aria-labelledby={`${id}-title`}
          className="reveal rounded-[var(--radius-card)] border border-line bg-paper p-5 transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-8"
        >
          <span className={`grid size-11 place-items-center rounded-xl sm:size-13 sm:rounded-2xl ${iconBg}`}>
            <Icon aria-hidden="true" className="size-5 sm:size-6" />
          </span>
          <h2 id={`${id}-title`} className="mt-4 text-[1.35rem] sm:mt-5 sm:text-[1.7rem]">{title}</h2>
          <p className="mt-2 text-base text-ink/85 sm:text-[1.05rem]">{text}</p>
        </section>
      ))}
    </Container>
  );
}
