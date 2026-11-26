import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { galleryPhotos } from "@/data/photos";
import { Container, PageHead } from "@/components/sections/primitives";
import { PhotoGrid } from "@/components/sections/photo-grid";

export async function generateMetadata({ params }: PageProps<"/[locale]/gallery">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "gallery", "/gallery");
}

export default async function GalleryPage({ params }: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("Gallery");

  return (
    <>
      <PageHead pill={t("pill")} title={t("title")} />
      <Container className="py-10">
        <PhotoGrid photos={galleryPhotos} emptyText={t("empty")} />
      </Container>
    </>
  );
}
