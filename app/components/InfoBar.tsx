"use client";
import { useEffect, useState } from "react";
import { Globe, Smartphone, Clock, Monitor, Battery, BatteryCharging, Wifi } from "lucide-react";

export default function InfoBar() {
  const [time, setTime] = useState<string>("");
  const [device, setDevice] = useState({ os: "Memuat...", browser: "Memuat..." });
  const [battery, setBattery] = useState({ level: -1, charging: false });

  useEffect(() => {
    // 1. Logika Jam
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("id-ID", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // 2. Logika Deteksi Perangkat
    const userAgent = navigator.userAgent;
    let os = "Unknown";
    if (userAgent.indexOf("Win") !== -1) os = "Windows";
    if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
    if (userAgent.indexOf("Linux") !== -1) os = "Linux";
    if (userAgent.indexOf("Android") !== -1) os = "Android";
    if (userAgent.indexOf("like Mac") !== -1) os = "iOS";

    let browser = "Browser";
    if (userAgent.indexOf("Chrome") !== -1) browser = "Chrome";
    if (userAgent.indexOf("Safari") !== -1 && userAgent.indexOf("Chrome") === -1) browser = "Safari";
    if (userAgent.indexOf("Firefox") !== -1) browser = "Firefox";
    if (userAgent.indexOf("Edge") !== -1) browser = "Edge";

    setDevice({ os, browser });

    // 3. Logika Baterai Real-time
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        const updateBattery = () => {
          setBattery({
            level: Math.round(batt.level * 100),
            charging: batt.charging
          });
        };
        updateBattery();
        // Pantau perubahan baterai secara live
        batt.addEventListener('levelchange', updateBattery);
        batt.addEventListener('chargingchange', updateBattery);
      });
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] p-3 md:p-4 mb-6 flex flex-row items-center gap-4">
      
      <div className="w-12 h-12 md:w-16 md:h-16 border-[3px] border-neo-text rounded-xl bg-gray-200 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#111]">
        <span className="font-archivo font-extrabold text-xl md:text-2xl">S</span>
      </div>

      <div className="flex flex-col flex-grow text-left">
        <h2 className="font-archivo font-extrabold text-sm md:text-lg uppercase mb-1.5">
          Sion Developer
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-1 text-[10px] md:text-xs font-bold text-gray-600">
          <div className="flex items-center gap-1.5"><Globe size={12} className="md:w-3.5 md:h-3.5" /> Indonesia</div>
          <div className="flex items-center gap-1.5"><Clock size={12} className="md:w-3.5 md:h-3.5" /> {time || "--:--"}</div>
          <div className="flex items-center gap-1.5"><Smartphone size={12} className="md:w-3.5 md:h-3.5" /> {device.os}</div>
          <div className="flex items-center gap-1.5"><Monitor size={12} className="md:w-3.5 md:h-3.5" /> {device.browser}</div>
          
          {/* Baterai Live */}
          <div className="flex items-center gap-1.5 text-black">
            {battery.charging ? <BatteryCharging size={14} className="text-green-500" /> : <Battery size={14} />} 
            {battery.level !== -1 ? `${battery.level}%` : 'N/A'}
          </div>

          <div className="flex items-center gap-1.5 text-green-600"><Wifi size={12} className="md:w-3.5 md:h-3.5" /> Online</div>
        </div>
      </div>

    </div>
  );
}
