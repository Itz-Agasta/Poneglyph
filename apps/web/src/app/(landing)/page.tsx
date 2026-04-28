import { HeroSection } from "@/components/landing/hero-section";
import { PartnersSection } from "@/components/landing/partners-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeatureSplitSection } from "@/components/landing/feature-split-section";
import { ValuePropsSection } from "@/components/landing/value-props-section";
import { DataCategories } from "@/components/landing/DataCategories";
import { WorldReachSection } from "@/components/landing/world-reach-section";
import { FaqSection } from "@/components/landing/faq-section";
import { BlogPreviewSection } from "@/components/landing/blog-preview-section";
import { FooterCta } from "@/components/landing/footer-cta";
import { FooterWordmark } from "@/components/landing/footer-wordmark";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#708db8] via-[#a8c1d8] to-[#edf2f8] bg-[length:100%_200%] animate-sky-gradient pointer-events-none" />
      <main className="w-full overflow-x-hidden">
        <HeroSection />
        <PartnersSection />
        <HowItWorksSection />
        <DataCategories />
        <FeatureSplitSection />
        <ValuePropsSection />
        <WorldReachSection />
        <FaqSection />
        <BlogPreviewSection />
        <FooterCta />
        <FooterWordmark />
      </main>
    </>
  );
}
