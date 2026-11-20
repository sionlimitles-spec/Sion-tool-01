import ToolCard from "./components/ToolCard";
import { FileText, Image as ImageIcon, Play, QrCode, Link, Music, Video, Sparkles } from "lucide-react";

export default function Home() {
  const tools = [
    { title: "File ke Link", description: "Unggah foto, video, dan PDF untuk dijadikan tautan URL...", badge: "Universal", href: "#", icon: <Link size={20} strokeWidth={2.5} /> },
    { title: "Kompres Media HD", description: "Optimasi ukuran file gambar dan video hingga kilobyte...", badge: "MB + KB", href: "#", icon: <ImageIcon size={20} strokeWidth={2.5} /> },
    { title: "QR Code Studio", description: "Desain kode QR kustom dengan logo dan frame...", badge: "Custom QR", href: "#", icon: <QrCode size={20} strokeWidth={2.5} /> },
    { title: "Audio Merger", description: "Satukan dan potong menit atau detik beberapa lagu...", badge: "Time", href: "#", icon: <Music size={20} strokeWidth={2.5} /> },
    { title: "Photo Studio", description: "Edit dan poles foto dengan alat profesional...", badge: "Studio HD", href: "#", icon: <Sparkles size={20} strokeWidth={2.5} /> },
    { title: "Video Studio", description: "Konversi dan edit video dengan resolusi tinggi...", badge: "FX Studio", href: "#", icon: <Video size={20} strokeWidth={2.5} /> },
    { title: "Merge PDF", description: "Gabungkan beberapa file PDF menjadi satu dokumen...", badge: "PDF", href: "#", icon: <FileText size={20} strokeWidth={2.5} /> },
    { title: "Streaming Anime", description: "Nonton anime favorit kualitas HD tanpa batasan...", badge: "Stream", href: "#", icon: <Play size={20} strokeWidth={2.5} /> },
  ];

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header dengan Teks Outline */}
      <header className="mb-10 md:mb-14 border-b-[3px] border-black pb-6">
        <h1 className="font-archivo font-extrabold text-5xl md:text-7xl uppercase tracking-tighter mb-3 flex items-center gap-2">
          <span className="text-outline">SION</span> TOOL
        </h1>
        <p className="font-bold text-sm md:text-lg text-gray-600 max-w-2xl">
          Kumpulan alat konversi file dan streaming dalam satu platform. Cepat, gratis, dan tanpa ribet.
        </p>
      </header>

      {/* Grid 2 Kolom di HP, 4 Kolom di Desktop */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {tools.map((tool, index) => (
          <ToolCard 
            key={index} 
            title={tool.title} 
            description={tool.description} 
            badge={tool.badge} 
            href={tool.href}
            icon={tool.icon}
          />
        ))}
      </section>
    </main>
  );
}
