import "server-only";
import { getSupabase } from "@/lib/supabase";

export type TrialRequestStatus = "new" | "contacted" | "done";
export type TrialRequestPurpose = "ca-nhan" | "doi-tac";

export interface TrialRequestRecord {
  id: string;
  name: string;
  phone: string;
  address: string;
  purpose: TrialRequestPurpose;
  occupation: string;
  productIds: string[];
  productNames: string[];
  status: TrialRequestStatus;
  note?: string;
  createdAt: string;
}

interface TrialRequestRow {
  id: string;
  name: string;
  phone: string;
  address: string;
  purpose: string;
  occupation: string;
  product_ids: string[] | null;
  product_names: string[] | null;
  status: string;
  note: string | null;
  created_at: string;
}

function toRecord(row: TrialRequestRow): TrialRequestRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    address: row.address,
    purpose: row.purpose as TrialRequestPurpose,
    occupation: row.occupation,
    productIds: row.product_ids ?? [],
    productNames: row.product_names ?? [],
    status: row.status as TrialRequestStatus,
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}

export async function createTrialRequest(input: {
  name: string;
  phone: string;
  address: string;
  purpose: TrialRequestPurpose;
  occupation: string;
  productIds: string[];
  productNames: string[];
  note?: string;
}): Promise<TrialRequestRecord> {
  const { data, error } = await getSupabase()
    .from("trial_requests")
    .insert({
      name: input.name,
      phone: input.phone,
      address: input.address,
      purpose: input.purpose,
      occupation: input.occupation,
      product_ids: input.productIds,
      product_names: input.productNames,
      note: input.note ?? null,
    })
    .select("*")
    .single<TrialRequestRow>();

  if (error) throw error;
  return toRecord(data);
}

export async function listTrialRequests(): Promise<TrialRequestRecord[]> {
  const { data, error } = await getSupabase()
    .from("trial_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<TrialRequestRow[]>();

  if (error) throw error;
  return (data ?? []).map(toRecord);
}

export async function updateTrialRequestStatus(
  id: string,
  status: TrialRequestStatus,
): Promise<void> {
  const { error } = await getSupabase().from("trial_requests").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteTrialRequest(id: string): Promise<void> {
  const { error } = await getSupabase().from("trial_requests").delete().eq("id", id);
  if (error) throw error;
}
