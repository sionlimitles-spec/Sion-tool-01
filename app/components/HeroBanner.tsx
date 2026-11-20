import { Zap } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[260px] md:h-[380px] border-[3px] border-neo-text rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#111] mb-6 bg-zinc-900">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      >
        <source src="https://files.catbox.moe/w7817a.mp4" type="video/mp4" />
      </video>

      {/* Overlay Gradient - Lebih transparan agar video kelihatan */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Konten Teks */}
      <div className="absolute bottom-0 left-0 p-5 md:p-8 flex flex-col justify-end h-full w-full">
        <div className="flex items-center gap-3 mb-1 drop-shadow-lg">
          <Zap size={32} className="text-white fill-white" strokeWidth={2.5} />
          <h1 className="font-archivo font-extrabold text-4xl md:text-6xl uppercase tracking-tighter text-white drop-shadow-xl">
            <span className="text-transparent [-webkit-text-stroke:2px_#fff]">SION</span> TOOL
          </h1>
        </div>
        <p className="font-bold text-xs md:text-base text-gray-200 ml-11 drop-shadow-md">
          By Sion Developer
        </p>
      </div>
    </div>
  );
}
