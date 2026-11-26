import { House, Images, HeartHandshake, Info, Mail, type LucideIcon } from "lucide-react";

export type NavKey = "home" | "gallery" | "volunteer" | "about" | "contact";

export type NavItem = {
  key: NavKey;
  href: "/" | "/gallery" | "/volunteer" | "/about" | "/contact";
  icon: LucideIcon;
};

/** Order used by the bottom bar, the desktop bar and the footer. Contact stays last. */
export const navItems: NavItem[] = [
  { key: "home", href: "/", icon: House },
  { key: "gallery", href: "/gallery", icon: Images },
  { key: "volunteer", href: "/volunteer", icon: HeartHandshake },
  { key: "about", href: "/about", icon: Info },
  { key: "contact", href: "/contact", icon: Mail },
];

export const routes = navItems.map((item) => item.href);
