"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, Bookmark, Play, RefreshCw, Star } from "lucide-react";
import AnimeHeader from "../../components/AnimeHeader";
import EpisodePlayer from "../../components/EpisodePlayer";
import Footer from "../../components/Footer";
import { Anime, animeTitle, api, getLastEp, getWatchlist, isAiring, poster, setLastEp, toggleWatchlist } from "../../lib/api";
import { blip } from "../../lib/sound";

const PER = 50;

export default function AnimeDetail() {
  const { id } = useParams<{ id: string }>();
  const malId = Number(id);
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ep, setEp] = useState<number | null>(null);
  const [last, setLast] = useState(0);
  const [range, setRange] = useState(0);
  const [saved, setSaved] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true); setError(null);
    api<{ data: Anime }>(`/anime/${malId}/full`, ac.signal)
      .then((r) => { setAnime(r.data); setSaved(getWatchlist().some((x) => x.mal_id === malId)); })
      .catch((e) => { if (e?.name !== "AbortError") setError(e?.message || "Gagal memuat"); })
      .finally(() => { if (!ac.signal.aborted) setLoading(false); });
    setLast(getLastEp(malId));
    return () => ac.abort();
  }, [malId, tick]);

  const total = useMemo(() => (anime ? anime.episodes || (isAiring(anime) ? 12 : 1) : 1), [anime]);
  const ranges = Math.ceil(total / PER);

  const play = (n: number) => {
    blip(); setEp(n); setLast(n); setLastEp(malId, n); setRange(Math.floor((n - 1) / PER));
    requestAnimationFrame(() => document.getElementById("player")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  if (loading) return (
    <main id="main" className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
      <AnimeHeader back="/anime" />
      <div className="skeleton w-full aspect-video rounded-2xl border-[3px] border-neo-text mb-6" />
      <div className="skeleton h-6 w-2/3 rounded mb-3" /><div className="skeleton h-24 rounded" />
    </main>
  );

  if (error || !anime) return (
    <main id="main" className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
      <AnimeHeader back="/anime" />
      <div role="alert" className="flex flex-col items-center text-center bg-white border-[3px] border-neo-text rounded-2xl p-8 shadow-[4px_4px_0_#0A0A0A]">
        <AlertCircle className="w-14 h-14 text-neo-pink mb-3" />
        <h2 className="font-display uppercase text-2xl mb-1">Anime tidak ditemukan</h2>
        <p className="font-bold text-gray-600 mb-4">{error}</p>
        <button type="button" onClick={() => setTick((t) => t + 1)} className="neo-button !bg-neo-yellow !text-black px-6 py-2.5"><RefreshCw size={16} /> Coba lagi</button>
      </div>
    </main>
  );

  const title = animeTitle(anime);
  const from = range * PER + 1, to = Math.min(total, from + PER - 1);

  return (
    <main id="main" className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col min-h-screen">
      <AnimeHeader back="/anime" />

      <section id="player" className="mb-8 scroll-mt-4 fade-in" aria-label="Pemutar">
        <h1 className="font-display uppercase text-2xl md:text-3xl leading-tight mb-3 line-clamp-2">
          <span className="bg-neo-yellow px-2 inline-block border-2 border-neo-text -rotate-1">{title}</span>
        </h1>
        {ep ? (
          <>
            <p className="font-extrabold text-sm mb-2 flex items-center gap-2"><Play size={16} className="fill-black" /> Episode {ep}</p>
            <EpisodePlayer malId={malId} ep={ep} total={total} onChange={play} />
          </>
        ) : (
          <button type="button" onClick={() => play(last || 1)} className="group relative block w-full aspect-video overflow-hidden border-[3px] border-neo-text rounded-2xl shadow-[6px_6px_0_#0A0A0A] bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster(anime)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[2px] scale-110 transition-transform duration-700 group-hover:scale-125" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="flex flex-col items-center gap-3">
                <span className="w-20 h-20 grid place-items-center bg-neo-pink border-4 border-white shadow-[5px_5px_0_#0A0A0A] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"><Play size={36} className="fill-white text-white ml-1" /></span>
                <span className="tape !text-sm">{last ? `LANJUT EPISODE ${last}` : "MULAI NONTON EP 1"}</span>
              </span>
            </span>
          </button>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 max-w-[240px] md:max-w-none mx-auto md:mx-0 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster(anime)} alt={title} className="w-full aspect-[3/4] object-cover border-[3px] border-neo-text rounded-2xl shadow-[5px_5px_0_#FF2E88] -rotate-1" />
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-white border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0_#0A0A0A] p-5">
            <div className="flex flex-wrap gap-2 mb-3">
              {(anime.genres || []).map((g) => <span key={g.mal_id} className="px-2 py-0.5 border-2 border-neo-text bg-neo-cyan text-[11px] font-extrabold rounded-md">{g.name}</span>)}
            </div>
            <h2 className="font-display uppercase text-lg mb-1">Sinopsis</h2>
            <p className="text-sm text-gray-800 leading-relaxed font-medium line-clamp-6">{anime.synopsis || "Belum ada sinopsis."}</p>
          </div>
          <div className="bg-white border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0_#0A0A0A] p-5 grid grid-cols-3 gap-4 text-sm">
            <div><span className="block text-gray-600 text-xs font-bold uppercase mb-1">Rating</span><span className="font-extrabold flex items-center gap-1"><Star size={14} className="fill-neo-yellow" />{anime.score ?? "N/A"}</span></div>
            <div><span className="block text-gray-600 text-xs font-bold uppercase mb-1">Status</span><span className="font-extrabold">{isAiring(anime) ? "Ongoing" : "Selesai"}</span></div>
            <div><span className="block text-gray-600 text-xs font-bold uppercase mb-1">Episode</span><span className="font-extrabold">{anime.episodes ?? "?"}</span></div>
          </div>
          <button type="button" aria-pressed={saved}
            onClick={() => { blip(); setSaved(toggleWatchlist({ mal_id: malId, title, image: poster(anime) })); }}
            className={`neo-button px-5 py-3 w-fit ${saved ? "!bg-neo-pink" : ""}`}>
            <Bookmark size={18} className={saved ? "fill-white" : ""} /> {saved ? "Ada di watchlist" : "Tambah ke watchlist"}
          </button>
        </div>
      </div>

      <section aria-label="Daftar episode">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display uppercase text-xl md:text-2xl">Daftar Episode</h2>
          {isAiring(anime) && !anime.episodes && <span className="tape">JUMLAH PERKIRAAN</span>}
        </div>
        {ranges > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-1" role="group" aria-label="Rentang episode">
            {Array.from({ length: ranges }).map((_, i) => (
              <button key={i} type="button" aria-pressed={range === i} onClick={() => setRange(i)} className={`neo-chip shrink-0 ${range === i ? "neo-chip-active" : ""}`}>{i * PER + 1}–{Math.min(total, (i + 1) * PER)}</button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
          {Array.from({ length: to - from + 1 }).map((_, i) => {
            const n = from + i, cur = ep === n, was = last === n;
            return (
              <button key={n} type="button" onClick={() => play(n)} aria-current={cur ? "true" : undefined} aria-label={`Episode ${n}`}
                className={`relative border-[3px] border-neo-text rounded-xl py-3 font-display text-base shadow-[3px_3px_0_#0A0A0A] transition-all duration-200 hover:-translate-y-1 active:translate-y-[3px] active:shadow-none ${cur ? "bg-neo-pink text-white" : was ? "bg-neo-yellow" : "bg-white hover:bg-neo-cyan"}`}>
                {n}
                {was && !cur && <span className="absolute -top-2 -right-1 text-[8px] bg-black text-neo-yellow px-1 font-extrabold">LAST</span>}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex-grow" />
      <Footer />
    </main>
  );
}
