"use client";

import Link from "next/link";
import AnimeCard from "../components/AnimeCard";
import { ArrowLeft, Play, Star } from "lucide-react";

export default function AnimeHome() {
  // GAMBAR DUMMY YANG PASTI MUNCUL (UNSPLASH)
  const featuredAnime = {
    id: "granblue-fantasy",
    title: "Granblue Fantasy: The Animation",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop", 
    genres: ["Fantasy", "Action", "Adventure"],
    synopsis: "Petualangan epik di dunia penuh misteri dan kekuatan luar biasa. Bergabunglah dengan Gran dan kawan-kawan di langit biru.",
    status: "Completed",
    rating: 8.2
  };

  const trendingAnime = [
    { id: "solo-leveling", title: "Solo Leveling", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop", genres: ["Action", "Fantasy"], status: "Ongoing", rating: 8.5 },
    { id: "demon-slayer", title: "Demon Slayer", image: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=500&auto=format&fit=crop", genres: ["Action", "Supernatural"], status: "Ongoing", rating: 8.8 },
    { id: "jujutsu-kaisen", title: "Jujutsu Kaisen", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=500&auto=format&fit=crop", genres: ["Action", "Fantasy"], status: "Ongoing", rating: 8.6 },
    { id: "frieren", title: "Frieren: Beyond Journey's End", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop", genres: ["Adventure", "Drama"], status: "Completed", rating: 9.1 },
    { id: "one-piece", title: "One Piece", image: "https://images.unsplash.com/photo-1628260412297-a3377e45006f?q=80&w=500&auto=format&fit=crop", genres: ["Action", "Adventure"], status: "Ongoing", rating: null },
  ];

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

      {/* 1. Hero Banner Anime */}
      <div className="relative w-full h-[250px] md:h-[350px] border-[3px] border-neo-text rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#111] mb-8 bg-gray-900">
        <img 
          src={featuredAnime.image} 
          alt={featuredAnime.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-5 md:p-8 flex flex-col justify-end h-full w-full">
          <span className="bg-white text-black text-[10px] font-extrabold uppercase px-2 py-1 rounded-md border-[2px] border-black w-fit mb-2 shadow-[2px_2px_0px_0px_#111]">
            Featured Anime
          </span>
          <h2 className="font-archivo font-extrabold text-3xl md:text-5xl text-white uppercase leading-none mb-2 drop-shadow-lg">
            {featuredAnime.title}
          </h2>
          <p className="text-xs md:text-sm text-gray-300 font-bold mb-4 max-w-xl line-clamp-2">
            {featuredAnime.synopsis}
          </p>
          <div className="flex items-center gap-3">
            {/* Tombol sudah pakai warna kuning yang pasti muncul */}
            <Link href={`/anime/${featuredAnime.id}`} className="neo-button bg-neo-yellow text-black px-6 py-2.5 text-sm flex items-center gap-2 hover:bg-yellow-400">
              <Play size={18} className="fill-black" /> Tonton
            </Link>
            <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_0px_#111]">
               <Star size={16} className="fill-neo-yellow text-black" />
               <span className="font-extrabold text-sm">{featuredAnime.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Trending Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-archivo font-extrabold text-xl md:text-2xl text-black uppercase">
          Trending Anime
        </h2>
        <Link href="#" className="text-xs font-bold text-neo-blue hover:underline">
          See all →
        </Link>
      </div>

      {/* 3. Grid Anime */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {trendingAnime.map((anime) => (
          <AnimeCard 
            key={anime.id}
            id={anime.id}
            title={anime.title}
            image={anime.image}
            genres={anime.genres}
            status={anime.status as "Ongoing" | "Completed"}
            rating={anime.rating}
          />
        ))}
      </section>

    </main>
  );
}
