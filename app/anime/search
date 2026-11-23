"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, Clock, Flame, AlertCircle } from "lucide-react";
import AnimeHeader from "../../components/AnimeHeader";
import { AnimeGrid } from "../../components/AnimeCard";
import { Anime, GENRES, ListResult, addRecent, api, clearRecent, dedupe, getRecent, listPath } from "../../lib/api";
import { blip } from "../../lib/sound";

const SUGGEST = ["Naruto", "One Piece", "Jujutsu Kaisen", "Frieren", "Attack on Titan", "Demon Slayer", "Spy x Family", "Blue Lock"];

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState<number | null>(null);
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => { setRecent(getRecent()); ref.current?.focus(); }, []);

  // pencarian langsung (debounce 450ms), respons lama diabaikan
  useEffect(() => {
    const term = q.trim();
    abort.current?.abort();
    if (term.length < 2 && genre === null) { setItems([]); setDone(false); setLoading(false); setError(null); return; }
    const t = setTimeout(async () => {
      const ac = (abort.current = new AbortController());
      setLoading(true); setError(null);
      try {
        const res = await api<ListResult>(listPath({ q: term || undefined, genres: genre ?? undefined, order_by: "popularity", sort: "asc" }), ac.signal);
        setItems(dedupe(res.data)); setDone(true);
      } catch (e: any) { if (e?.name !== "AbortError") setError(e?.message || "Gagal mencari"); }
      finally { if (abort.current === ac) setLoading(false); }
    }, 450);
    return () => clearTimeout(t);
  }, [q, genre]);

  const submit = (e: React.FormEvent) => { e.preventDefault(); const t = q.trim(); if (t.length >= 2) { addRecent(t); setRecent(getRecent()); } ref.current?.blur(); };
  const run = (t: string) => { blip(); setQ(t); addRecent(t); setRecent(getRecent()); };
  const idle = !q.trim() && genre === null;

  return (
    <main id="main" className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col min-h-screen">
      <AnimeHeader back="/anime" hideSearch />

      <form onSubmit={submit} role="search" className="relative mb-5">
        <label htmlFor="q" className="sr-only">Cari anime</label>
        <Search size={20} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input id="q" ref={ref} value={q} onChange={(e) => setQ(e.target.value)} type="search" enterKeyHint="search" autoComplete="off" placeholder="Cari judul anime…"
          className="w-full bg-white border-[3px] border-neo-text rounded-xl py-4 pl-12 pr-12 font-bold shadow-[4px_4px_0_#0A0A0A] focus:outline-none focus:shadow-[6px_6px_0_#FF2E88] transition-shadow" />
        {q && <button type="button" aria-label="Hapus" onClick={() => { setQ(""); ref.current?.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center bg-neo-yellow border-2 border-neo-text"><X size={16} strokeWidth={3} /></button>}
      </form>

      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Genre">
        {GENRES.map((g) => (
          <button key={g.id} type="button" aria-pressed={genre === g.id} onClick={() => { blip(); setGenre(genre === g.id ? null : g.id); }} className={`neo-chip !text-xs !py-1 ${genre === g.id ? "neo-chip-active" : ""}`}>{g.name}</button>
        ))}
      </div>

      {idle && (
        <div className="fade-in space-y-7">
          {recent.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display uppercase text-lg flex items-center gap-2"><Clock size={18} /> Terakhir dicari</h2>
                <button type="button" onClick={() => { clearRecent(); setRecent([]); }} className="text-xs font-bold underline">Hapus</button>
              </div>
              <div className="flex flex-wrap gap-2">{recent.map((r) => <button key={r} type="button" className="neo-chip" onClick={() => run(r)}>{r}</button>)}</div>
            </section>
          )}
          <section>
            <h2 className="font-display uppercase text-lg flex items-center gap-2 mb-2"><Flame size={18} className="fill-neo-pink text-neo-pink" /> Coba cari</h2>
            <div className="flex flex-wrap gap-2">{SUGGEST.map((r) => <button key={r} type="button" className="neo-chip" onClick={() => run(r)}>{r}</button>)}</div>
          </section>
        </div>
      )}

      {error && (
        <div role="alert" className="flex items-center gap-3 border-[3px] border-neo-text bg-white p-4 shadow-[4px_4px_0_#0A0A0A] mb-4"><AlertCircle className="text-neo-pink shrink-0" /> <p className="font-bold text-sm">{error}</p></div>
      )}
      <p className="sr-only" role="status">{loading ? "Mencari…" : done ? `${items.length} hasil` : ""}</p>

      {!idle && <AnimeGrid items={items} loading={loading} />}
      {!idle && done && !loading && !error && items.length === 0 && (
        <div className="text-center py-12 bg-white border-[3px] border-neo-text shadow-[4px_4px_0_#0A0A0A]"><p className="font-display uppercase text-xl">Tidak ketemu 😔</p><p className="text-sm font-bold text-gray-600 mt-1">Coba kata kunci lain.</p></div>
      )}
    </main>
  );
}
