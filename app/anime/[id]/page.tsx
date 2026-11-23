"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Play, List, Info, Loader2 } from "lucide-react";

const ANILIST_API = 'https://graphql.anilist.co';

export default function AnimeDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [anime, setAnime] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEp, setCurrentEp] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      const query = `
        query($id: Int) {
          Media(id: $id, type: ANIME) {
            id idMal title { romaji english } coverImage { extraLarge large }
            bannerImage description averageScore status format genres episodes seasonYear
            studios(isMain: true) { nodes { name } }
          }
        }
      `;
      try {
        const res = await fetch(ANILIST_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables: { id: Number(id) } })
        });
        const data = await res.json();
        if (data.data) {
          setAnime(data.data.Media);
          if (data.data.Media.episodes > 0) setCurrentEp(1);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchDetail();
  }, [id]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-ink" size={48} />
    </div>
  );

  if (!anime) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="font-anton text-4xl mb-4">ANIME TIDAK DITEMUKAN</h1>
      <button onClick={() => router.push('/anime')} className="neo-btn bg-ink text-yellow">Kembali</button>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/anime" className="neo-btn bg-white p-2">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-anton text-xl md:text-2xl uppercase truncate">{anime.title.english || anime.title.romaji}</h1>
      </div>

      <div className="mb-8">
        <h2 className="font-anton text-xl md:text-2xl uppercase mb-3 flex items-center gap-2">
          <Play size={24} /> 
          {currentEp ? `Episode ${currentEp}` : "Pilih Episode"}
        </h2>
        
        {currentEp && anime.idMal ? (
          <div className="flex flex-col">
            <div className="relative w-full aspect-video bg-black neo-border rounded-t-2xl neo-shadow overflow-hidden">
              <iframe
                key={currentEp}
                src={`https://megaplay.buzz/stream/mal/${anime.idMal}/${currentEp}/sub?_t=${Date.now()}`}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                allow="autoplay; fullscreen"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="bg-white neo-border border-t-0 rounded-b-2xl neo-shadow p-3 flex justify-between items-center">
              <span className="bg-pink text-white font-bold px-3 py-1 neo-border neo-shadow-sm text-xs">MegaPlay</span>
              <span className="font-bold text-sm">Episode {currentEp}</span>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video bg-black neo-border rounded-2xl neo-shadow flex flex-col items-center justify-center text-white">
            <Play size={48} className="opacity-50 mb-2" />
            <p className="font-anton text-xl">Pilih episode di bawah</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <img src={anime.coverImage.extraLarge} alt="Poster" className="w-full rounded-2xl neo-border neo-shadow-lg" />
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="neo-card p-5">
            <h2 className="font-anton text-xl mb-2">Sinopsis</h2>
            <p className="text-sm text-gray-700 font-medium leading-relaxed line-clamp-6" dangerouslySetInnerHTML={{__html: anime.description || 'Belum ada sinopsis.'}} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="neo-card p-4 flex flex-col items-center justify-center text-center">
              <Star size={24} className="fill-yellow mb-1" />
              <span className="font-anton text-2xl">{anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}</span>
              <span className="text-xs font-bold text-gray-500">RATING</span>
            </div>
            <div className="neo-card p-4 flex flex-col items-center justify-center text-center">
              <Info size={24} className="mb-1" />
              <span className="font-anton text-lg">{anime.status}</span>
              <span className="text-xs font-bold text-gray-500 uppercase">STATUS</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-anton text-xl md:text-2xl uppercase mb-4 flex items-center gap-2">
          <List size={24} /> Daftar Episode ({anime.episodes || '?'})
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {Array.from({ length: anime.episodes || 12 }).map((_, i) => {
            const ep = i + 1;
            return (
              <button
                key={ep}
                onClick={() => { setCurrentEp(ep); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`neo-btn py-3 px-2 flex items-center justify-center text-lg ${currentEp === ep ? 'bg-yellow' : 'bg-white'}`}
              >
                {ep}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
          }
