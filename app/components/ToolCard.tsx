import Link from "next/link";
import { FileText, Image as ImageIcon, Play, QrCode, ArrowRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  badge: string;
  href: string;
  icon: React.ReactNode;
  badgeColor: string;
}

export default function ToolCard({ title, description, badge, href, icon, badgeColor }: ToolCardProps) {
  return (
    <div className="neo-card p-3 md:p-4 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div className="w-8 h-8 md:w-10 md:h-10 border-[2px] border-neo-text flex items-center justify-center bg-neo-blue text-white rounded-lg">
          {icon}
        </div>
        <span className={`border-[2px] border-neo-text px-1.5 py-0.5 text-[10px] md:text-xs font-bold uppercase rounded-md ${badgeColor}`}>
          {badge}
        </span>
      </div>
      
      <h3 className="font-archivo font-extrabold text-sm md:text-base leading-tight mb-1.5">
        {title}
      </h3>
      <p className="text-[10px] md:text-xs text-gray-600 flex-grow mb-4 line-clamp-2 leading-relaxed">
        {description}
      </p>
      
      <Link href={href} className="neo-button w-full py-1.5 md:py-2 text-[10px] md:text-xs flex items-center justify-center gap-1 mt-auto">
        Buka <ArrowRight size={14} />
      </Link>
    </div>
  );
}
