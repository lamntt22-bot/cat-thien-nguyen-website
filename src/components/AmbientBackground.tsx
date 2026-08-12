interface AmbientBackgroundProps {
  /** "full" = hiệu ứng đầy đủ (Hero); "light" = bản nhẹ hơn cho các section tối khác. */
  variant?: "full" | "light";
  className?: string;
}

const STAR_POSITIONS = [
  { top: "12%", left: "18%", size: 3, delay: "0s" },
  { top: "22%", left: "78%", size: 2, delay: "0.6s" },
  { top: "68%", left: "10%", size: 2, delay: "1.1s" },
  { top: "80%", left: "62%", size: 3, delay: "1.7s" },
  { top: "38%", left: "50%", size: 2, delay: "2.2s" },
  { top: "55%", left: "88%", size: 2, delay: "0.3s" },
  { top: "8%", left: "45%", size: 2, delay: "1.4s" },
  { top: "30%", left: "8%", size: 2, delay: "0.9s" },
  { top: "48%", left: "30%", size: 2, delay: "1.9s" },
  { top: "62%", left: "48%", size: 3, delay: "0.2s" },
  { top: "18%", left: "60%", size: 2, delay: "1.2s" },
  { top: "90%", left: "28%", size: 2, delay: "0.5s" },
  { top: "5%", left: "88%", size: 2, delay: "2.5s" },
  { top: "72%", left: "92%", size: 3, delay: "0.8s" },
];

/**
 * Mây trôi mờ ảo + quầng sáng xoáy tròn + sao lấp lánh — hiệu ứng nền động
 * cho các section nền đỏ đậm. Toàn CSS animation (transform/opacity), không JS,
 * tôn trọng prefers-reduced-motion.
 */
export default function AmbientBackground({ variant = "full", className = "" }: AmbientBackgroundProps) {
  const isFull = variant === "full";

  return (
    <div className={`ambient-bg ${className}`} aria-hidden="true">
      <div
        className="ambient-mist ambient-mist-a"
        style={{
          top: "-10%",
          left: "-10%",
          width: "55%",
          height: "55%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(233,196,120,0.1) 45%, transparent 75%)",
          opacity: isFull ? 0.9 : 0.5,
        }}
      />
      <div
        className="ambient-mist ambient-mist-b"
        style={{
          bottom: "-15%",
          right: "-10%",
          width: "60%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(201,162,75,0.16) 0%, rgba(255,255,255,0.08) 40%, transparent 75%)",
          opacity: isFull ? 0.85 : 0.45,
        }}
      />
      {isFull && (
        <div
          className="ambient-swirl"
          style={{
            top: "50%",
            left: "50%",
            width: "120%",
            height: "120%",
            marginLeft: "-60%",
            marginTop: "-60%",
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(233,196,120,0.08) 60deg, transparent 140deg, rgba(255,255,255,0.06) 220deg, transparent 300deg, transparent 360deg)",
            filter: "blur(30px)",
          }}
        />
      )}
      {STAR_POSITIONS.slice(0, isFull ? STAR_POSITIONS.length : 7).map((s, i) => (
        <span
          key={i}
          className="ambient-star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}
