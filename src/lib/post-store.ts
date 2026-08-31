import "server-only";
import { getSupabase } from "@/lib/supabase";

export type PostCategory = "thong-bao" | "tin-tuc";
export type PostMediaType = "image" | "video";

export interface PostMedia {
  type: PostMediaType;
  url: string;
}

export interface PostRecord {
  id: string;
  slug: string;
  category: PostCategory;
  title: string;
  excerpt: string;
  content: string;
  media: PostMedia[];
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostInput {
  slug: string;
  category: PostCategory;
  title: string;
  excerpt: string;
  content: string;
  media?: PostMedia[];
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  published?: boolean;
  publishedAt?: string;
}

interface PostRow {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  media: PostMedia[] | null;
  image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

function toRecord(row: PostRow): PostRecord {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category as PostCategory,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    media: row.media ?? [],
    image: row.image ?? undefined,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    seoKeywords: row.seo_keywords ?? undefined,
    published: row.published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPosts(options?: {
  category?: PostCategory;
  onlyPublished?: boolean;
}): Promise<PostRecord[]> {
  let query = getSupabase().from("posts").select("*");
  if (options?.category) query = query.eq("category", options.category);
  if (options?.onlyPublished) query = query.eq("published", true);

  const { data, error } = await query
    .order("published_at", { ascending: false })
    .returns<PostRow[]>();

  if (error) throw error;
  return (data ?? []).map(toRecord);
}

export async function getPostById(id: string): Promise<PostRecord | null> {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle<PostRow>();

  if (error) throw error;
  return data ? toRecord(data) : null;
}

export async function getPostBySlug(
  category: PostCategory,
  slug: string,
): Promise<PostRecord | null> {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .eq("category", category)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle<PostRow>();

  if (error) throw error;
  return data ? toRecord(data) : null;
}

export async function createPost(input: PostInput): Promise<PostRecord> {
  const { data, error } = await getSupabase()
    .from("posts")
    .insert({
      slug: input.slug,
      category: input.category,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      media: input.media ?? [],
      image: input.image ?? null,
      seo_title: input.seoTitle ?? null,
      seo_description: input.seoDescription ?? null,
      seo_keywords: input.seoKeywords ?? null,
      published: input.published ?? true,
      published_at: input.publishedAt ?? new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single<PostRow>();

  if (error) throw error;
  return toRecord(data);
}

export async function updatePost(id: string, input: PostInput): Promise<PostRecord> {
  const { data, error } = await getSupabase()
    .from("posts")
    .update({
      slug: input.slug,
      category: input.category,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      media: input.media ?? [],
      image: input.image ?? null,
      seo_title: input.seoTitle ?? null,
      seo_description: input.seoDescription ?? null,
      seo_keywords: input.seoKeywords ?? null,
      published: input.published ?? true,
      published_at: input.publishedAt ?? new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single<PostRow>();

  if (error) throw error;
  return toRecord(data);
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await getSupabase().from("posts").delete().eq("id", id);
  if (error) throw error;
}
