interface CraneCornerProps {
  position: "top-right" | "bottom-left";
  className?: string;
}

/**
 * Hạc cắt sẵn (pixel-crop, không zoom bằng CSS) từ ảnh gốc
 * /assets/products/chim hạc vân mây pro.jpg — mỗi file đã canh đúng để hạc hiện đầy đủ
 * đầu/thân/cánh/chân, không bị cụt. Xem lại bằng cách mở trực tiếp file trong
 * /assets/patterns/ nếu cần đổi vùng cắt.
 */
export function CraneCorner({ position, className = "" }: CraneCornerProps) {
  const isTopRight = position === "top-right";
  const maskPos = isTopRight ? "65% 35%" : "35% 65%";
  const src = isTopRight
    ? "/assets/patterns/hac-top-right.png"
    : "/assets/patterns/hac-bottom-left.png";
  return (
    <div
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        backgroundImage: `url('${src}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
 * Mây vàng cắt sẵn (pixel-crop) từ góc trên-trái ảnh chim hạc vân mây pro.jpg — vùng sạch,
 * không dính hạc. Dùng lặp lại vài chỗ để tạo hoạ tiết rải nhẹ.
 */
export function CloudWisp({ className = "", rotate = 0 }: CloudWispProps) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{
        backgroundImage: "url('/assets/patterns/may-goc.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
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
