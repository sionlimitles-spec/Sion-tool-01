import { Star } from "lucide-react";
import Link from "next/link";

interface AnimeCardProps {
  id: string;
  title: string;
  image: string;
  genres: string[];
  status: "Ongoing" | "Completed";
  rating: number | null;
}

export default function AnimeCard({ id, title, image, genres, status, rating }: AnimeCardProps) {
  return (
    <Link href={`/anime/${id}`} className="group flex flex-col w-full">
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] border-[3px] border-neo-text rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#111] mb-3 bg-gray-200 shrink-0">
        <img 
          src={image} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-extrabold uppercase border-[2px] border-neo-text rounded-md shadow-[2px_2px_0px_0px_#111] ${status === 'Ongoing' ? 'bg-neo-green text-white' : 'bg-neo-blue text-white'}`}>
          {status}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-white border-[2px] border-neo-text px-1.5 py-0.5 rounded-md shadow-[2px_2px_0px_0px_#111] flex items-center gap-1">
          <Star size={10} className="fill-neo-yellow text-neo-text" strokeWidth={2.5} />
          {rating !== null && <span className="text-[10px] font-extrabold text-neo-text">{rating}</span>}
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-col px-1">
        <h3 className="font-archivo font-extrabold text-sm md:text-base leading-tight line-clamp-2 text-black group-hover:underline">
          {title}
        </h3>
        <p className="text-[10px] md:text-xs font-bold text-gray-600 mt-1 truncate">
          {genres.join(" • ")}
        </p>
      </div>
    </Link>
  );
}
