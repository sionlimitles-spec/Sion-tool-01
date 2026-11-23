"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Star, Play, Loader2 } from "lucide-react";
import "./anime.css"; // Import CSS khusus anime

const ANILIST_API = 'https://graphql.anilist.co';

export default function AnimeHome() {
  const [animes, setAnimes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchAnimes() {
      setIsLoading(true);
      const query = `query($search: String) { Page(page: 1, perPage: 24) { media(type: ANIME, isAdult: false, sort: ${searchQuery ? 'SEARCH_MATCH' : 'TRENDING_DESC'}, search: $search) { id title { romaji english } coverImage { extraLarge large } averageScore status genres bannerImage } } }`;
      try {
        const res = await fetch(ANILIST_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { search: searchQuery || undefined } }) });
        const data = await res.json();
        if (data.data) setAnimes(data.data.Page.media);
      } finally { setIsLoading(false); }
    }
    fetchAnimes();
  }, [searchQuery]);

  const featured = animes[0];

  return (
    <div className="anime-page-wrapper pb-20">
      {/* Ticker Marquee */}
      <div className="ks-ticker overflow-hidden whitespace-nowrap">
        <div className="animate-[ticker_20s_linear_infinite] inline-flex gap-8">
          {[...Array(10)].map((_, i) => <span key={i}>SIONNIME ✦ ANIME ZINE ✦ SUB INDO ✦ NO ADS ✦ UPDATE HARIAN ✦</span>)}
        </div>
      </div>

      {/* Masthead */}
      <div className="ks-mast max-w-6xl mx-auto mt-4 rounded-xl">
        <div className="flex items-center gap-4">
          <Link href="/" className="ks-btn ks-btn-yellow px-3 py-2"><Play size={16}/> Beranda</Link>
          <h1 className="zine-font text-4xl uppercase">SION<span className="text-pink-500">NIME</span></h1>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 text-black" size={20} />
          <input type="text" placeholder="Cari anime..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border-[3px] border-black rounded shadow-[3px_3px_0_#0A0A0A] font-bold outline-none" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {/* Hero */}
        {!searchQuery && featured && (
          <div className="ks-hero h-[350px]">
            <img src={featured.bannerImage || featured.coverImage.extraLarge} className="ks-hero-bg" alt="" />
            <div className="ks-hero-content">
              <div className="max-w-2xl">
                <span className="bg-pink-500 text-white px-3 py-1 font-bold border-2 border-black mb-3 inline-block -rotate-2">TRENDING #1</span>
                <h2 className="ks-title">{featured.title.english || featured.title.romaji}</h2>
                <div className="flex gap-4 font-bold mt-4 mb-6 text-sm">
                  <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-yellow-400"/> {(featured.averageScore / 10).toFixed(1)}</span>
                  <span>•</span><span>{featured.status}</span>
                </div>
                <Link href={`/anime/${featured.id}`} className="ks-btn ks-btn-yellow">
                  <Play size={18} fill="black" /> TONTON SEKARANG
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {animes.map(anime => (
            <Link key={anime.id} href={`/anime/${anime.id}`} className="ks-card">
              <div className="relative">
                <img src={anime.coverImage.large} className="ks-card-img" alt="" />
                <span className="ks-badge">{anime.status === 'RELEASING' ? 'ONGOING' : 'COMPLETE'}</span>
                <span className="ks-badge-score"><Star size={12} className="fill-black" /> {anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}</span>
              </div>
              <h3 className="ks-card-title">{anime.title.english || anime.title.romaji}</h3>
            </Link>
          ))}
        </div>
        {isLoading && <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={48} /></div>}
      </div>
    </div>
  );
}
