import type { Metadata, Viewport } from "next";
import { Archivo, Space_Grotesk, Anton, Permanent_Marker } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ weight: ["600", "800"], subsets: ["latin"], variable: "--font-archivo" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const marker = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--font-marker" });

export const metadata: Metadata = {
  title: "SIONNIME — Sion Tool",
  description: "Kumpulan alat gratis dan streaming anime dalam satu web.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#FFE500" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${archivo.variable} ${grotesk.variable} ${anton.variable} ${marker.variable} antialiased`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[999] focus:bg-neo-yellow focus:text-black focus:px-3 focus:py-2 focus:border-[3px] focus:border-neo-text">
          Lewati ke konten
        </a>
        {children}
      </body>
    </html>
  );
}
