/** Helpers for the Support Us form (validation, reference IDs, UPI note). Browser-safe, no dependencies. */

/** Indian mobile number: optional +91 / 91 / 0 prefix, then 10 digits starting 6-9. Returns the 10 digits or null. */
export function normalizeIndianMobile(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

/** "9876543210" -> "+91 98765 43210" */
export function formatIndianMobile(tenDigits: string) {
  return `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;
}

/** A full name: 2-80 characters with at least one letter (any script, including Kannada). */
export function isValidName(raw: string) {
  const s = raw.trim().replace(/\s+/g, " ");
  return s.length >= 2 && s.length <= 80 && /\p{L}/u.test(s);
}

// Crockford base32 without I, L, O, U: easy to read out over the phone.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Unique, human-friendly reference such as "SM-261127-7K3QD" (date in IST + 5 random characters). */
export function makeReferenceId(now = new Date()) {
  const ist = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((acc, p) => ((acc[p.type] = p.value), acc), {});
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  const rand = Array.from(bytes, (b) => ALPHABET[b % 32]).join("");
  return `SM-${ist.year}${ist.month}${ist.day}-${rand}`;
}

/** "27 Nov 2026, 10:15 am IST" */
export function formatIstTimestamp(date: Date) {
  return (
    new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date) + " IST"
  );
}

/**
 * UPI transaction note with reference, phone and name, e.g. "SM-261127-7K3QD 9876543210 Ramesh K".
 * Many UPI apps reject or cut long notes and some reject non-English characters,
 * so the note is plain ASCII and capped (name is shortened first).
 */
export function buildUpiNote({ ref, phone, name }: { ref: string; phone: string; name: string }, max = 50) {
  const asciiName = name
    .normalize("NFKD")
    .replace(/[^A-Za-z .-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const base = `${ref} ${phone}`;
  if (!asciiName) return base.slice(0, max);
  const room = max - base.length - 1;
  return room > 1 ? `${base} ${asciiName.slice(0, room).trim()}` : base.slice(0, max);
}

/** Small, stable string hash (FNV-1a) used to detect the same submission twice without storing personal data. */
export function hashString(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}
