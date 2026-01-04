import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-12 border-t border-gray-200 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center text-xs text-gray-400 font-serif">
        <p>© 2026 SIDLab Thesis Tracker</p>
        <Link 
          href="/settings" 
          className="hover:text-gray-600 transition-colors underline decoration-gray-300 underline-offset-2"
        >
          設定 (Settings)
        </Link>
      </div>
    </footer>
  );
}
