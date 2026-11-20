import ToolCard from "./components/ToolCard";

export default function Home() {
  const tools = [
    { title: "Merge PDF", description: "Gabungkan beberapa file PDF menjadi satu dokumen.", badge: "PDF", href: "/tools/merge-pdf" },
    { title: "Kompres Gambar", description: "Kecilkan ukuran file JPG, PNG, atau WebP.", badge: "Gambar", href: "/tools/compress-img" },
    { title: "Streaming Anime", description: "Nonton anime favorit kualitas HD.", badge: "Stream", href: "/anime" },
    { title: "QR Code Studio", description: "Desain kode QR kustom dengan logo.", badge: "Kustom", href: "/tools/qr-code" },
  ];

  return (
    <main className="max-w-5xl mx-auto p-6 md:p-12">
      <header className="mb-12 border-b-[3px] border-neo-black pb-6">
        <h1 className="font-display text-4xl md:text-5xl uppercase">
          Sion Tool<span className="text-neo-pink">.</span>
        </h1>
        <p className="font-bold mt-2">Semua alat yang kamu butuhkan, dalam satu tempat.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {tools.map((tool, index) => (
          <ToolCard key={index} title={tool.title} description={tool.description} badge={tool.badge} href={tool.href} />
        ))}
      </section>
    </main>
  );
}
