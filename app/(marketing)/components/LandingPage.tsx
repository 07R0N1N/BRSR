import AboutSection from "./AboutSection";
import CTA from "./CTA";
import FAQSection from "./FAQSection";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import HowSection from "./HowSection";
import QuoteSection from "./QuoteSection";
import Stats from "./Stats";
import ToolsSection from "./ToolsSection";
import WhoSection from "./WhoSection";
import WhySection from "./WhySection";

/**
 * Public marketing landing. Rendered from app/page.tsx for unauthenticated visitors.
 * Not a separate route — kept as a component so "/" owns both guest UI and auth redirects.
 */
export default function LandingPage() {
  return (
    // Smooth scroll + scroll-padding for anchor links live on <html> in the root
    // layout — this div isn't the scrolling element, so those classes had no effect here.
    <div className="overflow-x-hidden bg-white text-[17px] leading-[1.65] text-[#0d1526] antialiased">
      <Header />
      <main>
        <Hero />
        <Stats />
        <AboutSection />
        <ToolsSection />
        <WhySection />
        <HowSection />
        <WhoSection />
        <QuoteSection />
        <FAQSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
