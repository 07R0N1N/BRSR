import type { Metadata } from "next";
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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
