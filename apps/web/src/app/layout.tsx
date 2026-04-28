import type { Metadata } from "next";
import { Outfit, Newsreader, JetBrains_Mono, Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@Poneglyph/ui/lib/utils";

const instrumentSerifHeading = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poneglyph — Data Stories Vividly Visualized",
  description: "AI-powered analysis and extracted insights from survey datasets worldwide.",
  icons: {
    icon: "/poneg_logo.webp",
    shortcut: "/poneg_logo.webp",
  },
  openGraph: {
    images: [{ url: "/poneg_logo.webp" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, instrumentSerifHeading.variable)}>
      <body
        className={`${outfit.variable} ${newsreader.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
