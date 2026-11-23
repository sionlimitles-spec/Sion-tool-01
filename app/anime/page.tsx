"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Star, Play, Loader2 } from "lucide-react";

const ANILIST_API = 'https://graphql.anilist.co';
const MEDIA_FIELDS = `
  id idMal title { romaji english } coverImage { extraLarge large } bannerImage
  averageScore status format genres description episodes seasonYear
`;

export default function AnimeHome() {
  const [animes, setAnimes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchAnimes = async (pageNum = 1, search = "") => {
    setIsLoading(true);
    const query = `
      query($page: Int, $search: String) {
        Page(page: $page, perPage: 24) {
          pageInfo { hasNextPage }
          media(type: ANIME, isAdult: false, sort: ${search ? 'SEARCH_MATCH' : 'TRENDING_DESC'}, search: $search) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;
    try {
      const res = await fetch(ANILIST_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { page: pageNum, search: search || undefined } })
      });
      const data = await res.json();
      if (data.data) {
        if (pageNum === 1) setAnimes(data.data.Page.media);
        else setAnimes(prev => [...prev, ...data.data.Page.media]);
        setHasNextPage(data.data.Page.pageInfo.hasNextPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimes(1, searchQuery);
    setPage(1);
  }, [searchQuery]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAnimes(nextPage, searchQuery);
  };

  const featured = animes[0];

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <Link href="/" className="neo-btn bg-ink text-yellow flex items-center gap-2">
          ← Kembali
        </Link>
        <h1 className="font-anton text-4xl uppercase tracking-wider">SION<span className="text-pink">NIME</span></h1>
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink" size={20} />
          <input 
            type="text" 
            placeholder="Cari anime..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neo-input pl-10 py-2"
          />
        </div>
      </div>

      {/* Hero Section */}
      {!searchQuery && featured && (
        <div className="relative neo-card bg-ink text-white overflow-hidden mb-10 h-[300px] md:h-[400px] rounded-2xl">
          <img src={featured.bannerImage || featured.coverImage.extraLarge} alt={featured.title.romaji} className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
          <div className="absolute bottom-0 p-6 md:p-10 flex flex-col items-start gap-3 w-full">
            <span className="bg-yellow text-ink font-bold px-3 py-1 neo-border neo-shadow-sm -rotate-2">TRENDING #1</span>
            <h2 className="font-anton text-3xl md:text-5xl uppercase leading-none text-white drop-shadow-[3px_3px_0_#0A0A0A]">{featured.title.english || featured.title.romaji}</h2>
            <div className="flex gap-2 text-xs md:text-sm font-bold text-gray-300 mt-2">
              <span className="flex items-center gap-1"><Star size={14} className="text-yellow" /> {featured.averageScore ? (featured.averageScore / 10).toFixed(1) : 'N/A'}</span>
              <span>•</span>
              <span>{featured.format}</span>
              <span>•</span>
              <span>{featured.seasonYear}</span>
            </div>
            <Link href={`/anime/${featured.id}`} className="neo-btn bg-pink text-white mt-4 flex items-center gap-2">
              <Play size={18} fill="white" /> Tonton Sekarang
            </Link>
          </div>
        </div>
      )}

      {/* Grid Anime */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {animes.map((anime) => (
          <Link key={anime.id} href={`/anime/${anime.id}`} className="group flex flex-col">
            <div className="relative aspect-[2/3] neo-card overflow-hidden mb-3">
              <img src={anime.coverImage.large} alt={anime.title.romaji} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute top-2 left-2 bg-ink text-yellow text-[10px] font-bold px-2 py-0.5 neo-border rounded">
                {anime.status === 'RELEASING' ? 'ONGOING' : 'COMPLETE'}
              </div>
              <div className="absolute top-2 right-2 bg-white text-ink text-xs font-bold px-2 py-0.5 neo-border neo-shadow-sm rounded flex items-center gap-1">
                <Star size={12} className="fill-yellow" /> {anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}
              </div>
            </div>
            <h3 className="font-anton text-sm md:text-base leading-tight line-clamp-2 group-hover:underline">{anime.title.english || anime.title.romaji}</h3>
            <p className="text-[10px] md:text-xs font-bold text-gray-500 mt-1">{anime.genres.slice(0, 2).join(' • ')}</p>
          </Link>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-ink" size={32} />
        </div>
      )}

      {!isLoading && hasNextPage && (
        <div className="flex justify-center mt-10">
          <button onClick={loadMore} className="neo-btn bg-white font-anton text-xl px-8 py-3">MUAT LEBIH BANYAK ↓</button>
        </div>
      )}
    </main>
  );
}
