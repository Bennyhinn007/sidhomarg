import { notFound } from "next/navigation";

// Any unknown path under a language (e.g. /kn/xyz) renders the localised 404 page.
export default function CatchAll() {
  notFound();
}
