"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Play, Info, Loader2 } from "lucide-react";
import "../../anime/anime.css"; // Import CSS

export default function AnimeDetail() {
  const params = useParams();
  const router = useRouter();
  const [anime, setAnime] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEp, setCurrentEp] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      const query = `query($id: Int) { Media(id: $id, type: ANIME) { id idMal title { romaji english } coverImage { extraLarge } bannerImage description averageScore status episodes } }`;
      try {
        const res = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { id: Number(params.id) } }) });
        const data = await res.json();
        if (data.data) {
          setAnime(data.data.Media);
          if (data.data.Media.episodes > 0) setCurrentEp(1);
        }
      } finally { setIsLoading(false); }
    }
    if (params.id) fetchDetail();
  }, [params.id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F0EDE5]"><Loader2 className="animate-spin" size={48} /></div>;
  if (!anime) return <div className="min-h-screen flex items-center justify-center bg-[#F0EDE5]"><h1 className="zine-font text-4xl">ANIME TIDAK DITEMUKAN</h1></div>;

  return (
    <div className="anime-page-wrapper pb-20">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/anime')} className="ks-btn bg-white"><ArrowLeft size={20}/></button>
          <h1 className="zine-font text-3xl uppercase truncate">{anime.title.english || anime.title.romaji}</h1>
        </div>

        {/* Player */}
        <div className="mb-10">
          <h2 className="zine-font text-2xl mb-4 flex items-center gap-2"><Play size={24}/> EPISODE {currentEp}</h2>
          {currentEp && anime.idMal ? (
            <div className="border-[4px] border-black shadow-[8px_8px_0_#0A0A0A] rounded-xl overflow-hidden bg-black">
              <iframe
                key={currentEp}
                src={`https://megaplay.buzz/stream/mal/${anime.idMal}/${currentEp}/sub?_t=${Date.now()}`}
                className="w-full aspect-video"
                allowFullScreen
                allow="autoplay; fullscreen"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-gray-900 border-[4px] border-black rounded-xl flex items-center justify-center text-white zine-font text-2xl">PILIH EPISODE DI BAWAH</div>
          )}
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <img src={anime.coverImage.extraLarge} className="w-full border-[3px] border-black shadow-[6px_6px_0_#FFE500] rounded-xl" alt="" />
          </div>
          <div className="md:col-span-3">
            <div className="border-[3px] border-black bg-white p-6 rounded-xl shadow-[4px_4px_0_#0A0A0A]">
              <h2 className="zine-font text-2xl mb-3">SINOPSIS</h2>
              <p className="text-sm font-medium leading-relaxed line-clamp-5" dangerouslySetInnerHTML={{__html: anime.description || '-'}} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border-[3px] border-black bg-white p-4 rounded-xl shadow-[4px_4px_0_#0A0A0A] text-center flex flex-col items-center">
                <Star size={28} className="fill-yellow-400 mb-1"/> <span className="zine-font text-2xl">{anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}</span>
              </div>
              <div className="border-[3px] border-black bg-white p-4 rounded-xl shadow-[4px_4px_0_#0A0A0A] text-center flex flex-col items-center">
                <Info size={28} className="mb-1"/> <span className="zine-font text-xl uppercase">{anime.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Episodes */}
        <h2 className="zine-font text-2xl mb-4">DAFTAR EPISODE</h2>
        <div className="ks-ep-grid">
          {Array.from({ length: anime.episodes || 12 }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => { setCurrentEp(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`ks-tile ${currentEp === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
