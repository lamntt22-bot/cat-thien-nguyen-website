"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// Chỉ dùng anon key (public, không có quyền admin) — an toàn để chạy trên trình
// duyệt. Chỉ dùng để upload file lên Storage qua signed URL do server cấp.
// Khởi tạo trễ (lazy) như getSupabase() phía server — nếu thiếu biến môi trường,
// chỉ thao tác upload báo lỗi, không làm sập cả trang.
export function getSupabaseBrowser(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Thiếu cấu hình NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  client = createClient(url, anonKey);
  return client;
}
