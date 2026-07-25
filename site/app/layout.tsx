import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "NotAVC — Venture Intelligence for Everyone",
  description:
    "An MBA student reverse-engineering venture capital in public. Company teardowns, term-sheet literacy, and the one number everyone else skips.",
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
      data-palette="rust"
      className={`${jakarta.variable} ${outfit.variable} ${spaceMono.variable} antialiased`}
    >
      <body className="grain min-h-screen">{children}</body>
    </html>
  );
}
