import type { MetadataRoute } from "next";

const SITE = "https://ninadnaik.me";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ allow: "/", userAgent: "*" }],
    host: SITE,
    sitemap: `${SITE}/sitemap.xml`,
  };
}
