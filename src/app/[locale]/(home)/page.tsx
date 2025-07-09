import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/about-section";
import { PricingTable } from "@/components/pricing-table";
import { CostCalculator } from "@/components/cost-calculator";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Testimonials } from "@/components/testimonials";
import { ServicesShowcase } from "@/components/services-showcase";
import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { fetchStatic } from "@/api/server-hooks/api";
import { heroSchema } from "@/schemas/hero";



export default async function Home() {
  const data = await fetchStatic("/about", heroSchema, { tags: ["about"] });
  return (
    <main className="min-h-screen flex flex-col w-full items-center justify-center">
      <Hero data={data} />
      <AboutSection description={data.description} />
      <PricingTable />
      <CostCalculator />
      {/* <SpecialOffer /> */}
      <WhyChooseUs />
      {/* <AppDownload /> */}
      <Testimonials />
      <ServicesShowcase />
      <ContactForm />
      <Faq />
    </main>
  );
}
