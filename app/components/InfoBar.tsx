"use client";
import { useEffect, useState } from "react";
import { Globe, Smartphone, Clock, Monitor, Battery, BatteryCharging, Download } from "lucide-react";
import Logo from "./Logo"; // IMPORT LOGO

export default function InfoBar() {
  const [time, setTime] = useState<string>("");
  const [device, setDevice] = useState({ os: "Memuat...", browser: "Memuat..." });
  const [battery, setBattery] = useState({ level: -1, charging: false });

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString("id-ID", { hour12: false }));
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const ua = navigator.userAgent;
    let os = "Unknown"; if (ua.indexOf("Win") !== -1) os = "Windows"; if (ua.indexOf("Mac") !== -1) os = "MacOS"; if (ua.indexOf("Linux") !== -1) os = "Linux"; if (ua.indexOf("Android") !== -1) os = "Android"; if (ua.indexOf("like Mac") !== -1) os = "iOS";
    let browser = "Browser"; if (ua.indexOf("Chrome") !== -1) browser = "Chrome"; if (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1) browser = "Safari"; if (ua.indexOf("Firefox") !== -1) browser = "Firefox"; if (ua.indexOf("Edge") !== -1) browser = "Edge";
    setDevice({ os, browser });

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        const updateBatt = () => setBattery({ level: Math.round(batt.level * 100), charging: batt.charging });
        updateBatt();
        batt.addEventListener('levelchange', updateBatt);
        batt.addEventListener('chargingchange', updateBatt);
      });
    }
    return () => clearInterval(interval);
  }, []);

  const handlePWA = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    alert("Fitur Install PWA akan segera hadir!");
  };

  return (
    <div className="bg-white border-[3px] border-neo-text rounded-2xl shadow-[4px_4px_0px_0px_#111] p-3 md:p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-row items-center gap-4 w-full md:w-auto">
        {/* AVATAR LOGO BARU */}
        <div className="w-12 h-12 border-[3px] border-neo-text rounded-xl bg-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#111]">
          <Logo className="w-8 h-8 text-white" />
        </div>
        <div className="flex flex-col text-left">
          <h2 className="font-archivo font-extrabold text-sm md:text-base uppercase mb-1">Sion Dev</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1 text-[10px] font-bold text-gray-700">
            <div className="flex items-center gap-1"><Globe size={12} /> Indonesia</div>
            <div className="flex items-center gap-1"><Clock size={12} /> {time || "--:--"}</div>
            <div className="flex items-center gap-1"><Smartphone size={12} /> {device.os}</div>
            <div className="flex items-center gap-1"><Monitor size={12} /> {device.browser}</div>
            <div className="flex items-center gap-1">
              {battery.charging ? <BatteryCharging size={12} className="text-green-500" /> : <Battery size={12} />} 
              {battery.level !== -1 ? `${battery.level}%` : 'N/A'}
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500 online-dot"></div> Online
            </div>
          </div>
        </div>
      </div>
      
      <button onClick={handlePWA} className="neo-button w-full md:w-auto px-4 py-2 text-xs whitespace-nowrap">
        <Download size={14} /> Install App
      </button>
    </div>
  );
}
