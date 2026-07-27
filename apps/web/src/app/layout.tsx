import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Container } from "@keynotes/ui";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "KeyNotes",
  description: "A minimal notes app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable} font-sans antialiased`}>
        <div className="min-h-screen py-10 sm:py-14">
          <Container>
            <div className="mb-10 flex items-baseline justify-between gap-4">
              <Link href="/" className="font-display text-xl tracking-tight text-ink">
                KeyNotes
              </Link>
              <span className="text-sm text-ink-faint">minimal notes</span>
            </div>
            {children}
          </Container>
        </div>
      </body>
    </html>
  );
}
