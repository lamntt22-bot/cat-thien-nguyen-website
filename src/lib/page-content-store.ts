import "server-only";
import { getSupabase } from "@/lib/supabase";

export interface PageSectionItem {
  title: string;
  value?: string;
}

export interface PageSectionRecord {
  slug: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  note?: string;
  image?: string;
  items: PageSectionItem[];
  updatedAt: string;
}

export interface PageSectionInput {
  eyebrow?: string;
  heading?: string;
  body?: string;
  note?: string;
  image?: string;
  items?: PageSectionItem[];
}

interface PageSectionRow {
  slug: string;
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  note: string | null;
  image: string | null;
  items: PageSectionItem[] | null;
  updated_at: string;
}

function toRecord(row: PageSectionRow): PageSectionRecord {
  return {
    slug: row.slug,
    eyebrow: row.eyebrow ?? undefined,
    heading: row.heading ?? undefined,
    body: row.body ?? undefined,
    note: row.note ?? undefined,
    image: row.image ?? undefined,
    items: row.items ?? [],
    updatedAt: row.updated_at,
  };
}

export async function getPageSection(slug: string): Promise<PageSectionRecord | null> {
  const { data, error } = await getSupabase()
    .from("page_sections")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<PageSectionRow>();

  if (error) throw error;
  return data ? toRecord(data) : null;
}

export async function getPageSections(slugs: string[]): Promise<Record<string, PageSectionRecord>> {
  if (slugs.length === 0) return {};
  const { data, error } = await getSupabase()
    .from("page_sections")
    .select("*")
    .in("slug", slugs)
    .returns<PageSectionRow[]>();

  if (error) throw error;
  const out: Record<string, PageSectionRecord> = {};
  for (const row of data ?? []) out[row.slug] = toRecord(row);
  return out;
}

export async function upsertPageSection(
  slug: string,
  input: PageSectionInput,
): Promise<PageSectionRecord> {
  const { data, error } = await getSupabase()
    .from("page_sections")
    .upsert(
      {
        slug,
        eyebrow: input.eyebrow ?? null,
        heading: input.heading ?? null,
        body: input.body ?? null,
        note: input.note ?? null,
        image: input.image ?? null,
        items: input.items ?? [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    )
    .select("*")
    .single<PageSectionRow>();

  if (error) throw error;
  return toRecord(data);
}
