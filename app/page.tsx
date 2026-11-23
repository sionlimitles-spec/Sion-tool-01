"use client";
import { useState } from "react";
import ToolCard from "./components/ToolCard";
import HeroBanner from "./components/HeroBanner";
import { Search, FileText, Image as ImageIcon, Play, QrCode, Link, Music, Video, Sparkles } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const tools = [
    { title: "File ke Link", description: "Unggah foto, video, dan PDF untuk dijadikan tautan URL...", badge: "Universal", href: "#", icon: <Link size={24} strokeWidth={2.5} />, colorTheme: { iconBg: "bg-neo-blue", badgeBg: "bg-neo-blue text-white", buttonBg: "bg-neo-blue text-white" } },
    { title: "Kompres Media HD", description: "Optimasi ukuran file gambar dan video hingga kilobyte...", badge: "MB + KB", href: "#", icon: <ImageIcon size={24} strokeWidth={2.5} />, colorTheme: { iconBg: "bg-neo-green", badgeBg: "bg-neo-green text-white", buttonBg: "bg-neo-green text-white" } },
    { title: "QR Code Studio", description: "Desain kode QR kustom dengan logo dan frame...", badge: "Custom QR", href: "#", icon: <QrCode size={24} strokeWidth={2.5} />, colorTheme: { iconBg: "bg-neo-purple", badgeBg: "bg-neo-purple text-white", buttonBg: "bg-neo-purple text-white" } },
    { title: "Audio Merger", description: "Satukan dan potong menit atau detik beberapa lagu...", badge: "Time", href: "#", icon: <Music size={24} strokeWidth={2.5} />, colorTheme: { iconBg: "bg-neo-pink", badgeBg: "bg-neo-pink text-white", buttonBg: "bg-neo-pink text-white" } },
    { title: "Photo Studio", description: "Edit dan poles foto dengan alat profesional...", badge: "Studio HD", href: "#", icon: <Sparkles size={24} strokeWidth={2.5} />, colorTheme: { iconBg: "bg-neo-yellow", badgeBg: "bg-neo-yellow text-black", buttonBg: "bg-neo-yellow text-black" } },
    { title: "Video Studio", description: "Konversi dan edit video dengan resolusi tinggi...", badge: "FX Studio", href: "#", icon: <Video size={24} strokeWidth={2.5} />, colorTheme: { iconBg: "bg-neo-blue", badgeBg: "bg-neo-blue text-white", buttonBg: "bg-neo-blue text-white" } },
    { title: "Merge PDF", description: "Gabungkan beberapa file PDF menjadi satu dokumen...", badge: "PDF", href: "#", icon: <FileText size={24} strokeWidth={2.5} />, colorTheme: { iconBg: "bg-neo-pink", badgeBg: "bg-neo-pink text-white", buttonBg: "bg-neo-pink text-white" } },
    { title: "Streaming Anime", description: "Nonton anime favorit kualitas HD tanpa batasan...", badge: "Stream", href: "/anime", icon: <Play size={24} strokeWidth={2.5} />, colorTheme: { iconBg: "bg-neo-yellow", badgeBg: "bg-neo-yellow text-black", buttonBg: "bg-neo-yellow text-black" } },
  ];

  const filteredTools = tools.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      <HeroBanner />
      <div className="relative mb-6 mt-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Search size={22} className="text-black" strokeWidth={3} /></div>
        <input type="text" placeholder="Cari tools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border-[3px] border-neo-text rounded-xl py-3 pl-12 pr-4 font-bold text-sm md:text-base shadow-[4px_4px_0px_0px_#111] focus:outline-none focus:shadow-[6px_6px_0px_0px_#111] transition-all placeholder:text-gray-400" />
      </div>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredTools.map((tool, index) => <ToolCard key={index} {...tool} />)}
      </section>
    </main>
  );
}
