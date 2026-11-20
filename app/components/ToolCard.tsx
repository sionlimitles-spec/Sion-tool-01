"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ToolCard({ title, description, badge, href, icon, index }: any) {
  
  const handleTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
  };

  return (
    <div 
      className="neo-card p-4 flex flex-col h-full bg-white animate-stagger"
      style={{ animationDelay: `${index * 50}ms` }} // Stagger effect
    >
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 md:w-12 md:h-12 border-[2px] border-neo-text flex items-center justify-center bg-gray-50 rounded-xl">
          {icon}
        </div>
        <span className="border-[2px] border-neo-text px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-white">
          {badge}
        </span>
      </div>
      
      <h3 className="font-archivo font-extrabold text-sm md:text-base leading-tight mb-1 text-black">
        {title}
      </h3>
      <p className="text-[10px] md:text-xs text-gray-700 flex-grow mb-3 leading-relaxed line-clamp-2 font-medium">
        {description}
      </p>
      
      {/* Badge Kepercayaan */}
      <div className="mb-3 flex items-center gap-1 text-[9px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md border border-green-300 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Diproses di perangkatmu
      </div>

      <Link 
        href={href} 
        onClick={handleTap}
        className="neo-button w-full py-2 text-[11px] md:text-xs mt-auto group"
      >
        Buka Alat 
        <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-active:translate-x-1 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
