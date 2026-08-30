export function formatVnd(amount: number): string {
  return `${amount.toLocaleString("vi-VN")}₫`;
}

export function formatVndInput(amount: number): string {
  return amount > 0 ? amount.toLocaleString("vi-VN") : "";
}

export function parseVndInput(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}
