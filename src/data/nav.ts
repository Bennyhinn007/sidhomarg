import {
  BriefcaseBusiness,
  HeartHandshake,
  House,
  Images,
  Info,
  Mail,
  type LucideIcon,
} from "lucide-react";

export type NavKey = "home" | "gallery" | "support" | "about" | "careers" | "contact";

export type NavItem = {
  key: NavKey;
  href: "/" | "/gallery" | "/support" | "/about" | "/careers" | "/contact";
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
  { key: "careers", href: "/careers", icon: BriefcaseBusiness },
  { key: "contact", href: "/contact", icon: Mail },
];

/** Pages linked only from the footer, not from the top bar or the mobile bottom bar. */
const footerOnly: NavKey[] = ["careers"];

/** Main navigation: the desktop top bar and the mobile bottom bar. */
export const navItems: NavItem[] = pages.filter((p) => !footerOnly.includes(p.key));

/** Footer links: all pages. */
export const footerItems: NavItem[] = pages;

/** All routes, for the sitemap. */
export const routes = pages.map((item) => item.href);
