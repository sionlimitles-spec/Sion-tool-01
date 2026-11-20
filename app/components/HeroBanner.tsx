import Logo from "./Logo";

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[200px] md:h-[280px] border-[3px] border-neo-text rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#111] mb-6 bg-zinc-900">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80">
        <source src="https://files.catbox.moe/w7817a.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      
      <div className="absolute bottom-0 left-0 p-5 md:p-8 flex flex-col justify-end h-full w-full">
        <div className="flex items-center gap-3 mb-1 drop-shadow-lg">
          {/* Kotak Logo Baru */}
          <div className="bg-black border-[2px] border-white p-1.5 rounded-xl shadow-[2px_2px_0px_0px_#fff]">
            <Logo className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="font-archivo font-extrabold text-3xl md:text-5xl uppercase tracking-tighter text-white drop-shadow-xl">
            <span className="text-transparent [-webkit-text-stroke:2px_#fff]">SION</span> TOOL
          </h1>
        </div>
        <p className="font-bold text-[10px] md:text-sm text-gray-300 ml-14 md:ml-16 drop-shadow-md">
          By Sion Developer
        </p>
      </div>
    </div>
  );
}
