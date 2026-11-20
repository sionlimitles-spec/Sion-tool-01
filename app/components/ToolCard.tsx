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
    <div className="neo-card p-4 md:p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        {/* Ikon kotak putih bergaris tepi */}
        <div className="w-10 h-10 border-[2px] border-neo-text flex items-center justify-center bg-white rounded-lg">
          {icon}
        </div>
        {/* Badge berbentuk kapsul (pill) */}
        <span className="border-[2px] border-neo-text px-3 py-0.5 text-[10px] md:text-xs font-bold uppercase rounded-full bg-white text-black tracking-wider">
          {badge}
        </span>
      </div>
      
      <h3 className="font-archivo font-extrabold text-base md:text-lg leading-tight mb-1.5 text-black">
        {title}
      </h3>
      <p className="text-[11px] md:text-xs text-gray-600 flex-grow mb-5 leading-relaxed line-clamp-2">
        {description}
      </p>
      
      {/* Tombol Hitam dengan Ikon Panah */}
      <Link href={href} className="neo-button w-full py-2 text-[11px] md:text-sm mt-auto">
        Buka Alat <ArrowRight size={16} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
