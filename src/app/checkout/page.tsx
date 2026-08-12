import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/session";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login?next=/checkout");

  return (
    <main className="min-h-[70vh] bg-cream-100 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-maroon-900">Thanh toán</h1>
        <CheckoutForm
          defaultName={member.name}
          defaultPhone={member.phone}
        />
      </div>
    </main>
  );
}
