import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next's dev server serves /_next/* only to allowed origins, so opening the
  // dev URL from a phone on the LAN gets 403 on every chunk: the HTML renders
  // but React never hydrates, and anything interactive is silently dead.
  // Only affects `next dev` — `next start` has no such restriction.
  allowedDevOrigins: ["192.168.0.*", "localhost", "127.0.0.1"],
  /* config options here */
};

export default nextConfig;
