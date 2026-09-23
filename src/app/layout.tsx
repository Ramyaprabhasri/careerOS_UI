import { Syne, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import { ThemeInit } from "@/components/ThemeInit";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CareerOS — AI-Powered Career Workspace",
  description:
    "Track applications, understand opportunities, and build your next career move in one intelligent workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${syne.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
