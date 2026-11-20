"use client";

import { useState } from "react";
import ToolCard from "./components/ToolCard";
import HeroBanner from "./components/HeroBanner";
import InfoBar from "./components/InfoBar";
import Footer from "./components/Footer";
import { FileText, Image as ImageIcon, Play, QrCode, Link, Music, Video, Sparkles, Search } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const tools = [
    { title: "File ke Link", description: "Unggah foto, video, dan PDF untuk dijadikan tautan URL...", badge: "Universal", href: "#", icon: <Link size={24} strokeWidth={2.5} /> },
    { title: "Kompres Media HD", description: "Optimasi ukuran file gambar dan video hingga kilobyte...", badge: "MB + KB", href: "#", icon: <ImageIcon size={24} strokeWidth={2.5} /> },
    { title: "QR Code Studio", description: "Desain kode QR kustom dengan logo dan frame...", badge: "Custom QR", href: "#", icon: <QrCode size={24} strokeWidth={2.5} /> },
    { title: "Audio Merger", description: "Satukan dan potong menit atau detik beberapa lagu...", badge: "Time", href: "#", icon: <Music size={24} strokeWidth={2.5} /> },
    { title: "Photo Studio", description: "Edit dan poles foto dengan alat profesional...", badge: "Studio HD", href: "#", icon: <Sparkles size={24} strokeWidth={2.5} /> },
    { title: "Video Studio", description: "Konversi dan edit video dengan resolusi tinggi...", badge: "FX Studio", href: "#", icon: <Video size={24} strokeWidth={2.5} /> },
    { title: "Merge PDF", description: "Gabungkan beberapa file PDF menjadi satu dokumen...", badge: "PDF", href: "#", icon: <FileText size={24} strokeWidth={2.5} /> },
    { title: "Streaming Anime", description: "Nonton anime favorit kualitas HD tanpa batasan...", badge: "Stream", href: "#", icon: <Play size={24} strokeWidth={2.5} /> },
  ];

  // Logika Filter Pencarian (Mencari berdasarkan Judul atau Badge)
  const filteredTools = tools.filter((tool) => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col min-h-screen">
      
      <HeroBanner />
      <InfoBar />

      {/* Search Bar dengan onChange */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search size={22} className="text-black" strokeWidth={3} />
        </div>
        <input 
          type="text" 
          placeholder="Cari tools..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-[3px] border-neo-text rounded-xl py-3 pl-12 pr-4 font-bold text-sm md:text-base shadow-[4px_4px_0px_0px_#111] focus:outline-none focus:ring-0 focus:shadow-[6px_6px_0px_0px_#111] transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Grid Tools */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 flex-grow">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool, index) => (
            <ToolCard 
              key={index} 
              title={tool.title} 
              description={tool.description} 
              badge={tool.badge} 
              href={tool.href}
              icon={tool.icon}
            />
          ))
        ) : (
          // Tampilan jika alat tidak ditemukan
          <div className="col-span-2 lg:col-span-4 text-center py-12 border-[3px] border-dashed border-gray-400 rounded-xl">
            <h3 className="font-archivo font-bold text-xl text-gray-500">Alat tidak ditemukan.</h3>
            <p className="text-sm text-gray-400 mt-2">Coba gunakan kata kunci lain.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />

    </main>
  );
}
