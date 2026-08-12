import "server-only";
import { getSupabase } from "@/lib/supabase";
import type { MemberRole } from "@/lib/auth";

export interface MemberRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: MemberRole;
  interestedProduct?: string;
  mustChangePassword: boolean;
  createdAt: string;
}

export interface MemberWithHash extends MemberRecord {
  passwordHash: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  product?: string;
  website?: string; // honeypot
}

interface MemberRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  password_hash: string;
  role: string;
  interested_product: string | null;
  must_change_password: boolean;
  created_at: string;
}

function toMemberWithHash(row: MemberRow): MemberWithHash {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role as MemberRole,
    interestedProduct: row.interested_product ?? undefined,
    mustChangePassword: row.must_change_password,
    createdAt: row.created_at,
  };
}

function toMemberRecord(row: MemberRow): MemberRecord {
  const { passwordHash: _passwordHash, ...rest } = toMemberWithHash(row);
  return rest;
}

export async function findMemberByContact(
  phone: string,
  email: string,
): Promise<MemberWithHash | null> {
  const { data, error } = await getSupabase()
    .from("members")
    .select("*")
    .or(`phone.eq.${phone},email.ilike.${email}`)
    .limit(1)
    .maybeSingle<MemberRow>();

  if (error) throw error;
  return data ? toMemberWithHash(data) : null;
}

export async function findMemberByLoginId(loginId: string): Promise<MemberWithHash | null> {
  const { data, error } = await getSupabase()
    .from("members")
    .select("*")
    .or(`phone.eq.${loginId},email.ilike.${loginId}`)
    .limit(1)
    .maybeSingle<MemberRow>();

  if (error) throw error;
  return data ? toMemberWithHash(data) : null;
}

export async function findMemberById(id: string): Promise<MemberWithHash | null> {
  const { data, error } = await getSupabase()
    .from("members")
    .select("*")
    .eq("id", id)
    .maybeSingle<MemberRow>();

  if (error) throw error;
  return data ? toMemberWithHash(data) : null;
}

export async function createMember(
  payload: RegisterPayload,
  passwordHash: string,
): Promise<MemberRecord> {
  const { data, error } = await getSupabase()
    .from("members")
    .insert({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      password_hash: passwordHash,
      interested_product: payload.product ?? null,
    })
    .select("*")
    .single<MemberRow>();

  if (error) throw error;
  return toMemberRecord(data);
}

export async function updateMemberPassword(id: string, passwordHash: string): Promise<void> {
  const { error } = await getSupabase()
    .from("members")
    .update({ password_hash: passwordHash, must_change_password: false })
    .eq("id", id);

  if (error) throw error;
}

export interface UpdateMemberInput {
  name: string;
  phone: string;
  email: string;
}

export async function updateMember(
  id: string,
  input: UpdateMemberInput,
): Promise<MemberRecord> {
  const { data, error } = await getSupabase()
    .from("members")
    .update({ name: input.name, phone: input.phone, email: input.email })
    .eq("id", id)
    .select("*")
    .single<MemberRow>();

  if (error) throw error;
  return toMemberRecord(data);
}

/** Admin đặt lại mật khẩu về giá trị mặc định — bắt khách đổi lại ở lần đăng nhập kế tiếp. */
export async function resetMemberPassword(id: string, passwordHash: string): Promise<void> {
  const { error } = await getSupabase()
    .from("members")
    .update({ password_hash: passwordHash, must_change_password: true })
    .eq("id", id);

  if (error) throw error;
}

export async function listMembers(): Promise<MemberRecord[]> {
  const { data, error } = await getSupabase()
    .from("members")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<MemberRow[]>();

  if (error) throw error;
  return (data ?? []).map(toMemberRecord);
}
