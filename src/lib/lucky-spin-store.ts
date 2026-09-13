import "server-only";
import { getSupabase } from "@/lib/supabase";

export interface LuckySpinRecord {
  id: string;
  name: string;
  phone: string;
  occupation: string;
  prizeKey: string;
  prizeLabel: string;
  confirmationCode: string | null;
  redeemed: boolean;
  createdAt: string;
}

interface LuckySpinRow {
  id: string;
  name: string;
  phone: string;
  occupation: string;
  prize_key: string;
  prize_label: string;
  confirmation_code: string | null;
  redeemed: boolean;
  created_at: string;
}

function toRecord(row: LuckySpinRow): LuckySpinRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    occupation: row.occupation,
    prizeKey: row.prize_key,
    prizeLabel: row.prize_label,
    confirmationCode: row.confirmation_code,
    redeemed: row.redeemed,
    createdAt: row.created_at,
  };
}

// Không dùng 0/O/1/I để tránh nhầm lẫn khi khách đọc/gõ lại mã.
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateConfirmationCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return `CTN-${code}`;
}

export async function getLuckySpinByPhone(phone: string): Promise<LuckySpinRecord | null> {
  const { data, error } = await getSupabase()
    .from("lucky_spins")
    .select("*")
    .eq("phone", phone)
    .maybeSingle<LuckySpinRow>();

  if (error) throw error;
  return data ? toRecord(data) : null;
}

export async function createLuckySpin(input: {
  name: string;
  phone: string;
  occupation: string;
  prizeKey: string;
  prizeLabel: string;
}): Promise<LuckySpinRecord> {
  // Mã xác nhận là ngẫu nhiên nên cực hiếm khi trùng, nhưng vẫn thử lại vài lần cho chắc.
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await getSupabase()
      .from("lucky_spins")
      .insert({
        name: input.name,
        phone: input.phone,
        occupation: input.occupation,
        prize_key: input.prizeKey,
        prize_label: input.prizeLabel,
        confirmation_code: generateConfirmationCode(),
      })
      .select("*")
      .single<LuckySpinRow>();

    if (!error) return toRecord(data);
    const isConfirmationCodeCollision =
      error.code === "23505" && error.message.includes("confirmation_code");
    if (!isConfirmationCodeCollision) throw error;
  }
  throw new Error("Không thể tạo mã xác nhận, vui lòng thử lại.");
}

export async function listLuckySpins(): Promise<LuckySpinRecord[]> {
  const { data, error } = await getSupabase()
    .from("lucky_spins")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<LuckySpinRow[]>();

  if (error) throw error;
  return (data ?? []).map(toRecord);
}

export async function updateLuckySpinRedeemed(id: string, redeemed: boolean): Promise<void> {
  const { error } = await getSupabase().from("lucky_spins").update({ redeemed }).eq("id", id);
  if (error) throw error;
}

export async function deleteLuckySpin(id: string): Promise<void> {
  const { error } = await getSupabase().from("lucky_spins").delete().eq("id", id);
  if (error) throw error;
}
