import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-display",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-data",
});

export const metadata: Metadata = {
  title: "NotAVC — the numbers, not the headline",
  description:
    "Startup headlines are written to land well. An MBA student goes and reads the actual numbers instead, explains them in plain words, and shows every source.",
};

export const viewport: Viewport = {
  themeColor: "#710014",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-zone="void"
      className={`${fraunces.variable} ${instrument.variable} ${plexMono.variable} antialiased`}
    >
      <body className="grain min-h-screen">{children}</body>
    </html>
  );
}
