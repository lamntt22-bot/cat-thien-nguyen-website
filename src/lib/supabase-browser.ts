"use client";

import { createClient } from "@supabase/supabase-js";

// Chỉ dùng anon key (public, không có quyền admin) — an toàn để chạy trên trình
// duyệt. Chỉ dùng để upload file lên Storage qua signed URL do server cấp.
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
