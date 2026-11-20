"use client";
import { useEffect, useState } from "react";
// Ganti 'Chrome' menjadi 'Monitor' karena ikon brand sudah dihapus dari Lucide
import { Globe, Smartphone, Clock, Monitor, Battery, Wifi } from "lucide-react";

export default function InfoBar() {
  const [time, setTime] = useState<string>("");

  // Logika untuk Jam Real-time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("id-ID", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] p-4 md:p-5 mb-8 flex flex-col md:flex-row items-center gap-4 md:gap-8">
      
      {/* Avatar Placeholder */}
      <div className="w-16 h-16 border-[3px] border-neo-text rounded-xl bg-gray-200 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#111]">
        <span className="font-archivo font-bold text-xl">S</span>
      </div>

      {/* Judul & Info */}
      <div className="flex flex-col flex-grow text-center md:text-left">
        <h2 className="font-archivo font-extrabold text-lg md:text-xl uppercase mb-1">
          Sion Developer Tool
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs md:text-sm font-bold text-gray-600">
          <div className="flex items-center gap-1.5"><Globe size={14} /> Indonesia</div>
          <div className="flex items-center gap-1.5"><Clock size={14} /> {time || "Memuat..."}</div>
          <div className="flex items-center gap-1.5"><Smartphone size={14} /> Android</div>
          {/* Menggunakan Monitor sebagai pengganti Chrome */}
          <div className="flex items-center gap-1.5"><Monitor size={14} /> Browser</div>
          <div className="flex items-center gap-1.5"><Battery size={14} /> 96%</div>
          <div className="flex items-center gap-1.5 text-green-600"><Wifi size={14} /> Online</div>
        </div>
      </div>

    </div>
  );
}
