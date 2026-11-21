"use client";

import Link from "next/link";
import AnimeCard from "../components/AnimeCard";
import { ArrowLeft, Play, Star, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// Tipe data untuk hasil dari Jikan API
interface JikanAnime {
  mal_id: number;
  title: string;
  images: { jpg: { large_image_url: string } };
  genres: { name: string }[];
  status: string;
  score: number | null;
}

export default function AnimeHome() {
  const [trendingAnime, setTrendingAnime] = useState<JikanAnime[]>([]);
  const [featuredAnime, setFeaturedAnime] = useState<JikanAnime | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnime() {
      try {
        // 1. Ambil data Top Anime (Trending)
        const topRes = await fetch("https://api.jikan.moe/v4/top/anime?limit=10");
        const topData = await topRes.json();
        
        // Jeda sebentar untuk menghormati rate limit Jikan (3 req/detik)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 2. Ambil data Seasonal Anime (Ongoing)
        const seasonRes = await fetch("https://api.jikan.moe/v4/seasons/now?limit=10");
        const seasonData = await seasonRes.json();

        // Gabungkan hasilnya (atau tampilkan salah satunya)
        // Untuk contoh, kita ambil 10 dari Top Anime sebagai Trending
        setTrendingAnime(topData.data);
        
        // Ambil anime pertama dari Top sebagai Featured Hero
        if (topData.data.length > 0) {
          setFeaturedAnime(topData.data[0]);
        }

      } catch (error) {
        console.error("Gagal mengambil data anime:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnime();
  }, []);

  if (isLoading) {
    return (
      <main className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-neo-text mb-4" />
        <p className="font-archivo font-bold text-lg">Memuat data anime...</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col min-h-screen">
      
      {/* Header / Navbar Khusus Anime */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="bg-white border-[3px] border-neo-text p-2 rounded-xl shadow-[3px_3px_0px_0px_#111] active:translate-y-[3px] active:shadow-none transition-all">
          <ArrowLeft size={20} strokeWidth={3} />
        </Link>
        <h1 className="font-archivo font-extrabold text-2xl md:text-3xl uppercase tracking-tighter">
          Anime<span className="text-neo-pink">.</span>
        </h1>
      </div>

      {/* 1. Hero Banner Anime (Data dari API) */}
      {featuredAnime && (
        <div className="relative w-full h-[250px] md:h-[350px] border-[3px] border-neo-text rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#111] mb-8 bg-gray-900">
          <img 
            src={featuredAnime.images.jpg.large_image_url} 
            alt={featuredAnime.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-5 md:p-8 flex flex-col justify-end h-full w-full">
            <span className="bg-white text-black text-[10px] font-extrabold uppercase px-2 py-1 rounded-md border-[2px] border-black w-fit mb-2 shadow-[2px_2px_0px_0px_#111]">
              Featured Anime
            </span>
            <h2 className="font-archivo font-extrabold text-3xl md:text-5xl text-white uppercase leading-none mb-2 drop-shadow-lg line-clamp-2">
              {featuredAnime.title}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <Link href={`/anime/${featuredAnime.mal_id}`} className="neo-button bg-neo-yellow text-black px-6 py-2.5 text-sm flex items-center gap-2 hover:bg-yellow-400">
                <Play size={18} className="fill-black" /> Tonton
              </Link>
              {featuredAnime.score && (
                <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_0px_#111]">
                   <Star size={16} className="fill-neo-yellow text-black" />
                   <span className="font-extrabold text-sm">{featuredAnime.score}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Trending Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-archivo font-extrabold text-xl md:text-2xl text-black uppercase">
          Trending Anime
        </h2>
        <Link href="#" className="text-xs font-bold text-neo-blue hover:underline">
          See all →
        </Link>
      </div>

      {/* 3. Grid Anime (Data dari API) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {trendingAnime.map((anime) => (
          <AnimeCard 
            key={anime.mal_id}
            id={anime.mal_id.toString()}
            title={anime.title}
            image={anime.images.jpg.large_image_url}
            genres={anime.genres.map(g => g.name)}
            status={anime.status === "Currently Airing" ? "Ongoing" : "Completed"}
            rating={anime.score}
          />
        ))}
      </section>

    </main>
  );
}
