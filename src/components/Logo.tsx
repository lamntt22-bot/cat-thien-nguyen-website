import Image from "next/image";
import { CloudWisp } from "@/components/MotifAccents";

interface LogoProps {
  className?: string;
  imgClassName?: string;
  /** Trên nền đỏ đậm — thêm hào quang sáng + mây đỡ chân chữ để logo đỏ nổi bật thật sự. */
  onDark?: boolean;
}

export default function Logo({ className = "", imgClassName = "h-10 w-auto", onDark = false }: LogoProps) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      {onDark && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(233,196,120,0.5) 35%, transparent 72%)",
            }}
          />
          <CloudWisp className="left-1/2 top-[85%] h-16 w-40 -translate-x-1/2 opacity-45 -z-10" />
        </>
      )}
      <Image
        src="/assets/logo/logo-ctn-transparent.png"
        alt="Cát Thiên Nguyên"
        width={274}
        height={273}
        className={`relative ${imgClassName}`}
        style={
          onDark
            ? {
                filter:
                  "drop-shadow(0 0 4px rgba(255,255,255,1)) drop-shadow(0 0 10px rgba(255,255,255,0.9)) drop-shadow(0 0 20px rgba(201,162,75,1)) drop-shadow(0 0 36px rgba(201,162,75,0.7)) drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
              }
            : undefined
        }
        priority
      />
    </span>
  );
}
