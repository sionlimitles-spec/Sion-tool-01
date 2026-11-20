import ToolCard from "./components/ToolCard";
import { FileText, Image as ImageIcon, Play, QrCode } from "lucide-react";

export default function Home() {
  const tools = [
    { 
      title: "Merge PDF", 
      description: "Gabungkan beberapa file PDF menjadi satu dokumen dengan cepat.", 
      badge: "PDF", 
      href: "/tools/merge-pdf",
      icon: <FileText size={20} />,
      badgeColor: "bg-neo-pink text-white"
    },
    { 
      title: "Kompres Gambar", 
      description: "Kecilkan ukuran file JPG, PNG, atau WebP tanpa mengurangi kualitas.", 
      badge: "Gambar", 
      href: "/tools/compress-img",
      icon: <ImageIcon size={20} />,
      badgeColor: "bg-neo-green text-white"
    },
    { 
      title: "Streaming Anime", 
      description: "Nonton anime favorit dengan kualitas HD dan tanpa batasan.", 
      badge: "Stream", 
      href: "/anime",
      icon: <Play size={20} />,
      badgeColor: "bg-neo-accent text-neo-text"
    },
    { 
      title: "QR Code Studio", 
      description: "Desain kode QR kustom dengan logo dan warna pilihanmu.", 
      badge: "Kustom", 
      href: "/tools/qr-code",
      icon: <QrCode size={20} />,
      badgeColor: "bg-purple-500 text-white"
    },
  ];

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-8">
      <header className="mb-8 md:mb-12 border-b-[3px] border-neo-text pb-4">
        <h1 className="font-archivo font-extrabold text-3xl md:text-5xl uppercase tracking-tight">
          Sion Tool<span className="text-neo-blue">.</span>
        </h1>
        <p className="font-bold mt-1 text-sm md:text-base text-gray-700">
          Semua alat yang kamu butuhkan, dalam satu tempat.
        </p>
      </header>

      {/* Grid 2 Kolom di HP, 4 Kolom di Desktop */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {tools.map((tool, index) => (
          <ToolCard 
            key={index} 
            title={tool.title} 
            description={tool.description} 
            badge={tool.badge} 
            href={tool.href}
            icon={tool.icon}
            badgeColor={tool.badgeColor}
          />
        ))}
      </section>
    </main>
  );
}
