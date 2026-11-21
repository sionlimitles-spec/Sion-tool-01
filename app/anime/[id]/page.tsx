"use client";

import Link from "next/link";
import { ArrowLeft, Star, Loader2, AlertCircle, Play, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VideoPlayer from "../../components/VideoPlayer";

const BASE_URL = "https://sion-stream-api01.onrender.com";
const ANIVEXA_PATH = "/anime/anivexa"; // Path yang benar sesuai dokumentasi

const fetchWithTimeout = async (url: string, options: any = {}) => {
  const { timeout = 15000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export default function AnimeDetail() {
  const params = useParams();
  const id = params.id as string;

  const [anime, setAnime] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [anilistId, setAnilistId] = useState<number | null>(null);
  const [providerEpisodes, setProviderEpisodes] = useState<any[]>([]);
  const [activeProvider, setActiveProvider] = useState<string>("");
  
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [currentEp, setCurrentEp] = useState<number | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        setDebugInfo("Mengambil data anime dari Tenrai...");

        const res = await fetchWithTimeout(`https://api.tenrai.org/v4/anime/${id}/full`, { timeout: 10000 });
        if (!res.ok) throw new Error("Gagal mengambil detail anime dari database.");
        const data = await res.json();

        if (!isMounted) return;
        setAnime(data.data);
        setDebugInfo("Mencari AniList ID...");

        // Cari AniList ID
        const anilistQuery = `
          query ($search: String) {
            Media (search: $search, type: ANIME) {
              id
            }
          }
        `;
        const anilistRes = await fetchWithTimeout("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: anilistQuery, variables: { search: data.data.title } }),
          timeout: 8000
        });
        const anilistData = await anilistRes.json();
        
        if (isMounted && anilistData.data?.Media?.id) {
          const aId = anilistData.data.Media.id;
          setAnilistId(aId);
          setDebugInfo(`AniList ID ditemukan: ${aId}. Mengambil episode...`);

          // Panggil endpoint yang BENAR: /anime/anivexa/episodes/:anilistId
          const episodesUrl = `${BASE_URL}${ANIVEXA_PATH}/episodes/${aId}`;
          console.log("Fetching episodes from:", episodesUrl); // Untuk debugging di console browser

          try {
            const episodesRes = await fetchWithTimeout(episodesUrl, { timeout: 20000 });
            
            if (!episodesRes.ok) {
              throw new Error(`HTTP Error ${episodesRes.status}: ${episodesRes.statusText}`);
            }
            
            const episodesData = await episodesRes.json();
            
            // Cari provider yang punya episode sub
            const providersToTry = ["reanime", "anikoto", "mkissa", "kaa", "animegg"];
            let foundEpisodes: any[] = [];
            let foundProvider = "";

            for (const p of providersToTry) {
              if (episodesData[p]?.episodes?.sub?.length > 0) {
                foundEpisodes = episodesData[p].episodes.sub;
                foundProvider = p;
                break;
              }
            }

            if (isMounted) {
              if (foundEpisodes.length > 0) {
                setProviderEpisodes(foundEpisodes);
                setActiveProvider(foundProvider);
                setDebugInfo(`Ditemukan ${foundEpisodes.length} episode dari ${foundProvider}.`);
              } else {
                setDebugInfo("API merespons, tetapi tidak ada episode yang tersedia di semua provider.");
                console.warn("Respons API:", episodesData);
              }
            }
          } catch (streamErr: any) {
            if (isMounted) setDebugInfo(`Gagal mengambil episode: ${streamErr.message}. Server mungkin sedang tidur.`);
          }
        } else {
          if (isMounted) setDebugInfo("Gagal menemukan AniList ID untuk anime ini.");
        }

      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (id) fetchData();

    return () => { isMounted = false; };
  }, [id]);

  const handlePlayEpisode = async (episode: any) => {
    if (!anilistId || !activeProvider) return;
    
    setIsStreamLoading(true);
    setStreamError(null);
    setCurrentEp(episode.number);

    try {
      // Endpoint watch: /anime/anivexa/watch/:provider/:anilistId/:audio/:provider-:episode
      const watchUrl = `${BASE_URL}${ANIVEXA_PATH}/watch/${activeProvider}/${anilistId}/sub/${activeProvider}-${episode.number}`;
      console.log("Fetching stream from:", watchUrl);

      const watchRes = await fetchWithTimeout(watchUrl, { timeout: 20000 });
      if (!watchRes.ok) throw new Error("Gagal mengambil link video.");
      
      const watchData = await watchRes.json();
      const streamUrl = watchData.proxiedUrl || watchData.url;

      if (streamUrl) {
        setActiveVideoUrl(streamUrl);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error("Link video tidak ditemukan di respons server.");
      }
    } catch (err: any) {
      setStreamError(`Gagal memuat Episode ${episode.number}. Server mungkin sedang sibuk.`);
    } finally {
      setIsStreamLoading(false);
    }
  };

  // Tampilan Loading
  if (isLoading) return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <Loader2 className="w-12 h-12 animate-spin mb-4 text-neo-text" />
      <p className="font-archivo font-bold text-lg">Memuat detail anime...</p>
      <p className="text-xs text-gray-500 mt-2 text-center">{debugInfo}</p>
    </main>
  );

  // Tampilan Error
  if (error || !anime) return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <AlertCircle className="w-16 h-16 text-neo-pink mb-4" />
      <h2 className="font-archivo font-extrabold text-2xl mb-2 text-center">Anime Tidak Ditemukan</h2>
      <p className="text-gray-600 font-bold mb-4 text-center">{error}</p>
      <Link href="/anime" className="neo-button bg-neo-yellow text-black px-6 py-2 mt-4">Kembali</Link>
    </main>
  );

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col min-h-screen">
      {/* Header & Konten lainnya tetap sama seperti sebelumnya */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/anime" className="bg-white border-[3px] border-neo-text p-2 rounded-xl shadow-[3px_3px_0px_0px_#111] active:translate-y-[3px] active:shadow-none transition-all">
          <ArrowLeft size={20} strokeWidth={3} />
        </Link>
        <h1 className="font-archivo font-extrabold text-xl md:text-2xl uppercase tracking-tighter line-clamp-1">
          {anime.title}
        </h1>
      </div>

      {/* Video Player Section (Tetap sama) */}
      <div className="mb-8">
        <h2 className="font-archivo font-extrabold text-xl md:text-2xl uppercase mb-3 flex items-center gap-2">
          <Play className="fill-black" size={24} /> 
          {currentEp ? `Episode ${currentEp}` : "Pilih Episode"}
        </h2>
        
        {isStreamLoading ? (
          <div className="w-full aspect-video bg-black border-[3px] border-neo-text rounded-2xl shadow-[6px_6px_0px_0px_#111] flex flex-col items-center justify-center text-white">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-neo-yellow" />
            <p className="font-archivo font-bold">Menghubungkan ke server...</p>
          </div>
        ) : streamError ? (
          <div className="w-full aspect-video bg-gray-100 border-[3px] border-neo-text rounded-2xl shadow-[6px_6px_0px_0px_#111] flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-12 h-12 text-neo-pink mb-4" />
            <p className="font-bold text-gray-800 mb-4">{streamError}</p>
            <button onClick={() => handlePlayEpisode({ number: currentEp })} className="neo-button bg-neo-yellow text-black px-6 py-2 flex items-center gap-2">
              <RefreshCw size={16} /> Coba Lagi
            </button>
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

      {/* Info Anime (Tetap sama) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <img src={anime.images?.jpg?.large_image_url} alt={anime.title} className="w-full border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] object-cover aspect-[3/4]" />
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-white border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] p-5">
            <h2 className="font-archivo font-extrabold text-xl mb-2">Sinopsis</h2>
            <p className="text-sm text-gray-700 leading-relaxed font-medium line-clamp-6">{anime.synopsis || "Belum ada sinopsis."}</p>
          </div>
          <div className="bg-white border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] p-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Rating</span>
              <div className="flex items-center gap-1"><Star size={14} className="fill-neo-yellow text-neo-text" /><span className="font-extrabold">{anime.score || "N/A"}</span></div>
            </div>
            <div>
              <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Status</span>
              <span className="font-extrabold">{anime.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Episode (Dengan Info Debug) */}
      <div>
        <h2 className="font-archivo font-extrabold text-xl md:text-2xl uppercase mb-3 flex items-center justify-between">
          Daftar Episode
          {activeProvider && <span className="text-xs bg-neo-green text-white px-2 py-1 rounded-md border-[2px] border-black">Source: {activeProvider}</span>}
        </h2>
        
        {providerEpisodes.length > 0 ? (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {providerEpisodes.map((ep) => (
              <button key={ep.number} onClick={() => handlePlayEpisode(ep)} className={`border-[3px] border-neo-text rounded-xl py-3 font-extrabold text-sm shadow-[3px_3px_0px_0px_#111] hover:-translate-y-1 active:translate-y-[3px] active:shadow-none transition-all ${currentEp === ep.number ? 'bg-neo-yellow text-black' : 'bg-white text-black hover:bg-gray-100'}`}>
                Ep {ep.number}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white border-[3px] border-dashed border-gray-400 rounded-xl p-6 text-center">
            <p className="font-bold text-gray-500 mb-2">Episode belum tersedia.</p>
            <p className="text-xs text-gray-500 mb-4">{debugInfo}</p>
            <a href={`${BASE_URL}${ANIVEXA_PATH}/episodes/${anilistId || ''}`} target="_blank" rel="noreferrer" className="neo-button bg-neo-yellow text-black px-4 py-2 text-xs inline-flex items-center gap-2">
              <RefreshCw size={14} /> Buka API & Coba Lagi
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
