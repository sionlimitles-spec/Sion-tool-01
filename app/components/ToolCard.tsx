import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ToolCard({ title, description, badge, href, icon, colorTheme }: any) {
  return (
    <div className="neo-card p-4 md:p-5 flex flex-col h-full bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 md:w-12 md:h-12 border-[2px] border-neo-text flex items-center justify-center rounded-xl text-white ${colorTheme.iconBg}`}>
          {icon}
        </div>
        <span className={`border-[2px] border-neo-text px-2 py-1 text-[10px] md:text-xs font-bold uppercase rounded-lg text-black ${colorTheme.badgeBg}`}>
          {badge}
        </span>
      </div>
      <h3 className="font-archivo font-extrabold text-base md:text-lg leading-tight mb-2 text-black">{title}</h3>
      <p className="text-xs md:text-sm text-gray-600 flex-grow mb-5 line-clamp-3 leading-relaxed">{description}</p>
      <Link href={href} className={`neo-button w-full py-2 md:py-2.5 text-xs md:text-sm mt-auto ${colorTheme.buttonBg}`}>
        Buka <ArrowRight size={16} />
      </Link>
    </div>
  );
}
