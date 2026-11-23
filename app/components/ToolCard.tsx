import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ToolCard({ title, description, badge, href, icon, badgeColor }: any) {
  return (
    <Link href={href} className="neo-card p-5 flex flex-col h-full group bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 neo-border rounded-lg flex items-center justify-center bg-cyan shadow-[2px_2px_0px_0px_#0A0A0A] group-hover:bg-yellow transition-colors">
          {icon}
        </div>
        <span className={`px-2 py-1 text-[10px] font-extrabold uppercase neo-border rounded-md neo-shadow-sm ${badgeColor}`}>
          {badge}
        </span>
      </div>
      
      <h3 className="font-anton text-xl md:text-2xl uppercase tracking-wide mb-2 leading-tight">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-gray-600 font-bold flex-grow mb-6 line-clamp-2">
        {description}
      </p>
      
      <div className="neo-btn w-full flex items-center justify-center gap-2 mt-auto bg-ink text-yellow">
        Buka Alat <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
