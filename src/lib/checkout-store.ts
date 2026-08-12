import "server-only";
import { getSupabase } from "@/lib/supabase";

export type PaymentMethod = "bank_transfer" | "cod";
export type CheckoutStatus = "pending" | "confirmed" | "shipping" | "completed" | "cancelled";

export interface CheckoutItemInput {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface CheckoutItemRecord extends CheckoutItemInput {
  id: string;
}

export interface CheckoutRecord {
  id: string;
  memberId: string;
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  status: CheckoutStatus;
  totalAmount: number;
  note?: string;
  createdAt: string;
  items: CheckoutItemRecord[];
}

interface CheckoutRow {
  id: string;
  member_id: string;
  full_name: string;
  phone: string;
  address: string;
  payment_method: string;
  status: string;
  total_amount: number;
  note: string | null;
  created_at: string;
}

interface CheckoutItemRow {
  id: string;
  checkout_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  unit_price: number;
  quantity: number;
}

function toItemRecord(row: CheckoutItemRow): CheckoutItemRecord {
  return {
    id: row.id,
    productId: row.product_id ?? "",
    productName: row.product_name_snapshot,
    unitPrice: row.unit_price,
    quantity: row.quantity,
  };
}

function toRecord(row: CheckoutRow, items: CheckoutItemRow[]): CheckoutRecord {
  return {
    id: row.id,
    memberId: row.member_id,
    fullName: row.full_name,
    phone: row.phone,
    address: row.address,
    paymentMethod: row.payment_method as PaymentMethod,
    status: row.status as CheckoutStatus,
    totalAmount: row.total_amount,
    note: row.note ?? undefined,
    createdAt: row.created_at,
    items: items.map(toItemRecord),
  };
}

export async function createCheckout(input: {
  memberId: string;
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  note?: string;
  items: CheckoutItemInput[];
}): Promise<CheckoutRecord> {
  const totalAmount = input.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const { data: checkout, error } = await getSupabase()
    .from("checkouts")
    .insert({
      member_id: input.memberId,
      full_name: input.fullName,
      phone: input.phone,
      address: input.address,
      payment_method: input.paymentMethod,
      note: input.note ?? null,
      total_amount: totalAmount,
    })
    .select("*")
    .single<CheckoutRow>();

  if (error) throw error;

  const { data: items, error: itemsError } = await getSupabase()
    .from("checkout_items")
    .insert(
      input.items.map((i) => ({
        checkout_id: checkout.id,
        product_id: i.productId,
        product_name_snapshot: i.productName,
        unit_price: i.unitPrice,
        quantity: i.quantity,
      })),
    )
    .select("*")
    .returns<CheckoutItemRow[]>();

  if (itemsError) throw itemsError;

  return toRecord(checkout, items ?? []);
}

async function attachItems(rows: CheckoutRow[]): Promise<CheckoutRecord[]> {
  if (rows.length === 0) return [];
  const { data: items, error } = await getSupabase()
    .from("checkout_items")
    .select("*")
    .in(
      "checkout_id",
      rows.map((r) => r.id),
    )
    .returns<CheckoutItemRow[]>();

  if (error) throw error;

  return rows.map((row) =>
    toRecord(
      row,
      (items ?? []).filter((i) => i.checkout_id === row.id),
    ),
  );
}

export async function listCheckoutsForMember(memberId: string): Promise<CheckoutRecord[]> {
  const { data, error } = await getSupabase()
    .from("checkouts")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .returns<CheckoutRow[]>();

  if (error) throw error;
  return attachItems(data ?? []);
}

export async function listAllCheckouts(): Promise<CheckoutRecord[]> {
  const { data, error } = await getSupabase()
    .from("checkouts")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<CheckoutRow[]>();

  if (error) throw error;
  return attachItems(data ?? []);
}

export async function updateCheckoutStatus(id: string, status: CheckoutStatus): Promise<void> {
  const { error } = await getSupabase().from("checkouts").update({ status }).eq("id", id);
  if (error) throw error;
}
