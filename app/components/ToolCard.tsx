import Link from "next/link";

export default function ToolCard({ title, description, badge, href }: any) {
  return (
    <div className="neo-card p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 border-[3px] border-neo-black flex items-center justify-center bg-neo-cyan">
          <span className="font-bold text-xl">📦</span>
        </div>
        {badge && (
          <span className="border-2 border-neo-black px-2 py-1 text-xs font-bold uppercase bg-neo-pink text-white">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-display text-xl mb-2">{title}</h3>
      <p className="text-sm flex-grow mb-6">{description}</p>
      <Link href={href} className="neo-button w-full py-2 text-center">
        Buka Alat →
      </Link>
    </div>
  );
}
