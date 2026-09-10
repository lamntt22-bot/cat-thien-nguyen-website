import "server-only";
import { google } from "googleapis";
import type { TrialRequestRecord, TrialRequestStatus } from "@/lib/trial-store";

const SHEET_TAB = "Đăng ký dùng thử";
const HEADER_ROW = [
  "ID",
  "Ngày đăng ký",
  "Họ tên",
  "SĐT / Zalo",
  "Địa chỉ nhận mẫu",
  "Mục đích",
  "Lĩnh vực / công việc",
  "Trà muốn dùng thử",
  "Ghi chú",
  "Trạng thái",
];

const PURPOSE_LABEL: Record<string, string> = {
  "ca-nhan": "Khách hàng lẻ",
  "doi-tac": "Đối tác kinh doanh",
};

const STATUS_LABEL: Record<TrialRequestStatus, string> = {
  new: "Mới đăng ký",
  contacted: "Đã liên hệ",
  done: "Đã gửi mẫu",
};

export function isSheetSyncConfigured() {
  return isConfigured();
}

function isConfigured() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID,
  );
}

let cachedSheets: ReturnType<typeof google.sheets> | null = null;

function getSheetsClient() {
  if (cachedSheets) return cachedSheets;

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // Vercel/dotenv env vars can't hold real newlines — the key is stored with
    // literal "\n" sequences and must be unescaped before use.
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cachedSheets = google.sheets({ version: "v4", auth });
  return cachedSheets;
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

async function ensureHeaderRow() {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_TAB}!A1:J1`,
  });

  if (!existing.data.values || existing.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_TAB}!A1:J1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [HEADER_ROW] },
    });
  }
}

/** Best-effort — không bao giờ throw ra ngoài, vì đây chỉ là đồng bộ phụ, không
 * được phép làm hỏng luồng đăng ký dùng thử chính (vẫn lưu vào Supabase trước). */
export async function syncTrialRequestToSheet(record: TrialRequestRecord): Promise<void> {
  if (!isConfigured()) return;

  try {
    await ensureHeaderRow();
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: `${SHEET_TAB}!A:J`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [toRow(record)] },
    });
  } catch (err) {
    console.error("[google-sheets] append failed", err);
  }
}

/** Đồng bộ lại TOÀN BỘ danh sách — admin bấm tay 1 lần để backfill dữ liệu cũ hoặc
 * khôi phục nếu sheet bị sửa nhầm. Xoá sạch dữ liệu cũ rồi ghi lại từ đầu (an toàn để
 * bấm nhiều lần, không bị nhân đôi dòng). Ném lỗi thật ra ngoài vì đây là hành động admin
 * chủ động bấm — cần biết ngay nếu thất bại, khác với đồng bộ nền (best-effort). */
export async function resyncAllTrialRequestsToSheet(records: TrialRequestRecord[]): Promise<void> {
  if (!isConfigured()) {
    throw new Error("Chưa cấu hình Google Sheet (thiếu biến môi trường).");
  }

  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${SHEET_TAB}!A2:J`,
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_TAB}!A1:J1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [HEADER_ROW] },
  });

  if (records.length === 0) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_TAB}!A2:J${records.length + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: records.map(toRow) },
  });
}

/** Cập nhật cột "Trạng thái" của đúng dòng có ID trùng khớp — best-effort, không throw. */
export async function syncTrialRequestStatusToSheet(
  id: string,
  status: TrialRequestStatus,
): Promise<void> {
  if (!isConfigured()) return;

  try {
    const sheets = getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

    const idColumn = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_TAB}!A:A`,
    });

    const rows = idColumn.data.values ?? [];
    const rowIndex = rows.findIndex((row) => row[0] === id);
    if (rowIndex === -1) return;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_TAB}!J${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[STATUS_LABEL[status] ?? status]] },
    });
  } catch (err) {
    console.error("[google-sheets] status sync failed", err);
  }
}
