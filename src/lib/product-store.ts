import "server-only";
import { getSupabase } from "@/lib/supabase";

export type ProductCategory = "tra-dong-y" | "ngoc-am" | "bach";

export interface ProductRecord {
  id: string;
  slug: string;
  category: ProductCategory;
  name: string;
  description: string;
  contentDetail?: string;
  price: string;
  priceAmount?: number;
  badge?: string;
  cbmp?: string;
  image?: string;
  feedbackVideos: string[];
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  slug: string;
  category: ProductCategory;
  name: string;
  description: string;
  contentDetail?: string;
  price: string;
  priceAmount?: number;
  badge?: string;
  cbmp?: string;
  image?: string;
  feedbackVideos?: string[];
  published?: boolean;
  sortOrder?: number;
}

interface ProductRow {
  id: string;
  slug: string;
  category: string;
  name: string;
  description: string;
  content_detail: string | null;
  price: string;
  price_amount: number | null;
  badge: string | null;
  cbmp: string | null;
  image: string | null;
  feedback_videos: string[] | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function toRecord(row: ProductRow): ProductRecord {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category as ProductCategory,
    name: row.name,
    description: row.description,
    contentDetail: row.content_detail ?? undefined,
    price: row.price,
    priceAmount: row.price_amount ?? undefined,
    badge: row.badge ?? undefined,
    cbmp: row.cbmp ?? undefined,
    image: row.image ?? undefined,
    feedbackVideos: row.feedback_videos ?? [],
    published: row.published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listProducts(options?: { onlyPublished?: boolean }): Promise<ProductRecord[]> {
  let query = getSupabase().from("products").select("*");
  if (options?.onlyPublished) query = query.eq("published", true);

  const { data, error } = await query
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true })
    .returns<ProductRow[]>();

  if (error) throw error;
  return (data ?? []).map(toRecord);
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  const { data, error } = await getSupabase()
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle<ProductRow>();

  if (error) throw error;
  return data ? toRecord(data) : null;
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const { data, error } = await getSupabase()
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<ProductRow>();

  if (error) throw error;
  return data ? toRecord(data) : null;
}

export async function getProductsByIds(ids: string[]): Promise<ProductRecord[]> {
  if (ids.length === 0) return [];
  const { data, error } = await getSupabase()
    .from("products")
    .select("*")
    .in("id", ids)
    .returns<ProductRow[]>();

  if (error) throw error;
  return (data ?? []).map(toRecord);
}

export async function createProduct(input: ProductInput): Promise<ProductRecord> {
  const { data, error } = await getSupabase()
    .from("products")
    .insert({
      slug: input.slug,
      category: input.category,
      name: input.name,
      description: input.description,
      content_detail: input.contentDetail ?? null,
      feedback_videos: input.feedbackVideos ?? [],
      published: input.published ?? true,
      price: input.price,
      price_amount: input.priceAmount ?? null,
      badge: input.badge ?? null,
      cbmp: input.cbmp ?? null,
      image: input.image ?? null,
      sort_order: input.sortOrder ?? 0,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single<ProductRow>();

  if (error) throw error;
  return toRecord(data);
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<ProductRecord> {
  const { data, error } = await getSupabase()
    .from("products")
    .update({
      slug: input.slug,
      category: input.category,
      name: input.name,
      description: input.description,
      content_detail: input.contentDetail ?? null,
      feedback_videos: input.feedbackVideos ?? [],
      published: input.published ?? true,
      price: input.price,
      price_amount: input.priceAmount ?? null,
      badge: input.badge ?? null,
      cbmp: input.cbmp ?? null,
      image: input.image ?? null,
      sort_order: input.sortOrder ?? 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single<ProductRow>();

  if (error) throw error;
  return toRecord(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await getSupabase().from("products").delete().eq("id", id);
  if (error) throw error;
}
