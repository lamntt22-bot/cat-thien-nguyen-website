import "server-only";
import { getSupabase } from "@/lib/supabase";

export type OrderStatus = "pending" | "confirmed" | "cancelled";

export interface OrderRecord {
  id: string;
  memberId: string;
  productId?: string;
  productName: string;
  quantity: number;
  note?: string;
  status: OrderStatus;
  createdAt: string;
}

interface OrderRow {
  id: string;
  member_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  quantity: number;
  note: string | null;
  status: string;
  created_at: string;
}

function toRecord(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    memberId: row.member_id,
    productId: row.product_id ?? undefined,
    productName: row.product_name_snapshot,
    quantity: row.quantity,
    note: row.note ?? undefined,
    status: row.status as OrderStatus,
    createdAt: row.created_at,
  };
}

export async function createOrder(input: {
  memberId: string;
  productId?: string;
  productName: string;
  quantity?: number;
  note?: string;
}): Promise<OrderRecord> {
  const { data, error } = await getSupabase()
    .from("orders")
    .insert({
      member_id: input.memberId,
      product_id: input.productId ?? null,
      product_name_snapshot: input.productName,
      quantity: input.quantity ?? 1,
      note: input.note ?? null,
    })
    .select("*")
    .single<OrderRow>();

  if (error) throw error;
  return toRecord(data);
}

export async function listOrdersForMember(memberId: string): Promise<OrderRecord[]> {
  const { data, error } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .returns<OrderRow[]>();

  if (error) throw error;
  return (data ?? []).map(toRecord);
}

export async function listAllOrders(): Promise<OrderRecord[]> {
  const { data, error } = await getSupabase()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<OrderRow[]>();

  if (error) throw error;
  return (data ?? []).map(toRecord);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await getSupabase().from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}
