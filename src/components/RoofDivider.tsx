/**
 * Dải trang trí "ngưỡng cửa cung đình" — mái ngói + rèm vàng lượn sóng + đèn lồng đỏ,
 * lặp lại ở đầu mỗi khu vực chính trên trang chủ để tạo cảm giác bước qua từng "gian"
 * như một hiệu thuốc Đông y cổ. Hoạ tiết tự vẽ bằng CSS mask/gradient, không dùng ảnh.
 */

function Lantern({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 40" className={className} aria-hidden="true">
      <line x1="12" y1="0" x2="12" y2="5" stroke="#a9803b" strokeWidth="1.5" />
      <rect x="7" y="5" width="10" height="3" rx="1.2" fill="#a9803b" />
      <ellipse cx="12" cy="19" rx="9.5" ry="12" fill="#8c1420" />
      <ellipse cx="12" cy="19" rx="9.5" ry="12" fill="none" stroke="#ddbb72" strokeWidth="1" opacity="0.55" />
      <line x1="4.2" y1="14" x2="19.8" y2="14" stroke="#ddbb72" strokeWidth="0.75" opacity="0.5" />
      <line x1="4.2" y1="24" x2="19.8" y2="24" stroke="#ddbb72" strokeWidth="0.75" opacity="0.5" />
      <rect x="7" y="30" width="10" height="3" rx="1.2" fill="#a9803b" />
      <line x1="12" y1="33" x2="12" y2="38" stroke="#a9803b" strokeWidth="1.5" />
      <circle cx="12" cy="39" r="1.4" fill="#a9803b" />
    </svg>
  );
}

export default function RoofDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-12 w-full overflow-hidden sm:h-16 ${className}`} aria-hidden="true">
      {/* Hàng đầu ngói — chấm tròn nhô lên như đầu ngói mái đình */}
      <div
        className="absolute inset-x-0 top-0 h-2.5 bg-gold-600 sm:h-3"
        style={{
          backgroundImage:
            "radial-gradient(circle at 8px 100%, #a9803b 7px, transparent 7.5px)",
          backgroundSize: "16px 16px",
          backgroundRepeat: "repeat-x",
        }}
      />
      {/* Thân rèm vàng */}
      <div className="absolute inset-x-0 top-2.5 h-4 bg-gradient-to-b from-gold-500 to-gold-400 sm:top-3 sm:h-6" />
      {/* Viền lượn sóng — rèm vàng buông xuống */}
      <div
        className="absolute inset-x-0 top-[26px] h-3.5 bg-gold-400 sm:top-9 sm:h-4"
        style={{
          backgroundImage:
            "radial-gradient(circle at 8px 0, #ddbb72 7px, transparent 7.5px)",
          backgroundSize: "16px 16px",
          backgroundRepeat: "repeat-x",
        }}
      />
      <Lantern className="absolute left-3 top-0 h-10 w-auto sm:left-8 sm:h-12" />
      <Lantern className="absolute right-3 top-0 h-10 w-auto sm:right-8 sm:h-12" />
    </div>
  );
}
