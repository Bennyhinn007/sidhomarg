/**
 * Builds a mailto: link. Lines are joined with CRLF as RFC 6068 requires,
 * and every part is percent-encoded so names with "&" or "?" stay intact.
 */
export function mailtoHref(to: string, subject: string, bodyLines: string[]) {
  const body = bodyLines.join("\r\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
