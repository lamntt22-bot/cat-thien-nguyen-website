// Cấu hình phần thưởng vòng quay may mắn — dùng chung cho cả API (chọn thưởng) và
// giao diện quay (vẽ ô, tô màu). Đổi ở đây là áp dụng cho cả hai nơi.
export interface LuckyPrize {
  key: string;
  /** Tên đầy đủ — lưu vào database, hiện trong kết quả trúng thưởng. */
  label: string;
  /** Nhãn ngắn hiển thị trên ô nhỏ của vòng quay (không đủ chỗ cho tên đầy đủ). */
  shortLabel: string;
  /** Trọng số chọn ngẫu nhiên — bằng nhau nghĩa là tỉ lệ trúng như nhau. */
  weight: number;
  color: string;
}

// 5 loại thưởng thật — đây là danh sách dùng để chọn ngẫu nhiên (server) và lưu kết quả.
export const LUCKY_PRIZES: LuckyPrize[] = [
  {
    key: "tra-hong-nguyet",
    label: "1 hộp mẫu dùng thử Hồng Nguyệt Trà",
    shortLabel: "Hồng Nguyệt Trà",
    weight: 1,
    color: "#6e0e13",
  },
  {
    key: "tra-thanh-ha",
    label: "1 mẫu dùng thử Thanh Hạ Trà (hỗ trợ bệnh trĩ)",
    shortLabel: "Thanh Hạ Trà",
    weight: 1,
    color: "#8c1420",
  },
  {
    key: "giam-5",
    label: "Phiếu giảm giá 5% cho đơn hàng đầu tiên",
    shortLabel: "Giảm 5%",
    weight: 1,
    color: "#c9a24b",
  },
  {
    key: "giam-10",
    label: "Phiếu giảm giá 10%",
    shortLabel: "Giảm 10%",
    weight: 1,
    color: "#a9803b",
  },
  {
    key: "giam-15",
    label: "Phiếu giảm giá 15%",
    shortLabel: "Giảm 15%",
    weight: 1,
    color: "#ddbb72",
  },
];

// Vòng quay hiển thị nhiều ô nhỏ hơn cho sinh động — mỗi loại thưởng lặp lại 2 lần,
// xếp đối xứng qua tâm (A,B,C,D,E,A,B,C,D,E). Tỉ lệ trúng theo LOẠI thưởng vẫn giữ
// nguyên như trên (không đổi vì server chọn theo LUCKY_PRIZES, không theo số ô).
export const WHEEL_SEGMENTS: LuckyPrize[] = [...LUCKY_PRIZES, ...LUCKY_PRIZES];

export function pickRandomPrize(): LuckyPrize {
  const totalWeight = LUCKY_PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const prize of LUCKY_PRIZES) {
    roll -= prize.weight;
    if (roll <= 0) return prize;
  }
  return LUCKY_PRIZES[LUCKY_PRIZES.length - 1];
}
