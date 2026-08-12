interface MotifProps {
  className?: string;
}

/**
 * Sếu đầu đỏ (hạc) bay — thân trắng, đầu cánh đen, đỉnh đầu đỏ — đúng đặc điểm
 * hạc trong tranh cổ/hoạ tiết cung đình. Vẽ chi tiết, nhiều màu, không đơn sắc.
 */
export function CraneMotif({ className = "" }: MotifProps) {
  return (
    <svg viewBox="0 0 240 200" fill="none" className={className} aria-hidden="true">
      {/* legs */}
      <path d="M128 128c10 14 16 28 18 44M138 124c12 12 20 24 24 38" stroke="#171012" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M146 172l-8 8M146 172l1 10M146 172l9 6" stroke="#171012" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M162 162l-8 8M162 162l1 10M162 162l9 6" stroke="#171012" strokeWidth="1.8" strokeLinecap="round" />

      {/* black tail fan behind body */}
      <path d="M158 112c14 2 26 10 34 22-14-2-26 0-36 8 4-12 4-22 2-30Z" fill="#171012" />

      {/* body */}
      <ellipse cx="128" cy="108" rx="34" ry="17" transform="rotate(-8 128 108)" fill="#f7efe0" stroke="#c9a24b" strokeWidth="1.2" />

      {/* wing: cream inner feathers + black outer flight feathers, fanned from shoulder */}
      <g strokeLinecap="round">
        <path d="M118 92C130 74 146 58 168 46" stroke="#f7efe0" strokeWidth="9" fill="none" />
        <path d="M112 96C126 74 144 56 168 42" stroke="#f7efe0" strokeWidth="9" fill="none" />
        <path d="M108 100C122 76 142 56 168 40" stroke="#171012" strokeWidth="8" fill="none" />
        <path d="M104 104C118 78 140 56 168 38" stroke="#171012" strokeWidth="7" fill="none" />
        <path d="M100 108C114 80 136 58 166 38" stroke="#171012" strokeWidth="5.5" fill="none" />
      </g>

      {/* neck */}
      <path d="M100 100C82 90 66 76 56 58" stroke="#f7efe0" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M100 100C82 90 66 76 56 58" stroke="#c9a24b" strokeWidth="1" fill="none" />

      {/* head */}
      <circle cx="52" cy="52" r="8" fill="#f7efe0" stroke="#171012" strokeWidth="1.4" />
      <circle cx="53" cy="46" r="3.2" fill="#c31f2b" />
      <path d="M46 54c-2 2-3 4-3 6" stroke="#171012" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M45 53L26 61" stroke="#3a2a20" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Đàn hạc — 1 con lớn phía trước, 1–2 con nhỏ phía sau tạo chiều sâu, giống bố cục tranh gốc. */
export function CraneFlockMotif({ className = "" }: MotifProps) {
  return (
    <svg viewBox="0 0 320 220" fill="none" className={className} aria-hidden="true">
      <g transform="translate(60,10) scale(1)">
        <CraneShape />
      </g>
      <g transform="translate(0,60) scale(0.62)" opacity="0.92">
        <CraneShape />
      </g>
      <g transform="translate(180,100) scale(0.46)" opacity="0.8">
        <CraneShape />
      </g>
    </svg>
  );
}

function CraneShape() {
  return (
    <>
      <path d="M128 128c10 14 16 28 18 44M138 124c12 12 20 24 24 38" stroke="#171012" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M158 112c14 2 26 10 34 22-14-2-26 0-36 8 4-12 4-22 2-30Z" fill="#171012" />
      <ellipse cx="128" cy="108" rx="34" ry="17" transform="rotate(-8 128 108)" fill="#f7efe0" stroke="#c9a24b" strokeWidth="1.2" />
      <g strokeLinecap="round">
        <path d="M118 92C130 74 146 58 168 46" stroke="#f7efe0" strokeWidth="9" fill="none" />
        <path d="M112 96C126 74 144 56 168 42" stroke="#f7efe0" strokeWidth="9" fill="none" />
        <path d="M108 100C122 76 142 56 168 40" stroke="#171012" strokeWidth="8" fill="none" />
        <path d="M104 104C118 78 140 56 168 38" stroke="#171012" strokeWidth="7" fill="none" />
        <path d="M100 108C114 80 136 58 166 38" stroke="#171012" strokeWidth="5.5" fill="none" />
      </g>
      <path d="M100 100C82 90 66 76 56 58" stroke="#f7efe0" strokeWidth="13" strokeLinecap="round" fill="none" />
      <circle cx="52" cy="52" r="8" fill="#f7efe0" stroke="#171012" strokeWidth="1.4" />
      <circle cx="53" cy="46" r="3.2" fill="#c31f2b" />
      <path d="M45 53L26 61" stroke="#3a2a20" strokeWidth="2.2" strokeLinecap="round" />
    </>
  );
}

/** Vân mây cuộn dát vàng — mây khối nhiều lớp kiểu giấy cắt, không phải mây tròn phương Tây. */
export function CloudMotif({ className = "" }: MotifProps) {
  return (
    <svg viewBox="0 0 220 150" fill="none" className={className} aria-hidden="true">
      <g>
        <path
          d="M30 100c-16 0-28-13-28-28 0-14 10-25 24-27 3-16 17-28 33-28 12 0 22 6 28 16 6-9 16-15 27-15 18 0 32 14 32 32 0 2 0 4-.3 6 13 2 23 13 23 27 0 15-12 27-27 27H42c-5 0-9-4-12-10Z"
          fill="#c9a24b"
        />
        <path
          d="M30 100c-16 0-28-13-28-28 0-14 10-25 24-27 3-16 17-28 33-28 12 0 22 6 28 16 6-9 16-15 27-15 18 0 32 14 32 32 0 2 0 4-.3 6 13 2 23 13 23 27 0 15-12 27-27 27H42c-5 0-9-4-12-10Z"
          stroke="#8a6a2c"
          strokeWidth="2"
          fill="none"
        />
        <path d="M46 70c8-6 18-6 25 1M100 55c9-7 20-6 27 2M64 40c6-8 16-11 25-8" stroke="#ecd9a8" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
      <g transform="translate(120,88)">
        <path
          d="M22 46c-11 0-19-9-19-19 0-9 7-17 16-18 2-11 11-19 22-19 8 0 15 4 19 11 4-6 11-10 18-10 12 0 22 10 22 22 0 1 0 3-.2 4 9 1 16 9 16 18 0 10-8 18-18 18H34c-4 0-7-3-9-6Z"
          fill="#ddbb72"
        />
        <path
          d="M22 46c-11 0-19-9-19-19 0-9 7-17 16-18 2-11 11-19 22-19 8 0 15 4 19 11 4-6 11-10 18-10 12 0 22 10 22 22 0 1 0 3-.2 4 9 1 16 9 16 18 0 10-8 18-18 18H34c-4 0-7-3-9-6Z"
          stroke="#8a6a2c"
          strokeWidth="1.6"
          fill="none"
        />
      </g>
    </svg>
  );
}

/** Dải mây lụa cuộn — dùng làm đường dẫn/chân trời bên dưới đàn hạc. */
export function CloudRibbonMotif({ className = "" }: MotifProps) {
  return (
    <svg viewBox="0 0 260 90" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 60c26 12 46 4 58-14 10 18 32 22 50 10 8 20 32 26 52 14 10 16 34 20 52 8"
        stroke="#c9a24b"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M10 60c-8 4-14 12-11 20 3 7 12 9 18 4 4-4 3-11-3-13"
        stroke="#c9a24b"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M222 78c9-2 17 2 18 10 1 7-7 12-14 9-5-2-6-9-2-12"
        stroke="#c9a24b"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Hoa mẫu đơn nhiều lớp cánh — hoạ tiết đi cùng hạc/mây trong tranh gốc. */
export function PeonyMotif({ className = "" }: MotifProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <g stroke="#8a3b30" strokeWidth="1" strokeLinejoin="round">
        <path d="M50 40c-7-9-7-20 2-27 7 9 5 20-2 27Z" fill="#f7efe0" />
        <path d="M60 45c9-5 20-3 25 6-9 5-20 2-25-6Z" fill="#f0d3c4" />
        <path d="M62 58c7 9 5 20-3 26-6-9-4-19 3-26Z" fill="#f7efe0" />
        <path d="M40 58c-7 9-18 11-26 5 6-9 18-11 26-5Z" fill="#f0d3c4" />
        <path d="M38 45c-9-5-20-2-24 7 9 5 19 2 24-7Z" fill="#f7efe0" />
        <circle cx="50" cy="50" r="11" fill="#e0231b" opacity="0.9" />
        <circle cx="50" cy="50" r="5" fill="#c9a24b" />
      </g>
    </svg>
  );
}
