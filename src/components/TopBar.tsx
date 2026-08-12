const HOTLINE = "0911 556 893";
const ZALO = "0911556893";

export default function TopBar() {
  return (
    <div className="bg-maroon-950 py-2 text-center text-xs text-cream-100/90 sm:text-sm">
      <p>
        Dược Trời Ban · Đất Khai Phúc · Sống Lành Tâm —{" "}
        <a href={`tel:${ZALO}`} className="font-semibold text-gold-400 hover:underline">
          Hotline {HOTLINE}
        </a>
      </p>
    </div>
  );
}
