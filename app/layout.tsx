import type { Metadata } from "next";
import { Archivo, Space_Grotesk, Permanent_Marker } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ weight: ["600", "800"], subsets: ["latin"], variable: "--font-archivo" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const marker = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--font-marker" });

export const metadata: Metadata = {
  title: "Sion Tool - All in One",
  description: "Kumpulan alat konversi dan streaming anime.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${archivo.variable} ${grotesk.variable} ${marker.variable} font-grotesk antialiased bg-neo-bg text-neo-text min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
