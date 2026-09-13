import Link from "next/link";

export default function LuckySpinFloatingButton() {
  return (
    <Link
      href="/vong-quay-may-man"
      aria-label="Vòng quay may mắn"
      className="animate-pulse-ring fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-red-600 to-maroon-900 px-4 py-3 text-sm font-bold text-cream-50 shadow-lg transition hover:scale-105 sm:bottom-6 sm:left-6"
      style={{ "--pulse-color": "rgba(201,162,75,0.6)" } as React.CSSProperties}
    >
      <span aria-hidden="true" className="inline-block animate-spin-slow text-xl">
        🎡
      </span>
      <span className="hidden sm:inline">Vòng quay may mắn</span>
      <span className="sm:hidden">Quay quà</span>
    </Link>
  );
}
