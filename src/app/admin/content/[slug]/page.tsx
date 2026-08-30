import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { getPageSection } from "@/lib/page-content-store";
import { getPageSectionConfig } from "@/lib/page-content-config";
import AdminNav from "@/components/AdminNav";
import PageContentForm from "@/components/PageContentForm";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const admin = await getCurrentMember();
  if (!admin || admin.role !== "admin") redirect("/login");

  const { slug } = await params;
  const config = getPageSectionConfig(slug);
  if (!config) notFound();

  const section = await getPageSection(slug);

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={admin.email} />
      <main className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
        <Link href="/admin/content" className="text-sm font-semibold text-maroon-800 hover:underline">
          ← Nội dung trang
        </Link>
        <h1 className="mt-2 font-display text-xl font-semibold text-maroon-900">{config.label}</h1>
        <div className="mt-5 rounded-2xl border border-gold-500/20 bg-white p-6">
          <PageContentForm config={config} section={section} />
        </div>
      </main>
    </div>
  );
}
