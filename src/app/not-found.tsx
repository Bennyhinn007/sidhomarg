import Link from "next/link";
import "./globals.css";

// Shown only for requests the language proxy does not handle.
// Localised 404 pages live in src/app/[locale]/not-found.tsx.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-cream p-6 text-center text-ink">
        <main>
          <h1 className="text-3xl">Page not found</h1>
          <p className="mt-4">
            <Link className="font-semibold text-amber-deep underline underline-offset-4" href="/">
              Go to the home page
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
