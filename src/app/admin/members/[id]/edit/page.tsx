import { redirect, notFound } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import { findMemberById } from "@/lib/member-store";
import AdminNav from "@/components/AdminNav";
import MemberForm from "@/components/MemberForm";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getCurrentMember();
  if (!admin || admin.role !== "admin") redirect("/login");

  const { id } = await params;
  const memberWithHash = await findMemberById(id);
  if (!memberWithHash) notFound();
  const { passwordHash: _passwordHash, ...member } = memberWithHash;

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminNav email={admin.email} />
      <main className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
        <h1 className="font-display text-xl font-semibold text-maroon-900">
          Sửa thông tin khách hàng — {member.name}
        </h1>
        <div className="mt-5 rounded-2xl border border-gold-500/20 bg-white p-6">
          <MemberForm member={member} />
        </div>
      </main>
    </div>
  );
}
