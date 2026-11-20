import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  badge: string;
  href: string;
  icon: React.ReactNode;
}

export default function ToolCard({ title, description, badge, href, icon }: ToolCardProps) {
  return (
    <div className="neo-card p-4 flex flex-col h-full bg-white">
      <div className="flex justify-between items-start mb-4">
        {/* Kotak Ikon lebih besar & ikon di tengah */}
        <div className="w-11 h-11 md:w-12 md:h-12 border-[2px] border-neo-text flex items-center justify-center bg-gray-50 rounded-xl shadow-[2px_2px_0px_0px_#111]">
          {icon}
        </div>
        <span className="border-[2px] border-neo-text px-2.5 py-1 text-[9px] md:text-[10px] font-extrabold uppercase rounded-full bg-white tracking-wider">
          {badge}
        </span>
      </div>
      
      <h3 className="font-archivo font-extrabold text-sm md:text-base leading-tight mb-2 text-black">
        {title}
      </h3>
      <p className="text-[10px] md:text-xs text-gray-500 flex-grow mb-4 leading-relaxed line-clamp-2">
        {description}
      </p>
      
      <Link href={href} className="neo-button w-full py-2 md:py-2.5 text-[11px] md:text-xs mt-auto">
        Buka Alat <ArrowRight size={16} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
