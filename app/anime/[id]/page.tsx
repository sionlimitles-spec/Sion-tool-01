"use client";

import Link from "next/link";
import { ArrowLeft, Star, Loader2, AlertCircle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VideoPlayer from "../../components/VideoPlayer";

export default function AnimeDetail() {
  const params = useParams();
  const id = params.id as string;

  const [anime, setAnime] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk Streaming
  const [anilistId, setAnilistId] = useState<number | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [currentEp, setCurrentEp] = useState<number | null>(null);

  // 1. Ambil Detail Anime dari Tenrai (MAL ID)
  useEffect(() => {
    let isMounted = true;

    async function fetchDetail() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`https://api.tenrai.org/v4/anime/${id}/full`);
        if (!res.ok) throw new Error("Gagal mengambil detail anime");
        const data = await res.json();

        if (!isMounted) return;
        setAnime(data.data);

        // Jeda 1 detik untuk rate limit
        await new Promise(resolve => setTimeout(resolve, 1000));

        const epRes = await fetch(`https://api.tenrai.org/v4/anime/${id}/episodes`);
        if (epRes.ok) {
          const epData = await epRes.json();
          if (isMounted) setEpisodes(epData.data || []);
        }

        // 2. Cari AniList ID berdasarkan judul
        const anilistQuery = `
          query ($search: String) {
            Media (search: $search, type: ANIME) {
              id
            }
          }
        `;
        const anilistRes = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            query: anilistQuery, 
            variables: { search: data.data.title } 
          }),
        });
        const anilistData = await anilistRes.json();
        
        if (isMounted && anilistData.data?.Media?.id) {
          setAnilistId(anilistData.data.Media.id);
        }

      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (id) fetchDetail();

    return () => { isMounted = false; };
  }, [id]);

  // 3. Fungsi Streaming menggunakan API Render (Anivexa)
  const handlePlayEpisode = async (epNumber: number) => {
    if (!anilistId) {
      setStreamError("AniList ID tidak ditemukan untuk anime ini.");
      return;
    }
    setIsStreamLoading(true);
    setStreamError(null);
    setCurrentEp(epNumber);

    try {
      // Menggunakan provider 'reanime' yang mendukung HLS Proxy
      const provider = "reanime"; 
      
      // Ambil link stream dari API Render
      const watchRes = await fetch(`https://sion-stream-api01.onrender.com/anime/anivexa/watch/${provider}/${anilistId}/sub/${provider}-${epNumber}`);
      
      if (!watchRes.ok) throw new Error("Gagal mengambil link video dari server.");
      
      const watchData = await watchRes.json();

      // Gunakan proxiedUrl (jika ada) atau url biasa
      const streamUrl = watchData.proxiedUrl || watchData.url;

      if (streamUrl) {
        setActiveVideoUrl(streamUrl);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error("Link video tidak ditemukan dari provider.");
      }

    } catch (err: any) {
      console.error(err);
      setStreamError("Gagal memuat video. Server mungkin sedang sibuk atau episode belum tersedia.");
    } finally {
      setIsStreamLoading(false);
    }
  };

  if (isLoading) return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <p className="font-archivo font-bold text-lg">Memuat detail anime...</p>
    </main>
  );

  if (error || !anime) return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <AlertCircle className="w-16 h-16 text-neo-pink mb-4" />
      <h2 className="font-archivo font-extrabold text-2xl mb-2">Anime Tidak Ditemukan</h2>
      <p className="text-gray-600 font-bold mb-4">{error || "Data tidak tersedia."}</p>
      <Link href="/anime" className="neo-button bg-neo-yellow text-black px-6 py-2 mt-4">Kembali</Link>
    </main>
  );

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col min-h-screen">
      
      {/* Header / Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/anime" className="bg-white border-[3px] border-neo-text p-2 rounded-xl shadow-[3px_3px_0px_0px_#111] active:translate-y-[3px] active:shadow-none transition-all">
          <ArrowLeft size={20} strokeWidth={3} />
        </Link>
        <h1 className="font-archivo font-extrabold text-xl md:text-2xl uppercase tracking-tighter line-clamp-1">
          {anime.title}
        </h1>
      </div>

      {/* Video Player Section */}
      <div className="mb-8">
        <h2 className="font-archivo font-extrabold text-xl md:text-2xl uppercase mb-3 flex items-center gap-2">
          <Play className="fill-black" size={24} /> 
          {currentEp ? `Episode ${currentEp}` : "Pilih Episode"}
        </h2>
        
        {isStreamLoading ? (
          <div className="w-full aspect-video bg-black border-[3px] border-neo-text rounded-2xl shadow-[6px_6px_0px_0px_#111] flex flex-col items-center justify-center text-white">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-neo-yellow" />
            <p className="font-archivo font-bold">Mencari server terbaik...</p>
            <p className="text-xs text-gray-400 mt-1">(Render gratis mungkin butuh 30 detik untuk bangun)</p>
          </div>
        ) : streamError ? (
          <div className="w-full aspect-video bg-gray-100 border-[3px] border-neo-text rounded-2xl shadow-[6px_6px_0px_0px_#111] flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-12 h-12 text-neo-pink mb-4" />
            <p className="font-bold text-gray-800 mb-4">{streamError}</p>
            <button onClick={() => handlePlayEpisode(currentEp!)} className="neo-button bg-neo-yellow text-black px-6 py-2">Coba Lagi</button>
          </div>
        ) : activeVideoUrl ? (
          <VideoPlayer url={activeVideoUrl} />
        ) : (
          <div className="w-full aspect-video bg-black border-[3px] border-neo-text rounded-2xl shadow-[6px_6px_0px_0px_#111] flex flex-col items-center justify-center text-white">
            <Play size={48} className="mb-2 opacity-50" />
            <p className="font-archivo font-bold text-lg">Silakan pilih episode di bawah</p>
          </div>
        )}
      </div>

      {/* Info Anime */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <img 
            src={anime.images?.jpg?.large_image_url} 
            alt={anime.title} 
            className="w-full border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] object-cover aspect-[3/4]"
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-white border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] p-5">
            <h2 className="font-archivo font-extrabold text-xl mb-2">Sinopsis</h2>
            <p className="text-sm text-gray-700 leading-relaxed font-medium line-clamp-6">
              {anime.synopsis || "Belum ada sinopsis."}
            </p>
          </div>
          <div className="bg-white border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] p-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Rating</span>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-neo-yellow text-neo-text" />
                <span className="font-extrabold">{anime.score || "N/A"}</span>
              </div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Status</span>
              <span className="font-extrabold">{anime.status}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Studio</span>
              <span className="font-extrabold">{anime.studios?.map((s:any) => s.name).join(", ") || "-"}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Genre</span>
              <span className="font-extrabold">{anime.genres?.map((g:any) => g.name).join(", ") || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Episode */}
      <div>
        <h2 className="font-archivo font-extrabold text-xl md:text-2xl uppercase mb-3">
          Daftar Episode
        </h2>
        {episodes.length > 0 ? (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {episodes.map((ep) => (
              <button 
                key={ep.mal_id}
                onClick={() => handlePlayEpisode(ep.mal_id)}
                className={`border-[3px] border-neo-text rounded-xl py-3 font-extrabold text-sm shadow-[3px_3px_0px_0px_#111] hover:-translate-y-1 active:translate-y-[3px] active:shadow-none transition-all ${currentEp === ep.mal_id ? 'bg-neo-yellow text-black' : 'bg-white text-black hover:bg-gray-100'}`}
              >
                Ep {ep.mal_id}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white border-[3px] border-dashed border-gray-400 rounded-xl p-6 text-center">
            <p className="font-bold text-gray-500">Daftar episode belum tersedia dari API.</p>
          </div>
        )}
      </div>

    </main>
  );
}
