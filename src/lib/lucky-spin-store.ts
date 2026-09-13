import "server-only";
import { getSupabase } from "@/lib/supabase";

export interface LuckySpinRecord {
  id: string;
  name: string;
  phone: string;
  occupation: string;
  prizeKey: string;
  prizeLabel: string;
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
    redeemed: row.redeemed,
    createdAt: row.created_at,
  };
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
  const { data, error } = await getSupabase()
    .from("lucky_spins")
    .insert({
      name: input.name,
      phone: input.phone,
      occupation: input.occupation,
      prize_key: input.prizeKey,
      prize_label: input.prizeLabel,
    })
    .select("*")
    .single<LuckySpinRow>();

  if (error) throw error;
  return toRecord(data);
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
