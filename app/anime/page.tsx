"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Star, AlertCircle, RefreshCw, Bookmark, ChevronDown } from "lucide-react";
import AnimeHeader from "../components/AnimeHeader";
import Footer from "../components/Footer";
import { AnimeGrid } from "../components/AnimeCard";
import { Anime, GENRES, Mini, animeTitle, api, dedupe, getWatchlist, listPath, poster, ListResult } from "../lib/api";
import { blip } from "../lib/sound";

const SORTS = [
  { key: "pop", label: "🔥 Populer", p: { order_by: "popularity", sort: "asc" } },
  { key: "air", label: "📺 Ongoing", p: { status: "airing", order_by: "popularity", sort: "asc" } },
  { key: "top", label: "⭐ Rating", p: { order_by: "score", sort: "desc", min_score: 7.5 } },
  { key: "new", label: "🆕 Terbaru", p: { order_by: "start_date", sort: "desc", status: "airing" } },
] as const;

export default function AnimeHome() {
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("pop");
  const [genre, setGenre] = useState<number | null>(null);
  const [items, setItems] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featured, setFeatured] = useState<Anime | null>(null);
  const [wl, setWl] = useState<Mini[]>([]);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => setWl(getWatchlist()), []);

  const load = useCallback(async (p: number, replace: boolean) => {
    abort.current?.abort();
    const ac = (abort.current = new AbortController());
    setLoading(true); setError(null);
    try {
      const def = SORTS.find((s) => s.key === sort)!;
      const res = await api<ListResult>(listPath({ ...def.p, genres: genre ?? undefined, page: p }), ac.signal);
      setItems((prev) => dedupe(replace ? res.data : [...prev, ...res.data]));
      setPage(p); setMore(!!res.pagination?.has_next_page);
      if (replace && !genre && sort === "pop" && res.data[0]) setFeatured(res.data[0]);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setError(e?.message || "Gagal memuat data");
    } finally {
      if (abort.current === ac) setLoading(false);
    }
  }, [sort, genre]);

  useEffect(() => { setItems([]); load(1, true); return () => abort.current?.abort(); }, [load]);

  const showHero = featured && !genre && sort === "pop";

  return (
    <main id="main" className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col min-h-screen">
      <AnimeHeader back="/" />

      {showHero && (
        <div className="relative w-full h-[260px] md:h-[360px] border-[3px] border-neo-text rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#0A0A0A] mb-8 bg-gray-900 fade-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster(featured)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70 scale-110 blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <span className="absolute top-3 left-3 tape -rotate-3">FEATURED</span>
          <div className="absolute bottom-0 left-0 p-5 md:p-8 w-full">
            <h2 className="font-display text-3xl md:text-5xl text-white uppercase leading-none mb-3 line-clamp-2">{animeTitle(featured)}</h2>
            <div className="flex items-center gap-3">
              <Link href={`/anime/${featured.mal_id}`} onClick={() => blip()} className="neo-button !bg-neo-yellow !text-black !shadow-[3px_3px_0_#FF2E88] px-6 py-2.5 text-sm"><Play size={18} className="fill-black" /> Tonton</Link>
              {featured.score ? <span className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0_#0A0A0A] font-extrabold text-sm"><Star size={16} className="fill-neo-yellow" />{featured.score}</span> : null}
            </div>
          </div>
        </div>
      )}

      {wl.length > 0 && (
        <section className="mb-8" aria-label="Watchlist">
          <h2 className="font-display uppercase text-xl mb-3 flex items-center gap-2"><Bookmark size={20} className="fill-neo-pink" /> Watchlist-mu</h2>
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x">
            {wl.map((m) => (
              <Link key={m.mal_id} href={`/anime/${m.mal_id}`} className="snap-start shrink-0 w-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.image} alt="" className="w-24 aspect-[3/4] object-cover border-[3px] border-neo-text rounded-lg shadow-[3px_3px_0_#0A0A0A]" />
                <p className="text-[10px] font-extrabold leading-tight mt-1.5 line-clamp-2">{m.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mb-5 space-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Urutkan">
          {SORTS.map((s) => (
            <button key={s.key} type="button" aria-pressed={sort === s.key} onClick={() => { blip(); setSort(s.key); }} className={`neo-chip ${sort === s.key ? "neo-chip-active" : ""}`}>{s.label}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Genre">
          {GENRES.map((g) => (
            <button key={g.id} type="button" aria-pressed={genre === g.id} onClick={() => { blip(); setGenre(genre === g.id ? null : g.id); }} className={`neo-chip !text-xs !py-1 ${genre === g.id ? "neo-chip-active" : ""}`}>{g.name}</button>
          ))}
        </div>
      </div>

      <h2 className="font-display uppercase text-2xl md:text-3xl mb-4 inline-block">
        <span className="bg-neo-yellow px-2 -rotate-1 inline-block border-2 border-neo-text">{genre ? GENRES.find((g) => g.id === genre)?.name : SORTS.find((s) => s.key === sort)!.label.replace(/^\S+\s/, "")} Anime</span>
      </h2>

      {error && (
        <div role="alert" className="flex flex-col items-center text-center border-[3px] border-neo-text rounded-2xl bg-white p-8 shadow-[4px_4px_0_#0A0A0A] mb-6">
          <AlertCircle className="w-12 h-12 text-neo-pink mb-3" />
          <p className="font-bold mb-4">{error}. Server mungkin sedang sibuk.</p>
          <button type="button" onClick={() => load(1, true)} className="neo-button !bg-neo-yellow !text-black px-5 py-2.5"><RefreshCw size={16} /> Coba lagi</button>
        </div>
      )}

      <AnimeGrid items={items} loading={loading} />

      {!loading && !error && items.length === 0 && (
        <div className="text-center font-display uppercase text-xl py-12 bg-white border-[3px] border-neo-text shadow-[4px_4px_0_#0A0A0A]">Tidak ada anime ditemukan</div>
      )}

      {more && !loading && (
        <button type="button" onClick={() => load(page + 1, false)} className="neo-button !bg-neo-yellow !text-black mx-auto mt-8 px-8 py-3"><ChevronDown size={18} strokeWidth={3} /> Muat lebih banyak</button>
      )}

      <div className="flex-grow" />
      <Footer />
    </main>
  );
}
