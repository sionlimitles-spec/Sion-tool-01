"use client";

import Link from "next/link";
import { ArrowLeft, Star, Loader2, AlertCircle, Play, Calendar, Clock } from "lucide-react";
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
  
  // State untuk video yang sedang diputar (URL Dummy HLS untuk testing)
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");

  useEffect(() => {
    let isMounted = true;

    async function fetchDetail() {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Ambil detail anime
        const res = await fetch(`https://api.tenrai.org/v4/anime/${id}/full`);
        if (!res.ok) throw new Error("Gagal mengambil detail anime");
        const data = await res.json();

        if (!isMounted) return;
        setAnime(data.data);

        // Jeda 1 detik untuk rate limit (3 req/detik)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 2. Ambil daftar episode
        const epRes = await fetch(`https://api.tenrai.org/v4/anime/${id}/episodes`);
        if (epRes.ok) {
          const epData = await epRes.json();
          if (isMounted) setEpisodes(epData.data || []);
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

  // Tampilan Loading
  if (isLoading) return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <p className="font-archivo font-bold text-lg">Memuat detail anime...</p>
    </main>
  );

  // Tampilan Error
  if (error || !anime) return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <AlertCircle className="w-16 h-16 text-neo-pink mb-4" />
      <h2 className="font-archivo font-extrabold text-2xl mb-2">Anime Tidak Ditemukan</h2>
      <p className="text-gray-600 font-bold mb-4">{error || "Data tidak tersedia."}</p>
      <Link href="/anime" className="neo-button bg-neo-yellow text-black px-6 py-2 mt-4">Kembali ke Beranda Anime</Link>
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

      {/* Video Player Section (Dipindah ke atas biar langsung bisa nonton) */}
      <div className="mb-8">
        <h2 className="font-archivo font-extrabold text-xl md:text-2xl uppercase mb-3 flex items-center gap-2">
          <Play className="fill-black" size={24} /> Tonton Sekarang
        </h2>
        {activeVideoUrl ? (
          <VideoPlayer url={activeVideoUrl} />
        ) : (
          <div className="w-full aspect-video bg-gray-200 border-[3px] border-neo-text rounded-2xl shadow-[6px_6px_0px_0px_#111] flex items-center justify-center">
            <p className="font-bold text-gray-500">Server streaming belum tersedia.</p>
          </div>
        )}
        <p className="text-xs text-gray-500 font-bold mt-2">
          *Catatan: Video di atas adalah URL Dummy (Testing). Server anime asli akan dihubungkan di tahap selanjutnya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Poster & Info Kiri */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <img 
            src={anime.images?.jpg?.large_image_url} 
            alt={anime.title} 
            className="w-full border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] object-cover aspect-[3/4]"
          />
          
          <div className="bg-white border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b-[2px] border-gray-200 pb-2">
              <span className="font-bold text-xs uppercase text-gray-500">Status</span>
              <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase border-[2px] border-neo-text rounded-md ${anime.status === 'Currently Airing' ? 'bg-neo-green text-white' : 'bg-neo-blue text-white'}`}>
                {anime.status === 'Currently Airing' ? 'Ongoing' : 'Completed'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b-[2px] border-gray-200 pb-2">
              <span className="font-bold text-xs uppercase text-gray-500">Rating</span>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-neo-yellow text-neo-text" />
                <span className="font-extrabold text-sm">{anime.score || "N/A"}</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-b-[2px] border-gray-200 pb-2">
              <span className="font-bold text-xs uppercase text-gray-500">Tipe</span>
              <span className="font-extrabold text-sm">{anime.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-gray-500">Episode</span>
              <span className="font-extrabold text-sm">{anime.episodes || "?"}</span>
            </div>
          </div>
        </div>

        {/* Detail Kanan */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-white border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] p-5">
            <h2 className="font-archivo font-extrabold text-xl mb-2">Sinopsis</h2>
            <p className="text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-line">
              {anime.synopsis || "Belum ada sinopsis untuk anime ini."}
            </p>
          </div>

          <div className="bg-white border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] p-5">
            <h2 className="font-archivo font-extrabold text-xl mb-3">Informasi Tambahan</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Studio</span>
                <span className="font-extrabold">{anime.studios?.map((s:any) => s.name).join(", ") || "-"}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Musim</span>
                <span className="font-extrabold capitalize">{anime.season || "-"} {anime.year || ""}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Genre</span>
                <span className="font-extrabold">{anime.genres?.map((g:any) => g.name).join(", ") || "-"}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Durasi</span>
                <span className="font-extrabold">{anime.duration || "-"}</span>
              </div>
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
                onClick={() => {
                  // Nanti diubah untuk mengambil link streaming asli berdasarkan ID Episode
                  setActiveVideoUrl("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");
                  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke atas ke player
                }}
                className="bg-white border-[3px] border-neo-text rounded-xl py-3 font-extrabold text-sm shadow-[3px_3px_0px_0px_#111] hover:bg-neo-yellow hover:-translate-y-1 active:translate-y-[3px] active:shadow-none transition-all"
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
