import type { ReactNode } from "react";

// The real <html> and <body> live in src/app/[locale]/layout.tsx so the
// lang attribute matches the page language. This root layout only passes through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
