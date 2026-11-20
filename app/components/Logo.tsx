export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Shape S */}
      <path d="M45 30 C25 30, 15 45, 25 55 C35 65, 65 60, 70 75 C75 90, 55 95, 35 85 L30 70 C50 80, 65 75, 60 65 C55 55, 25 60, 20 45 C15 30, 35 20, 55 20 Z" fill="currentColor"/>
      {/* Ring Orbit */}
      <path d="M15 65 C0 70, 10 85, 40 85 C70 85, 95 70, 95 60 C95 50, 80 50, 70 55" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M70 55 C95 45, 100 25, 85 20 C70 15, 50 20, 40 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
