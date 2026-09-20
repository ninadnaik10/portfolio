import type { Metadata } from "next";
import { JetBrains_Mono, Open_Sans } from "next/font/google";

import { Providers } from "@/app/providers";
import { getContent } from "@/lib/content";

import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

/** Section numbers, dates and small caps keep their monospace texture. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const { about, profile, socials } = getContent();
const SITE_URL = "https://ninadnaik.me";
const description =
  about[0] ?? `${profile.name} - ${profile.role}. ${profile.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${profile.name} - ${profile.role}`,
  description,
  alternates: {
    canonical: "/",
    // Point text-oriented consumers at the plain-text summary rather than
    // making them parse a page that is mostly markup.
    types: { "text/plain": "/llms.txt" },
  },
  openGraph: {
    title: `${profile.name} - ${profile.role}`,
    description,
    url: SITE_URL,
    siteName: profile.name,
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} - ${profile.role}`,
    description,
  },
};

/**
 * Structured data so crawlers that never execute JS still get the identity
 * graph, not just prose.
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description,
  url: SITE_URL,
  ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
  ...(profile.location ? { address: profile.location } : {}),
  sameAs: socials
    .filter((s) => !s.url.startsWith("mailto:"))
    .map((s) => s.url),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      className={`${openSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
          type="application/ld+json"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
