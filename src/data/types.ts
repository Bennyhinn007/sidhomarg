import type { Locale } from "@/i18n/routing";

/** Text that has an English and a Kannada version. */
export type LocalizedText = Record<Locale, string>;

/** A photo stored in /public. Width and height are the real pixel size of the file. */
export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
};
