interface CraneCornerProps {
  position: "top-right" | "bottom-left";
  className?: string;
}

/**
 * Hạc cắt góc từ ảnh gốc /assets/patterns/hac-van-may.jpg bằng toán học phần trăm:
 * background-size 200% 200% + position ở góc tương ứng luôn hiển thị đúng 1/4 ảnh gốc
 * (top-right → hạc đơn ở góc phải-trên của ảnh; bottom-left → cụm 2 hạc góc trái-dưới).
 * Viền bo tròn mềm bằng mask để không lộ cạnh ảnh.
 */
export function CraneCorner({ position, className = "" }: CraneCornerProps) {
  const isTopRight = position === "top-right";
  const maskPos = isTopRight ? "65% 35%" : "35% 65%";
  return (
    <div
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        backgroundImage: "url('/assets/patterns/hac-van-may.jpg')",
        backgroundSize: "200% 200%",
        backgroundPosition: isTopRight ? "100% 0%" : "0% 100%",
        backgroundRepeat: "no-repeat",
        maskImage: `radial-gradient(circle at ${maskPos}, black 45%, transparent 78%)`,
        WebkitMaskImage: `radial-gradient(circle at ${maskPos}, black 45%, transparent 78%)`,
      }}
    />
  );
}

interface CloudWispProps {
  className?: string;
  rotate?: number;
}

/**
 * Mây trắng cắt từ /assets/patterns/hoa-tiet-may.jpg — vùng sạch (x 0–20%, y 25–65% ảnh gốc),
 * tránh mái đình và hình người. Dùng lặp lại vài chỗ để tạo hoạ tiết rải nhẹ.
 */
export function CloudWisp({ className = "", rotate = 0 }: CloudWispProps) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{
        backgroundImage: "url('/assets/patterns/hoa-tiet-may.jpg')",
        backgroundSize: "500% 250%",
        backgroundPosition: "0% 16.7%",
        backgroundRepeat: "no-repeat",
        maskImage:
          "radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 85%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 85%)",
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    />
  );
}
