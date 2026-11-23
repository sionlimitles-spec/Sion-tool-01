"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, RefreshCw } from "lucide-react";

const src = (mal: number, ep: number) => `https://megaplay.buzz/stream/mal/${mal}/${ep}/sub`;

export default function EpisodePlayer({ malId, ep, total, onChange }: { malId: number; ep: number; total: number; onChange: (n: number) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(false);       // fullscreen asli
  const [pseudo, setPseudo] = useState(false); // cadangan (iOS)
  const [idle, setIdle] = useState(false);
  const [key, setKey] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = fs || pseudo;

  const restart = useCallback(() => {
    setIdle(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIdle(true), 5000); // hilang setelah 5 detik tanpa sentuhan
  }, []);

  useEffect(() => {
    const onFs = () => { const on = !!(document.fullscreenElement || (document as any).webkitFullscreenElement); setFs(on); if (on) restart(); else setIdle(false); };
    document.addEventListener("fullscreenchange", onFs); document.addEventListener("webkitfullscreenchange", onFs);
    return () => { document.removeEventListener("fullscreenchange", onFs); document.removeEventListener("webkitfullscreenchange", onFs); if (timer.current) clearTimeout(timer.current); };
  }, [restart]);

  // ketukan di dalam iframe tidak sampai ke halaman: deteksi lewat blur window
  useEffect(() => {
    if (!active) return;
    const onBlur = () => setTimeout(() => { if (document.activeElement?.tagName === "IFRAME") { restart(); window.focus(); } }, 0);
    window.addEventListener("blur", onBlur); restart();
    return () => window.removeEventListener("blur", onBlur);
  }, [active, restart]);

  useEffect(() => {
    if (!pseudo) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setPseudo(false);
    document.addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [pseudo]);

  const toggleFs = async () => {
    if (active) { if (fs) { try { await (document.exitFullscreen?.() ?? (document as any).webkitExitFullscreen?.()); } catch {} } setPseudo(false); return; }
    const el = wrap.current as any;
    try {
      if (el?.requestFullscreen) await el.requestFullscreen({ navigationUI: "hide" });
      else if (el?.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else setPseudo(true);
      try { await (screen.orientation as any)?.lock?.("landscape"); } catch {}
    } catch { setPseudo(true); }
  };

  const prev = ep > 1, next = ep < total;
  return (
    <div ref={wrap} onPointerMove={(e) => e.pointerType === "mouse" && active && restart()} onPointerDown={() => active && restart()}
      className={`relative bg-black ${pseudo ? "player-fs" : "w-full aspect-video border-[3px] border-neo-text rounded-2xl shadow-[6px_6px_0_#0A0A0A] overflow-hidden"} ${active && idle ? "ui-idle" : ""}`}>
      <iframe key={`${malId}-${ep}-${key}`} src={src(malId, ep)} title={`Episode ${ep}`} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" />

      {/* tombol layar penuh (pojok kanan atas) */}
      <button type="button" onClick={toggleFs} aria-label={active ? "Keluar layar penuh" : "Layar penuh"} className="player-ui neo-iconbtn absolute top-3 right-3 z-10 !w-10 !h-10">
        {active ? <Minimize size={18} strokeWidth={3} /> : <Maximize size={18} strokeWidth={3} />}
      </button>

      {/* navigasi episode — tampil juga di layar penuh */}
      {active && (
        <>
          <div className="player-ui absolute left-3 top-3 z-10 flex items-center gap-2">
            <span className="bg-neo-yellow border-2 border-black px-2 py-1 font-display text-sm tracking-wide">EP {ep}/{total}</span>
          </div>
          <div className="player-ui absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
            <button type="button" disabled={!prev} onClick={() => onChange(ep - 1)} aria-label="Episode sebelumnya" className="neo-button !bg-white !text-black px-4 py-2.5 text-sm"><ChevronLeft size={18} strokeWidth={3} /> Prev</button>
            <button type="button" disabled={!next} onClick={() => onChange(ep + 1)} aria-label="Episode selanjutnya" className="neo-button !bg-neo-pink px-4 py-2.5 text-sm">Next <ChevronRight size={18} strokeWidth={3} /></button>
          </div>
        </>
      )}

      {!active && (
        <button type="button" onClick={() => setKey((k) => k + 1)} aria-label="Muat ulang pemutar" className="neo-iconbtn absolute top-3 left-3 z-10 !w-10 !h-10"><RefreshCw size={16} strokeWidth={3} /></button>
      )}
    </div>
  );
}
