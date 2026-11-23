import type { Metadata } from "next";
import { Anton, Space_Grotesk, Permanent_Marker } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const marker = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--font-marker" });

export const metadata: Metadata = {
  title: "Sion Tool - All in One",
  description: "Kumpulan alat konversi dan streaming anime dalam satu platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${anton.variable} ${grotesk.variable} ${marker.variable} font-grotesk antialiased bg-paper text-ink min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
