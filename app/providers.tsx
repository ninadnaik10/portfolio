"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // next-themes defaults to the storage key "theme" and feeds whatever it
      // finds straight into classList.add() unvalidated. Every dev server on
      // localhost:3000 shares one localStorage origin, so a value left by
      // another project (e.g. "Default Theme") would throw InvalidCharacterError.
      // Namespacing the key keeps this app's theme state to itself.
      storageKey="ninad-portfolio-theme"
      themes={["light", "dark"]}
    >
      {children}
    </ThemeProvider>
  );
}
