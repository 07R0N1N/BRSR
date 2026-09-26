import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BRSR Data Collection",
  description: "Business Responsibility and Sustainability Reporting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // scroll-smooth: enables animated scrolling for in-page anchor links
    // (e.g. marketing landing's "#about", "#tools", "#contact"). Applied on
    // <html> because that's the actual scrolling element for the document —
    // it has no effect when only applied to an inner wrapper div.
    <html lang="en" className="scroll-smooth scroll-pt-[88px]">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
