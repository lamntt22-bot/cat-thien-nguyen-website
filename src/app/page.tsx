import Hero from "@/components/Hero";
import TrialRegistrationSection from "@/components/TrialRegistrationSection";
import AboutSection from "@/components/AboutSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Endorser from "@/components/Endorser";
import JourneySection from "@/components/JourneySection";
import ProductsSection from "@/components/ProductsSection";
import AgentPartnerSection from "@/components/AgentPartnerSection";
import FaqSection from "@/components/FaqSection";
import CtaFooterSection from "@/components/CtaFooterSection";
import { listProducts, type ProductRecord } from "@/lib/product-store";
import { getPageSections } from "@/lib/page-content-store";

export default async function Home() {
  let products: ProductRecord[] = [];
  try {
    products = await listProducts({ onlyPublished: true });
  } catch (err) {
    console.error("[home] failed to load products", err);
  }

  let trialProducts: ProductRecord[] = [];
  try {
    trialProducts = await listProducts({ onlyPublished: true, onlyTrialAvailable: true });
  } catch (err) {
    console.error("[home] failed to load trial products", err);
  }

  let sections: Awaited<ReturnType<typeof getPageSections>> = {};
  try {
    sections = await getPageSections([
      "dai-ly-doi-tac",
      "dai-ly-doi-tac-dai-ly",
      "dai-ly-doi-tac-doi-tac",
    ]);
  } catch (err) {
    console.error("[home] failed to load page sections", err);
  }

  return (
    <main>
      <Hero />
      <TrialRegistrationSection products={trialProducts} />
      <AboutSection />
      <Endorser />
      <JourneySection />
      <WhyChooseUs />
      <ProductsSection products={products} />
      <AgentPartnerSection
        content={{
          intro: sections["dai-ly-doi-tac"],
          daily: sections["dai-ly-doi-tac-dai-ly"],
          partner: sections["dai-ly-doi-tac-doi-tac"],
        }}
      />
      <FaqSection />
      <CtaFooterSection />
    </main>
  );
}
