export const API = "https://api.tenrai.org/v4";

export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string | null;
  images: { jpg: { large_image_url: string; image_url?: string } };
  genres?: { mal_id: number; name: string }[];
  status?: string;
  score?: number | null;
  episodes?: number | null;
  year?: number | null;
  type?: string | null;
  synopsis?: string | null;
}

export const animeTitle = (a: Anime) => a.title_english || a.title;
export const isAiring = (a: Anime) => a.status === "Currently Airing";
export const poster = (a: Anime) => a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || "";

export const GENRES: { id: number; name: string }[] = [
  { id: 1, name: "Action" }, { id: 2, name: "Adventure" }, { id: 4, name: "Comedy" }, { id: 8, name: "Drama" },
  { id: 10, name: "Fantasy" }, { id: 14, name: "Horror" }, { id: 7, name: "Mystery" }, { id: 22, name: "Romance" },
  { id: 24, name: "Sci-Fi" }, { id: 36, name: "Slice of Life" }, { id: 30, name: "Sports" }, { id: 37, name: "Supernatural" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let nextSlot = 0; // jaga jarak antar request (rate limit ±3 req/detik)

export async function api<T = any>(path: string, signal?: AbortSignal, tries = 2): Promise<T> {
  const now = Date.now();
  const wait = Math.max(0, nextSlot - now);
  nextSlot = now + wait + 380;
  if (wait) await sleep(wait);
  if (signal?.aborted) throw new DOMException("aborted", "AbortError");
  const res = await fetch(`${API}${path}`, { signal });
  if (res.status === 429 && tries > 0) { await sleep(1300); return api<T>(path, signal, tries - 1); }
  if (!res.ok) throw new Error(`Server membalas ${res.status}`);
  return res.json();
}

export interface ListResult { data: Anime[]; pagination?: { has_next_page: boolean } }
export function listPath(p: Record<string, string | number | undefined>) {
  const q = new URLSearchParams({ sfw: "true", limit: "24" });
  Object.entries(p).forEach(([k, v]) => { if (v !== undefined && v !== "") q.set(k, String(v)); });
  return `/anime?${q.toString()}`;
}
export const dedupe = (list: Anime[]) => { const s = new Set<number>(); return list.filter((a) => (s.has(a.mal_id) ? false : (s.add(a.mal_id), true))); };

// ---- watchlist & riwayat (localStorage) ----
const rd = <T,>(k: string, fb: T): T => { try { return JSON.parse(localStorage.getItem(k) || "null") ?? fb; } catch { return fb; } };
const wr = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
export type Mini = { mal_id: number; title: string; image: string };
export const getWatchlist = () => rd<Mini[]>("sion_watchlist", []);
export function toggleWatchlist(m: Mini) {
  const l = getWatchlist(); const has = l.some((x) => x.mal_id === m.mal_id);
  wr("sion_watchlist", has ? l.filter((x) => x.mal_id !== m.mal_id) : [m, ...l]);
  return !has;
}
export const getLastEp = (id: number) => rd<Record<string, number>>("sion_last", {})[id] || 0;
export const setLastEp = (id: number, ep: number) => wr("sion_last", { ...rd<Record<string, number>>("sion_last", {}), [id]: ep });
export const getRecent = () => rd<string[]>("sion_recent", []);
export const addRecent = (q: string) => wr("sion_recent", [q, ...getRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 8));
export const clearRecent = () => wr("sion_recent", []);
