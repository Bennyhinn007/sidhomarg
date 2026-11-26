import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments set NEXT_PUBLIC_ALLOW_INDEXING=false so they stay out of search results.
  const allow = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false";

  return {
    rules: allow ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
