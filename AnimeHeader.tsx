"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { blip, isSoundOn, setSoundOn } from "../lib/sound";

export function SearchPro({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10.2" cy="10.2" r="6.6" />
      <path d="M7.4 9.2a3.2 3.2 0 012.6-2.2" strokeWidth="1.6" opacity=".75" />
      <path d="M15.2 15.2L20.6 20.6" strokeWidth="3" />
      <path d="M19 3.2l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" fill="currentColor" strokeWidth="1" />
    </svg>
  );
}

export default function AnimeHeader({ back = "/", hideSearch = false }: { back?: string; hideSearch?: boolean }) {
  const [on, setOn] = useState(true);
  const [today, setToday] = useState("VOL.01");
  useEffect(() => {
    setOn(isSoundOn());
    setToday(new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" }).toUpperCase());
  }, []);

  return (
    <header className="relative flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        <Link href={back} aria-label="Kembali" onClick={() => blip()} className="neo-iconbtn shrink-0"><ArrowLeft size={20} strokeWidth={3} /></Link>
        <Link href="/anime" aria-label="SIONNIME, ke beranda anime" onClick={() => blip()} className="min-w-0 block">
          <span className="wordmark text-[clamp(30px,9vw,44px)]">SION<i>NIME</i><u>OK</u></span>
          <span className="flex items-center gap-2 mt-2 whitespace-nowrap">
            <span className="tape">ANIME ZINE</span>
            <em className="not-italic font-marker text-xs text-black/70 truncate hidden min-[380px]:inline">{today}</em>
          </span>
        </Link>
      </div>
      <div className="flex gap-2.5 shrink-0">
        {!hideSearch && (
          <Link href="/anime/search" aria-label="Cari anime" onClick={() => blip()} className="neo-iconbtn neo-iconbtn--ink sheen"><SearchPro /></Link>
        )}
        <button type="button" aria-label={on ? "Matikan suara" : "Nyalakan suara"} aria-pressed={on}
          onClick={() => { const n = !on; setOn(n); setSoundOn(n); if (n) blip(); }} className="neo-iconbtn">
          {on ? <Volume2 size={20} strokeWidth={2.6} /> : <VolumeX size={20} strokeWidth={2.6} />}
        </button>
      </div>
    </header>
  );
}
