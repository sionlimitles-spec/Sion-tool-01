export default function Footer() {
  return (
    <footer className="mt-12 border-t-[3px] border-neo-text pt-6 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="font-bold text-xs md:text-sm text-gray-600">
        © {new Date().getFullYear()} Sion Tool. All rights reserved.
      </p>
      <p className="font-bold text-xs md:text-sm text-black flex items-center gap-1">
        Made with <span className="text-red-500">❤</span> by Sion Developer
      </p>
    </footer>
  );
}
