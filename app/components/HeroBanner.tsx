import Logo from "./Logo";

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[220px] md:h-[300px] border-[3px] border-neo-text rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#0A0A0A] mb-6 bg-zinc-900">
      <video autoPlay loop muted playsInline preload="metadata" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-80">
        <source src="https://files.catbox.moe/w7817a.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
      <div className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(45deg,transparent_0_10px,rgba(255,229,0,.12)_10px_12px)]" />
      <span className="absolute top-3 right-3 tape rotate-3">GRATIS • NO ADS</span>
      <div className="absolute bottom-0 left-0 p-5 md:p-8 flex flex-col justify-end h-full w-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-black border-2 border-white p-1.5 rounded-xl shadow-[2px_2px_0_#FF2E88]">
            <Logo className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl uppercase tracking-wide text-white leading-none">
            <span className="text-transparent [-webkit-text-stroke:2px_#fff]">SION</span> <span className="text-neo-yellow">TOOL</span>
          </h1>
        </div>
        <p className="font-bold text-[11px] md:text-sm text-gray-200 ml-1">Alat gratis + nonton anime dalam satu web • By Sion Developer</p>
      </div>
    </div>
  );
}
