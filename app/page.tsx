"use client";

import { useState } from "react";
import ToolCard from "./components/ToolCard";
import { Search, Zap, FileText, Image as ImageIcon, Play, QrCode, Link, Music } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const tools = [
    { title: "Streaming Anime", description: "Nonton anime favorit kualitas HD tanpa batasan.", badge: "Stream", category: "Media", href: "/anime", icon: <Play size={24} />, badgeColor: "bg-pink text-white" },
    { title: "File ke Link", description: "Unggah foto, video, dan PDF untuk dijadikan URL.", badge: "Universal", category: "Media", href: "#", icon: <Link size={24} />, badgeColor: "bg-cyan text-ink" },
    { title: "Kompres Media", description: "Optimasi ukuran file gambar dan video hingga KB.", badge: "MB + KB", category: "Media", href: "#", icon: <ImageIcon size={24} />, badgeColor: "bg-yellow text-ink" },
    { title: "QR Code Studio", description: "Desain kode QR kustom dengan logo dan frame.", badge: "Custom QR", category: "Alat", href: "#", icon: <QrCode size={24} />, badgeColor: "bg-acid text-ink" },
    { title: "Audio Merger", description: "Satukan dan potong beberapa file audio sekaligus.", badge: "Audio", category: "Audio", href: "#", icon: <Music size={24} />, badgeColor: "bg-cyan text-ink" },
    { title: "Merge PDF", description: "Gabungkan beberapa file PDF menjadi satu dokumen.", badge: "PDF", category: "Alat", href: "#", icon: <FileText size={24} />, badgeColor: "bg-pink text-white" },
  ];

  const categories = ["Semua", "Media", "Alat", "Audio"];

  const filteredTools = tools.filter((tool) => {
    const matchSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || tool.badge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeCategory === "Semua" || tool.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-screen pb-12">
      {/* Ticker / Marquee */}
      <div className="bg-ink text-yellow font-anton text-lg py-2 border-b-[3px] border-ink overflow-hidden">
        <div className="animate-ticker">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 px-4">
              <span>SION TOOL ✦ ALL IN ONE ✦ NO ADS ✦ GRATIS ✦ UPDATE HARIAN ✦ SION TOOL ✦ ALL IN ONE ✦ NO ADS ✦ GRATIS ✦ UPDATE HARIAN ✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-4">
        {/* Hero Section */}
        <section className="neo-card bg-yellow p-6 md:p-10 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10">
            <div className="bg-white neo-border px-3 py-1 text-sm font-bold w-fit neo-shadow-sm mb-4 -rotate-2">
              VERSI 1.0.0
            </div>
            <h1 className="font-anton text-5xl md:text-7xl uppercase leading-none mb-4">
              SION<span className="text-pink">.</span>TOOL
            </h1>
            <p className="font-bold text-lg md:text-xl max-w-md">
              Kumpulan alat konversi file dan streaming anime dalam satu platform. Cepat, gratis, dan tanpa ribet.
            </p>
          </div>
          <div className="relative z-10 hidden md:flex flex-col items-center justify-center bg-white neo-border rounded-full w-40 h-40 neo-shadow rotate-6">
            <Zap size={64} className="fill-pink text-ink mb-2" />
            <span className="font-anton text-2xl">SUPER<br/>FAST</span>
          </div>
        </section>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search size={24} className="text-ink" strokeWidth={3} />
            </div>
            <input 
              type="text" 
              placeholder="Cari alat yang kamu butuhkan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neo-input pl-12 text-lg"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-bold px-4 py-2 neo-border rounded-full transition-all active:translate-y-[2px] active:shadow-none ${activeCategory === cat ? 'bg-ink text-yellow neo-shadow' : 'bg-white neo-shadow-sm hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white neo-border neo-shadow rounded-xl">
              <h2 className="font-anton text-3xl mb-2">YAH, KOSONG 😔</h2>
              <p className="font-bold text-gray-500">Alat yang kamu cari tidak ditemukan.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
