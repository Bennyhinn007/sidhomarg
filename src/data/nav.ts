import {
  BriefcaseBusiness,
  HandHeart,
  HeartHandshake,
  House,
  Images,
  Info,
  Mail,
  type LucideIcon,
} from "lucide-react";

export type NavKey = "home" | "gallery" | "volunteer" | "about" | "careers" | "donate" | "contact";

export type NavItem = {
  key: NavKey;
  href: "/" | "/gallery" | "/volunteer" | "/about" | "/careers" | "/donate" | "/contact";
  icon: LucideIcon;
};

/**
 * Every page of the site, in display order. Used by the footer links and the sitemap.
 * Contact stays last.
 */
export const pages: NavItem[] = [
  { key: "home", href: "/", icon: House },
  { key: "gallery", href: "/gallery", icon: Images },
  { key: "volunteer", href: "/volunteer", icon: HeartHandshake },
  { key: "about", href: "/about", icon: Info },
  { key: "careers", href: "/careers", icon: BriefcaseBusiness },
  { key: "donate", href: "/donate", icon: HandHeart },
  { key: "contact", href: "/contact", icon: Mail },
];

/** Pages not in the top bar or the mobile bottom bar. Donate has its own header button. */
const footerOnly: NavKey[] = ["careers", "donate"];

/** Main navigation: the desktop top bar and the mobile bottom bar. */
export const navItems: NavItem[] = pages.filter((p) => !footerOnly.includes(p.key));

/** Footer links: all pages. */
export const footerItems: NavItem[] = pages;

/** All routes, for the sitemap. */
export const routes = pages.map((item) => item.href);
