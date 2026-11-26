import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/sections/primitives";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <Container className="grid min-h-[50vh] place-content-center gap-6 py-16 text-center">
      <h1 className="text-[clamp(1.5rem,6vw,2.8rem)]">{t("title")}</h1>
      <p>
        <Link
          href="/"
          className="inline-flex min-h-13 items-center rounded-full bg-walnut px-7 font-bold text-cream hover:bg-walnut-dark"
        >
          {t("back")}
        </Link>
      </p>
    </Container>
  );
}
