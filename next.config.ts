import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Donate and Volunteer were merged into Support Us. Keep old shared links working.
  async redirects() {
    return ["donate", "volunteer"].flatMap((old) => [
      { source: `/${old}`, destination: "/support", permanent: true },
      { source: `/kn/${old}`, destination: "/kn/support", permanent: true },
    ]);
  },
};

export default withNextIntl(nextConfig);
