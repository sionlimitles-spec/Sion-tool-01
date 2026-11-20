import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ 
  weight: ["600", "800"], 
  subsets: ["latin"], 
  variable: "--font-archivo" 
});

const grotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-grotesk" 
});

export const metadata: Metadata = {
  title: "Sion Tool - All in One Tools",
  description: "Kumpulan alat konversi dan streaming gratis dalam satu web.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${archivo.variable} ${grotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
