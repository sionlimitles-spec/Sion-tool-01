const A = ["SION TOOL", "ALL IN ONE", "GRATIS", "NO ADS", "SIONNIME OK", "NONTON ANIME"];
const B = ["KOMPRES MEDIA", "QR STUDIO", "AUDIO MERGER", "MERGE PDF", "FILE KE LINK", "UPDATE HARIAN"];
const Row = ({ items }: { items: string[] }) => (
  <div className="flex shrink-0" aria-hidden="true">{[...items, ...items, ...items].map((t, i) => <span key={i}>{t} <b className="text-neo-pink">✦</b></span>)}</div>
);
export default function Ticker() {
  return (
    <div aria-hidden="true" className="-mx-4 md:-mx-8 mb-6">
      <div className="ticker"><div className="ticker__track"><Row items={A} /><Row items={A} /></div></div>
      <div className="ticker ticker--rev border-t-0"><div className="ticker__track"><Row items={B} /><Row items={B} /></div></div>
    </div>
  );
}
