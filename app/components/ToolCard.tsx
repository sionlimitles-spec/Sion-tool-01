"use client";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { blip, vibrate } from "../lib/sound";

export interface Tool { title: string; description: string; badge: string; category: string; href: string; icon: React.ReactNode; accent?: string }

export default function ToolCard({ title, description, badge, href, icon, index, accent = "#FFE500" }: Tool & { index: number }) {
  const soon = href === "#";
  return (
    <div className="neo-card p-4 flex flex-col h-full animate-stagger" style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}>
      <div className="flex justify-between items-start mb-3">
        <div className="w-11 h-11 md:w-12 md:h-12 border-2 border-neo-text flex items-center justify-center rounded-xl shadow-[2px_2px_0_#0A0A0A]" style={{ background: accent }}>
          {icon}
        </div>
        <span className="border-2 border-neo-text px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-white">{badge}</span>
      </div>
      <h3 className="font-display uppercase tracking-wide text-base md:text-lg leading-tight mb-1">{title}</h3>
      <p className="text-[11px] md:text-xs text-gray-700 flex-grow mb-3 leading-relaxed line-clamp-2 font-medium">{description}</p>
      <div className="mb-3 flex items-center gap-1 text-[9px] font-bold text-green-800 bg-green-100 px-2 py-1 rounded-md border border-green-300 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Gratis &amp; tanpa iklan
      </div>
      {soon ? (
        <button type="button" disabled className="neo-button w-full py-2 text-[11px] md:text-xs mt-auto"><Clock size={14} /> Segera hadir</button>
      ) : (
        <Link href={href} onClick={() => { vibrate(); blip(); }} className="neo-button w-full py-2 text-[11px] md:text-xs mt-auto group">
          Buka Alat <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
