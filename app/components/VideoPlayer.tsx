"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Maximize, Settings, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  url: string;
}

interface QualityLevel {
  height: number;
  index: number;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<QualityLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hlsRef.current = hls; // Simpan instance
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const availableLevels = hls.levels.map((level, index) => ({
          height: level.height,
          index: index,
        }));
        setLevels(availableLevels.sort((a, b) => b.height - a.height));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [url]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changeQuality = (index: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = index;
      setCurrentLevel(index);
    }
    setShowQualityMenu(false);
  };

  return (
    <div className="relative w-full aspect-video bg-black border-[3px] border-neo-text rounded-2xl shadow-[6px_6px_0px_0px_#111] overflow-hidden group">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="text-white hover:text-neo-yellow transition-colors">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={toggleMute} className="text-white hover:text-neo-yellow transition-colors">
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button 
              onClick={() => setShowQualityMenu(!showQualityMenu)} 
              className="flex items-center gap-1 text-white hover:text-neo-yellow transition-colors font-bold text-sm"
            >
              <Settings size={18} /> 
              {currentLevel === -1 ? "Auto" : `${levels.find(l => l.index === currentLevel)?.height}p`}
            </button>

            {showQualityMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border-[3px] border-neo-text rounded-xl shadow-[4px_4px_0px_0px_#111] overflow-hidden flex flex-col min-w-[100px] z-50">
                <button 
                  onClick={() => changeQuality(-1)}
                  className={`px-4 py-2 text-sm font-bold text-left hover:bg-gray-200 transition-colors ${currentLevel === -1 ? 'bg-neo-yellow text-black' : 'text-black'}`}
                >
                  Auto
                </button>
                {levels.map((level) => (
                  <button
                    key={level.index}
                    onClick={() => changeQuality(level.index)}
                    className={`px-4 py-2 text-sm font-bold text-left hover:bg-gray-200 transition-colors ${currentLevel === level.index ? 'bg-neo-yellow text-black' : 'text-black'}`}
                  >
                    {level.height}p
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => videoRef.current?.requestFullscreen()} className="text-white hover:text-neo-yellow transition-colors">
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
