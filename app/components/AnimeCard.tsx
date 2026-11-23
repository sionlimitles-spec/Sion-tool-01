"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Play, Star } from "lucide-react";
import { Anime, animeTitle, isAiring, poster } from "../lib/api";
import { blip, vibrate } from "../lib/sound";

/** Layar sentuh: tap 1 = pratinjau, tap 2 = buka. Mouse: hover lalu 1 klik. Keyboard: Enter langsung. */
export function AnimeGrid({ items, loading }: { items: Anime[]; loading?: boolean }) {
  const [armed, setArmed] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fine, setFine] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const set = () => setFine(mq.matches);
    set(); mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  useEffect(() => {
    if (armed === null) return;
    const off = (e: Event) => { if (!(e.target as HTMLElement).closest?.(`[data-card="${armed}"]`)) setArmed(null); };
    document.addEventListener("pointerdown", off, true);
    return () => document.removeEventListener("pointerdown", off, true);
  }, [armed]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const onTap = (e: React.MouseEvent<HTMLAnchorElement>, a: Anime) => {
    const keyboard = e.detail === 0;
    if (fine || keyboard || armed === a.mal_id) { blip(); setArmed(null); return; } // lanjut navigasi
    e.preventDefault();
    setArmed(a.mal_id); blip("hover"); vibrate();
    const box = e.currentTarget.querySelector(".pcard__img") as HTMLElement | null;
    if (box) {
      const r = box.getBoundingClientRect(), d = document.createElement("span");
      d.className = "ripple"; d.style.left = e.clientX - r.left + "px"; d.style.top = e.clientY - r.top + "px";
      box.appendChild(d); setTimeout(() => d.remove(), 650);
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setArmed(null), 5000);
  };

  if (!loading && items.length === 0) return null;
  return (
    <section aria-busy={loading} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      {items.map((a, i) => (
        <AnimeCard key={a.mal_id} a={a} armed={armed === a.mal_id} onTap={onTap} delay={Math.min(i % 24, 10) * 40} />
      ))}
      {loading && Array.from({ length: 8 }).map((_, i) => (
        <div key={"s" + i} aria-hidden="true">
          <div className="skeleton border-[3px] border-neo-text aspect-[3/4] rounded-xl" />
          <div className="skeleton h-4 mt-3 rounded w-4/5" />
        </div>
      ))}
    </section>
  );
}

function AnimeCard({ a, armed, onTap, delay }: { a: Anime; armed: boolean; onTap: (e: React.MouseEvent<HTMLAnchorElement>, a: Anime) => void; delay: number }) {
  const title = animeTitle(a), airing = isAiring(a);
  return (
    <Link href={`/anime/${a.mal_id}`} data-card={a.mal_id} onClick={(e) => onTap(e, a)}
      aria-label={`${title}${a.score ? `, skor ${a.score}` : ""}`}
      className={`pcard reveal group flex flex-col w-full ${armed ? "is-armed" : ""}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="pcard__img relative w-full aspect-[3/4] border-[3px] border-neo-text rounded-xl shadow-[4px_4px_0px_0px_#0A0A0A] mb-3 bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster(a)} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10 pointer-events-none">
          <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase border-2 border-neo-text rounded-md shadow-[2px_2px_0_#0A0A0A] -rotate-2 ${airing ? "bg-neo-acid" : "bg-neo-cyan"}`}>{airing ? "Ongoing" : "Selesai"}</span>
          {a.score ? (
            <span className="px-1.5 py-0.5 bg-neo-yellow border-2 border-neo-text rounded-md text-[10px] font-extrabold flex items-center gap-1 shadow-[2px_2px_0_#0A0A0A] rotate-2">
              <Star size={10} className="fill-black" />{a.score}
            </span>
          ) : null}
        </div>
        <div className="pcard__ov" aria-hidden="true">
          <div className="pcard__play"><Play size={26} className="fill-white ml-0.5" /></div>
          <span className="pcard__tag">TAP LAGI ▸ BUKA</span>
        </div>
      </div>
      <div className="pcard__title bg-white border-[3px] border-neo-text rounded-lg px-2.5 py-2 shadow-[3px_3px_0_#0A0A0A]">
        <h3 className="font-display uppercase text-[13px] leading-tight line-clamp-2">{title}</h3>
        <p className="text-[10px] font-bold text-gray-600 mt-1 truncate">{[a.type, a.year].filter(Boolean).join(" • ") || (a.genres || []).slice(0, 2).map((g) => g.name).join(" • ")}</p>
      </div>
    </Link>
  );
}
