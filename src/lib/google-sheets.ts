import "server-only";
import type { TrialRequestRecord, TrialRequestStatus } from "@/lib/trial-store";

const PURPOSE_LABEL: Record<string, string> = {
  "ca-nhan": "Khách hàng lẻ",
  "doi-tac": "Đối tác kinh doanh",
};

const STATUS_LABEL: Record<TrialRequestStatus, string> = {
  new: "Mới đăng ký",
  contacted: "Đã liên hệ",
  done: "Đã gửi mẫu",
};

// Đồng bộ qua 1 Google Apps Script Web App gắn trực tiếp vào Google Sheet của
// người dùng (Extensions → Apps Script → Deploy as Web App) — không cần Google
// Cloud Console, service account hay bật billing. URL này đóng vai trò như
// "mật khẩu" (không công khai) nên không cần thêm xác thực khác.
function getWebhookUrl(): string | undefined {
  return process.env.GOOGLE_SHEET_WEBHOOK_URL;
}

export function isSheetSyncConfigured(): boolean {
  return Boolean(getWebhookUrl());
}

function toRow(record: TrialRequestRecord): string[] {
  return [
    record.id,
    new Date(record.createdAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }),
    record.name,
    record.phone,
    record.address,
    PURPOSE_LABEL[record.purpose] ?? record.purpose,
    record.occupation,
    record.productNames.join(", "),
    record.note ?? "",
    STATUS_LABEL[record.status] ?? record.status,
  ];
}

async function callWebhook(payload: Record<string, unknown>): Promise<void> {
  const url = getWebhookUrl();
  if (!url) return;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Google Sheet webhook trả về lỗi HTTP ${res.status}`);
  }
}

/** Best-effort — không bao giờ throw ra ngoài, vì đây chỉ là đồng bộ phụ, không
 * được phép làm hỏng luồng đăng ký dùng thử chính (vẫn lưu vào Supabase trước). */
export async function syncTrialRequestToSheet(record: TrialRequestRecord): Promise<void> {
  if (!isSheetSyncConfigured()) return;

  try {
    await callWebhook({ action: "append", row: toRow(record) });
  } catch (err) {
    console.error("[google-sheets] append failed", err);
  }
}

/** Cập nhật cột "Trạng thái" của đúng dòng có ID trùng khớp — best-effort, không throw. */
export async function syncTrialRequestStatusToSheet(
  id: string,
  status: TrialRequestStatus,
): Promise<void> {
  if (!isSheetSyncConfigured()) return;

  try {
    await callWebhook({ action: "updateStatus", id, status: STATUS_LABEL[status] ?? status });
  } catch (err) {
    console.error("[google-sheets] status sync failed", err);
  }
}

/** Đồng bộ lại TOÀN BỘ danh sách — admin bấm tay 1 lần để backfill dữ liệu cũ hoặc
 * khôi phục nếu sheet bị sửa nhầm. Ném lỗi thật ra ngoài vì đây là hành động admin
 * chủ động bấm — cần biết ngay nếu thất bại, khác với đồng bộ nền (best-effort). */
export async function resyncAllTrialRequestsToSheet(records: TrialRequestRecord[]): Promise<void> {
  if (!isSheetSyncConfigured()) {
    throw new Error("Chưa cấu hình Google Sheet (thiếu GOOGLE_SHEET_WEBHOOK_URL).");
  }

  await callWebhook({ action: "resyncAll", rows: records.map(toRow) });
}
