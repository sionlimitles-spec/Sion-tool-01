import { Zap } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[250px] md:h-[350px] border-[3px] border-neo-text rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#111] mb-6 bg-black">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src="https://files.catbox.moe/w7817a.mp4" type="video/mp4" />
      </video>

      {/* Overlay Gelap agar teks terbaca */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Konten Teks di Atas Video */}
      <div className="absolute bottom-0 left-0 p-6 md:p-8 flex flex-col justify-end h-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white border-[2px] border-neo-text p-1.5 rounded-lg shadow-[2px_2px_0px_0px_#111]">
            <Zap size={24} className="text-neo-text" strokeWidth={2.5} />
          </div>
          <h1 className="font-archivo font-extrabold text-4xl md:text-6xl uppercase tracking-tighter text-white">
            <span className="text-transparent [-webkit-text-stroke:2px_#fff]">SION</span> TOOL
          </h1>
        </div>
        <p className="font-bold text-sm md:text-lg text-gray-300">
          By Sion Developer
        </p>
      </div>
    </div>
  );
}
