const HOTLINE = "0911556893";

export default function FloatingContactButton() {
  return (
    <a
      href={`tel:${HOTLINE}`}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 sm:bottom-6 sm:right-6"
    >
      <span aria-hidden="true">📞</span>
      Gọi ngay
    </a>
  );
}
