"use client";

import { useMemo, useState } from "react";
import { FileText, Image as ImageIcon, Play, QrCode, Link as LinkIcon, Music, Video, Sparkles, Search, X } from "lucide-react";
import ToolCard, { Tool } from "./components/ToolCard";
import HeroBanner from "./components/HeroBanner";
import InfoBar from "./components/InfoBar";
import Footer from "./components/Footer";
import Ticker from "./components/Ticker";

const I = { size: 24, strokeWidth: 2.5 };
const TOOLS: Tool[] = [
  { title: "Streaming Anime", description: "SIONNIME — nonton anime favorit kualitas HD tanpa batasan, tanpa iklan.", badge: "Stream", category: "Hiburan", href: "/anime", icon: <Play {...I} className="fill-black" />, accent: "#FF2E88" },
  { title: "File ke Link", description: "Unggah foto, video, dan PDF untuk dijadikan tautan URL.", badge: "Universal", category: "Media", href: "#", icon: <LinkIcon {...I} />, accent: "#00E5FF" },
  { title: "Kompres Media HD", description: "Perkecil ukuran gambar dan video hingga hitungan kilobyte.", badge: "MB + KB", category: "Media", href: "#", icon: <ImageIcon {...I} />, accent: "#D4FF00" },
  { title: "QR Code Studio", description: "Desain kode QR kustom dengan logo dan frame.", badge: "Custom QR", category: "QR", href: "#", icon: <QrCode {...I} />, accent: "#FFE500" },
  { title: "Audio Merger", description: "Satukan dan potong beberapa lagu menit atau detik.", badge: "Audio", category: "Audio", href: "#", icon: <Music {...I} />, accent: "#FF2E88" },
  { title: "Photo Studio", description: "Edit dan poles foto dengan alat profesional.", badge: "Studio HD", category: "Media", href: "#", icon: <Sparkles {...I} />, accent: "#00E5FF" },
  { title: "Video Studio", description: "Konversi dan edit video dengan resolusi tinggi.", badge: "FX Studio", category: "Media", href: "#", icon: <Video {...I} />, accent: "#D4FF00" },
  { title: "Merge PDF", description: "Gabungkan beberapa file PDF menjadi satu dokumen.", badge: "PDF", category: "Media", href: "#", icon: <FileText {...I} />, accent: "#FFE500" },
];
const CATEGORIES = ["Semua", "Hiburan", "Media", "Audio", "QR"];

export default function Home() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return TOOLS.filter((t) => (cat === "Semua" || t.category === cat) && (!s || t.title.toLowerCase().includes(s) || t.badge.toLowerCase().includes(s) || t.description.toLowerCase().includes(s)));
  }, [q, cat]);

  return (
    <main id="main" className="max-w-6xl mx-auto px-4 md:px-8 pb-8 flex flex-col min-h-screen">
      <Ticker />
      <HeroBanner />
      <InfoBar />

      <div className="mb-6 space-y-4">
        <div className="relative">
          <label htmlFor="toolq" className="sr-only">Cari tools</label>
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Search size={20} strokeWidth={3} /></div>
          <input id="toolq" type="search" placeholder="Cari tools…" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off"
            className="w-full bg-white border-[3px] border-neo-text rounded-xl py-3 pl-12 pr-12 font-bold text-sm shadow-[4px_4px_0px_0px_#0A0A0A] focus:outline-none focus:shadow-[6px_6px_0px_0px_#FF2E88] transition-shadow placeholder:text-gray-500" />
          {q && <button type="button" aria-label="Hapus pencarian" onClick={() => setQ("")} className="absolute inset-y-0 right-3 grid place-items-center"><X size={18} strokeWidth={3} /></button>}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Kategori">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`neo-chip ${cat === c ? "neo-chip-active" : ""}`}>{c}</button>
          ))}
        </div>
      </div>

      <section aria-live="polite" className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 flex-grow content-start">
        {list.length > 0 ? list.map((t, i) => <ToolCard key={t.title} index={i} {...t} />) : (
          <div className="col-span-2 lg:col-span-4 text-center py-16 border-[3px] border-dashed border-gray-500 rounded-xl bg-white/60">
            <h3 className="font-display text-2xl uppercase mb-2">Yah, tools-nya belum ada 😔</h3>
            <p className="text-sm font-bold text-gray-600">Coba kata kunci lain atau ganti kategori.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
