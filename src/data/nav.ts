import {
  BriefcaseBusiness,
  HeartHandshake,
  House,
  Images,
  Info,
  Mail,
  type LucideIcon,
} from "lucide-react";

export type NavKey = "home" | "gallery" | "volunteer" | "about" | "careers" | "contact";

export type NavItem = {
  key: NavKey;
  href: "/" | "/gallery" | "/volunteer" | "/about" | "/careers" | "/contact";
  icon: LucideIcon;
};

/**
 * Order used by the bottom bar, the desktop bar, the footer and the sitemap.
 * Careers sits between About and Contact; Contact stays last.
 */
export const navItems: NavItem[] = [
  { key: "home", href: "/", icon: House },
  { key: "gallery", href: "/gallery", icon: Images },
  { key: "volunteer", href: "/volunteer", icon: HeartHandshake },
  { key: "about", href: "/about", icon: Info },
  { key: "careers", href: "/careers", icon: BriefcaseBusiness },
  { key: "contact", href: "/contact", icon: Mail },
];

export const routes = navItems.map((item) => item.href);
