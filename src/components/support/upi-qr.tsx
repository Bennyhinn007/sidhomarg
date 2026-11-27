import { useMemo } from "react";
import { encode } from "uqr";

/**
 * QR code drawn as a single SVG path (crisp at any size, no image request).
 * Includes the standard 4-module quiet zone so phone cameras read it reliably.
 */
export function UpiQr({ value, label, className }: { value: string; label: string; className?: string }) {
  const { size, path } = useMemo(() => {
    const qr = encode(value, { ecc: "M", border: 0 });
    const quiet = 4;
    let d = "";
    qr.data.forEach((row, y) =>
      row.forEach((on, x) => {
        if (on) d += `M${x + quiet} ${y + quiet}h1v1h-1z`;
      })
    );
    return { size: qr.size + quiet * 2, path: d };
  }, [value]);

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      className={className}
    >
      <rect width={size} height={size} fill="#ffffff" />
      <path d={path} fill="#3b2a1e" />
    </svg>
  );
}
