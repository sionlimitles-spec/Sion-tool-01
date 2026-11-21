"use client";

import { useState } from "react";
import ToolCard from "./components/ToolCard";
import HeroBanner from "./components/HeroBanner";
import InfoBar from "./components/InfoBar";
import Footer from "./components/Footer";
import { FileText, Image as ImageIcon, Play, QrCode, Link, Music, Video, Sparkles, Search } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const tools = [
    { title: "File ke Link", description: "Unggah foto, video, dan PDF untuk dijadikan tautan URL...", badge: "Universal", category: "Media", href: "#", icon: <Link size={24} strokeWidth={2.5} /> },
    { title: "Kompres Media HD", description: "Optimasi ukuran file gambar dan video hingga kilobyte...", badge: "MB + KB", category: "Media", href: "#", icon: <ImageIcon size={24} strokeWidth={2.5} /> },
    { title: "QR Code Studio", description: "Desain kode QR kustom dengan logo dan frame...", badge: "Custom QR", category: "QR", href: "#", icon: <QrCode size={24} strokeWidth={2.5} /> },
    { title: "Audio Merger", description: "Satukan dan potong menit atau detik beberapa lagu...", badge: "AUDIO", category: "Audio", href: "#", icon: <Music size={24} strokeWidth={2.5} /> },
    { title: "Photo Studio", description: "Edit dan poles foto dengan alat profesional...", badge: "Studio HD", category: "Media", href: "#", icon: <Sparkles size={24} strokeWidth={2.5} /> },
    { title: "Video Studio", description: "Konversi dan edit video dengan resolusi tinggi...", badge: "FX Studio", category: "Media", href: "#", icon: <Video size={24} strokeWidth={2.5} /> },
    { title: "Merge PDF", description: "Gabungkan beberapa file PDF menjadi satu dokumen...", badge: "PDF", category: "Media", href: "#", icon: <FileText size={24} strokeWidth={2.5} /> }, 
    { title: "Streaming Anime", description: "Nonton anime favorit kualitas HD tanpa batasan...", badge: "Stream", category: "Media", href: "/anime", icon: <Play size={24} strokeWidth={2.5} /> },
  ];

  const categories = ["Semua", "Media", "Audio", "QR"];

  // Filter berdasarkan Search + Kategori
  const filteredTools = tools.filter((tool) => {
    const matchSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || tool.badge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeCategory === "Semua" || tool.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col min-h-screen">
      
      <HeroBanner />
      <InfoBar />

      {/* Search & Filter Chips */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search size={20} className="text-black" strokeWidth={3} />
          </div>
          <input 
            type="text" 
            placeholder="Cari tools..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-[3px] border-neo-text rounded-xl py-3 pl-12 pr-4 font-bold text-sm shadow-[4px_4px_0px_0px_#111] focus:outline-none focus:shadow-[6px_6px_0px_0px_#111] transition-all placeholder:text-gray-500"
          />
        </div>
        
        {/* Chips Kategori */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`neo-chip ${activeCategory === cat ? 'neo-chip-active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Tools */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 flex-grow">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool, index) => (
            <ToolCard key={index} index={index} {...tool} />
          ))
        ) : (
          <div className="col-span-2 lg:col-span-4 text-center py-16 border-[3px] border-dashed border-gray-400 rounded-xl bg-white/50">
            <h3 className="font-archivo font-extrabold text-2xl text-gray-800 mb-2">Yah, tools-nya belum ada 😔</h3>
            <p className="text-sm font-bold text-gray-500">Coba cari dengan kata kunci lain atau ganti kategori.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
