import ToolCard from "./components/ToolCard";
import { FileText, Image as ImageIcon, Play, QrCode, Zap } from "lucide-react";

export default function Home() {
  const tools = [
    { 
      title: "Merge PDF", 
      description: "Gabungkan beberapa file PDF menjadi satu dokumen dengan cepat dan aman.", 
      badge: "PDF", 
      href: "/tools/merge-pdf",
      icon: <FileText size={22} />,
      theme: {
        iconBg: "bg-neo-pink",
        badgeBg: "bg-neo-pink text-white",
        buttonBg: "bg-neo-pink text-white hover:bg-pink-600"
      }
    },
    { 
      title: "Kompres Gambar", 
      description: "Kecilkan ukuran file JPG, PNG, atau WebP tanpa mengurangi kualitas.", 
      badge: "Gambar", 
      href: "/tools/compress-img",
      icon: <ImageIcon size={22} />,
      theme: {
        iconBg: "bg-neo-green",
        badgeBg: "bg-neo-green text-white",
        buttonBg: "bg-neo-green text-white hover:bg-green-600"
      }
    },
    { 
      title: "Streaming Anime", 
      description: "Nonton anime favorit dengan kualitas HD dan tanpa batasan server.", 
      badge: "Stream", 
      href: "/anime",
      icon: <Play size={22} />,
      theme: {
        iconBg: "bg-neo-purple",
        badgeBg: "bg-neo-purple text-white",
        buttonBg: "bg-neo-yellow text-black hover:bg-yellow-400"
      }
    },
    { 
      title: "QR Code Studio", 
      description: "Desain kode QR kustom dengan logo, warna, dan frame pilihanmu.", 
      badge: "Kustom", 
      href: "/tools/qr-code",
      icon: <QrCode size={22} />,
      theme: {
        iconBg: "bg-neo-blue",
        badgeBg: "bg-neo-blue text-white",
        buttonBg: "bg-neo-blue text-white hover:bg-blue-600"
      }
    },
  ];

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header dengan gaya yang lebih tegas */}
      <header className="mb-10 md:mb-16 border-[3px] border-neo-text bg-neo-yellow p-6 md:p-8 rounded-2xl shadow-[6px_6px_0px_0px_#111]">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="text-neo-text" size={32} strokeWidth={2.5} />
          <h1 className="font-archivo font-extrabold text-4xl md:text-6xl uppercase tracking-tighter text-black">
            Sion Tool<span className="text-neo-pink">.</span>
          </h1>
        </div>
        <p className="font-bold text-sm md:text-lg text-black/80 max-w-2xl">
          Kumpulan alat konversi file dan streaming dalam satu platform. Cepat, gratis, dan tanpa ribet.
        </p>
      </header>

      {/* Grid 2 Kolom di HP, 4 Kolom di Desktop */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {tools.map((tool, index) => (
          <ToolCard 
            key={index} 
            title={tool.title} 
            description={tool.description} 
            badge={tool.badge} 
            href={tool.href}
            icon={tool.icon}
            colorTheme={tool.theme}
          />
        ))}
      </section>
    </main>
  );
}
