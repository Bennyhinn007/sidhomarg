import {
  BriefcaseBusiness,
  HeartHandshake,
  House,
  Images,
  Info,
  Mail,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

export type NavKey = "home" | "gallery" | "support" | "about" | "events" | "careers" | "contact";

export type NavItem = {
  key: NavKey;
  href: "/" | "/gallery" | "/support" | "/about" | "/events" | "/careers" | "/contact";
  icon: LucideIcon;
};

/**
 * Every page of the site, in display order. Used by the footer links and the sitemap.
 * Contact stays last.
 */
export const pages: NavItem[] = [
  { key: "home", href: "/", icon: House },
  { key: "gallery", href: "/gallery", icon: Images },
  { key: "support", href: "/support", icon: HeartHandshake },
  { key: "about", href: "/about", icon: Info },
  { key: "events", href: "/events", icon: Newspaper },
  { key: "careers", href: "/careers", icon: BriefcaseBusiness },
  { key: "contact", href: "/contact", icon: Mail },
];

const without = (keys: NavKey[]) => pages.filter((p) => !keys.includes(p.key));

/** Desktop top bar (1024px and wider). Careers is footer-only. */
export const desktopItems: NavItem[] = without(["careers"]);

/** Mobile bottom bar: kept at five tabs so labels stay readable, in Kannada too. */
export const bottomItems: NavItem[] = without(["careers", "events"]);

/** Footer links: all pages. */
export const footerItems: NavItem[] = pages;

/** All routes, for the sitemap. */
export const routes = pages.map((item) => item.href);
