import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Endorser from "@/components/Endorser";
import ProductsSection from "@/components/ProductsSection";
import AgentPartnerSection from "@/components/AgentPartnerSection";
import FaqSection from "@/components/FaqSection";
import CtaFooterSection from "@/components/CtaFooterSection";
import { listProducts, type ProductRecord } from "@/lib/product-store";

export default async function Home() {
  let products: ProductRecord[] = [];
  try {
    products = await listProducts();
  } catch (err) {
    console.error("[home] failed to load products", err);
  }

  return (
    <main>
      <Hero />
      <AboutSection />
      <Endorser />
      <WhyChooseUs />
      <ProductsSection products={products} />
      <AgentPartnerSection />
      <FaqSection />
      <CtaFooterSection />
    </main>
  );
}
