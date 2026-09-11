import type { MetadataRoute } from "next";

const SITE = "https://ninadnaik.me";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/llms.txt`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
