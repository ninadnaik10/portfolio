import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getContent } from "@/lib/content";

export const alt = `${getContent().profile.name} - ${getContent().profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The site's dark-theme tokens, inlined: Satori resolves no CSS variables. */
const BACKGROUND = "#060607";
const FOREGROUND = "#fcfcfc";
const MUTED = "#9f9fa9";
const DIM = "#71717a";
const ACCENT = "#0485f7";

/**
 * Read at module scope so it happens once, at build time. Satori only accepts
 * ttf/otf, and next/font caches woff2 only, so these are separate subsetted
 * files carrying just the glyphs this card draws.
 */
const [openSans, jetbrainsMono, avatar] = await Promise.all([
  readFile(join(process.cwd(), "assets/fonts/open-sans-800.ttf")),
  readFile(join(process.cwd(), "assets/fonts/jetbrains-mono-500.ttf")),
  readFile(join(process.cwd(), "assets/og-avatar.jpg")),
]);

// Uppercased in JS rather than via textTransform, so the glyphs a build needs
// are exactly the characters passed in — no CSS transform to reason about.
/* What the work is about, rather than which tools it used. */
const THEMES = ["Backend", "Open Source", "AI Agents"].join("  ·  ");

const mono = {
  fontFamily: "JetBrains Mono",
  // Matches the .eyebrow tracking on the site.
  letterSpacing: 4,
};

export default function Image() {
  const { profile } = getContent();

  return new ImageResponse(
    (
      <div
        style={{
          background: BACKGROUND,
          display: "flex",
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        {/* A cool wash behind the portrait, so the card is not flat black. */}
        <div
          style={{
            backgroundImage: `radial-gradient(circle at 78% 42%, rgba(4,133,247,0.24), rgba(6,6,7,0) 64%)`,
            display: "flex",
            height: 630,
            left: 0,
            position: "absolute",
            top: 0,
            width: 1200,
          }}
        />

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "76px 0 76px 80px",
          }}
        >
          <div style={{ color: ACCENT, display: "flex", fontSize: 22, ...mono }}>
            NINADNAIK.ME
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: FOREGROUND,
                display: "flex",
                fontFamily: "Open Sans",
                fontSize: 108,
                fontWeight: 800,
                letterSpacing: -3,
                lineHeight: 1.05,
              }}
            >
              {profile.name}
            </div>

            {/* The rule-fade from the section headers. */}
            <div
              style={{
                backgroundImage: `linear-gradient(to right, ${ACCENT}, rgba(4,133,247,0) 100%)`,
                display: "flex",
                height: 3,
                marginBottom: 26,
                marginTop: 28,
                width: 420,
              }}
            />

            <div style={{ color: MUTED, display: "flex", fontSize: 27, ...mono }}>
              {profile.role.toUpperCase()}
            </div>
          </div>

          <div
            style={{
              color: DIM,
              display: "flex",
              fontSize: 21,
              whiteSpace: "nowrap",
              ...mono,
            }}
          >
            {THEMES.toUpperCase()}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            paddingRight: 84,
          }}
        >
          <img
            height={320}
            src={`data:image/jpeg;base64,${avatar.toString("base64")}`}
            style={{
              border: `3px solid rgba(252,252,252,0.14)`,
              borderRadius: 999,
              objectFit: "cover",
            }}
            width={320}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { data: openSans, name: "Open Sans", style: "normal", weight: 800 },
        { data: jetbrainsMono, name: "JetBrains Mono", style: "normal", weight: 500 },
      ],
    },
  );
}
