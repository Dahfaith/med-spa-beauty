import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import FloatingWidgets from "@/components/ui/FloatingWidgets";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Med Spa & Beauty Arena | Premium Aesthetic Training & Spa",
  description: "A premium Medical Spa, Beauty Institute, and Professional Aesthetic Training Academy in Nigeria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, playfair.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <FloatingWidgets />
      </body>
    </html>
  );
}
