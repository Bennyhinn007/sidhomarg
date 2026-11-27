"use client";

import { usePathname } from "@/i18n/navigation";
import type { NavItem } from "@/data/nav";

/** True when `href` is the current page (or a sub-page of it). Works for both languages. */
export function isActive(pathname: string, href: NavItem["href"]) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Index of the current page within `items`, or -1 if it is not in that menu. */
export function useActiveIndex(items: NavItem[]) {
  const pathname = usePathname();
  return items.findIndex((item) => isActive(pathname, item.href));
}
