import type { Metadata } from "next";
import { Unbounded, Outfit } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "VibeMap — Toronto Neighbourhood Intelligence",
  description: "Discover the real vibe of any Toronto neighbourhood. AI-powered walk scores, safety data, and neighbourhood insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${unbounded.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}