/**
 * Builds a UPI deep link (NPCI "upi://pay" format) that opens Google Pay, PhonePe,
 * Paytm or any other UPI app with the payee and amount filled in.
 *
 * The UPI ID is left unencoded ("@" must stay literal for several apps);
 * the other values are percent-encoded.
 */
export function upiPayUri({
  upiId,
  payeeName,
  amount,
  note,
}: {
  upiId: string;
  payeeName: string;
  amount: number;
  note: string;
}) {
  const params = [
    `pa=${upiId}`,
    `pn=${encodeURIComponent(payeeName)}`,
    `am=${amount.toFixed(2)}`,
    "cu=INR",
    `tn=${encodeURIComponent(note)}`,
  ];
  return `upi://pay?${params.join("&")}`;
}

/** Parses a typed amount. Returns null unless it is a valid rupee value within the limits. */
export function parseAmount(raw: string, min: number, max: number): number | null {
  const s = raw.trim().replace(/,/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  const n = Number(s);
  return n >= min && n <= max ? n : null;
}
