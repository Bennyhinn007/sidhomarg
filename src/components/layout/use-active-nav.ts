"use client";

import { usePathname } from "@/i18n/navigation";
import { navItems, type NavItem } from "@/data/nav";

/** True when `href` is the current page (or a sub-page of it). Works for both languages. */
export function isActive(pathname: string, href: NavItem["href"]) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function useActiveIndex() {
  const pathname = usePathname();
  return navItems.findIndex((item) => isActive(pathname, item.href));
}
