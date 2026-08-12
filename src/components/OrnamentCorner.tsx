interface OrnamentCornerProps {
  className?: string;
  /** Which corner this bracket sits in — mirrors the artwork accordingly. */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

/**
 * Gold corner-bracket ornament — interlocking scroll (hồi văn) motif, echoes the
 * ornate frame corners used in Vietnamese/Chinese court decoration & event posters.
 */
export default function OrnamentCorner({ className = "", position = "top-left" }: OrnamentCornerProps) {
  const rotation: Record<string, string> = {
    "top-left": "",
    "top-right": "scale-x-[-1]",
    "bottom-left": "scale-y-[-1]",
    "bottom-right": "scale-x-[-1] scale-y-[-1]",
  };

  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      className={`${rotation[position]} ${className}`}
      aria-hidden="true"
    >
      <path
        d="M4 4h20M4 4v20M4 4c8 0 14 1 18 5s5 10 5 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 16c6 0 10 1 13 4s4 7 4 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="4" cy="4" r="2.4" fill="currentColor" />
    </svg>
  );
}
