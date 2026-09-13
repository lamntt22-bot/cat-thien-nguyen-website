// Cấu hình phần thưởng vòng quay may mắn — dùng chung cho cả API (chọn thưởng) và
// giao diện quay (vẽ ô, tô màu). Đổi ở đây là áp dụng cho cả hai nơi.
export interface LuckyPrize {
  key: string;
  label: string;
  /** Nhãn ngắn hiển thị trên ô của vòng quay (không đủ chỗ cho tên đầy đủ). */
  shortLabel: string;
  /** Trọng số chọn ngẫu nhiên — bằng nhau nghĩa là tỉ lệ trúng như nhau. */
  weight: number;
  color: string;
}

export const LUCKY_PRIZES: LuckyPrize[] = [
  {
    key: "tra-hong-nguyet",
    label: "Trải nghiệm Hồng Nguyệt Trà",
    shortLabel: "Hồng Nguyệt Trà",
    weight: 1,
    color: "#6e0e13",
  },
  {
    key: "tra-thanh-ha",
    label: "Trải nghiệm Thanh Hạ Trà",
    shortLabel: "Thanh Hạ Trà",
    weight: 1,
    color: "#8c1420",
  },
  { key: "giam-5", label: "Giảm giá 5%", shortLabel: "Giảm 5%", weight: 1, color: "#c9a24b" },
  { key: "giam-10", label: "Giảm giá 10%", shortLabel: "Giảm 10%", weight: 1, color: "#a9803b" },
  { key: "giam-15", label: "Giảm giá 15%", shortLabel: "Giảm 15%", weight: 1, color: "#ddbb72" },
];

export function pickRandomPrize(): LuckyPrize {
  const totalWeight = LUCKY_PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const prize of LUCKY_PRIZES) {
    roll -= prize.weight;
    if (roll <= 0) return prize;
  }
  return LUCKY_PRIZES[LUCKY_PRIZES.length - 1];
}
