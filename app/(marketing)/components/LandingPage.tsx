"use client";

import { useState } from "react";
import AboutSection from "./AboutSection";
import CTA from "./CTA";
import { DemoRequestModal } from "./DemoRequestModal";
import FAQSection from "./FAQSection";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import HowSection from "./HowSection";
import QuoteSection from "./QuoteSection";
import Stats from "./Stats";
import { SuggestToolModal } from "./SuggestToolModal";
import ToolsSection from "./ToolsSection";
import WhoSection from "./WhoSection";
import WhySection from "./WhySection";

/**
 * Public marketing landing. Rendered from app/page.tsx for unauthenticated visitors.
 * Not a separate route — kept as a component so "/" owns both guest UI and auth redirects.
 *
 * Modal open-state is lifted here (the nearest common parent of every CTA)
 * rather than into context: Header, Hero, ToolsSection, CTA, and Footer are
 * all direct children, so one level of prop drilling is simpler than a
 * provider. Demo and suggest each have their own boolean + modal — two
 * independent modals, no shared "mode" flag.
 */
export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const openDemo = () => setDemoOpen(true);
  const openSuggest = () => setSuggestOpen(true);

  return (
    // Smooth scroll + scroll-padding for anchor links live on <html> in the root
    // layout — this div isn't the scrolling element, so those classes had no effect here.
    <div className="overflow-x-hidden bg-white text-[17px] leading-[1.65] text-[#0d1526] antialiased">
      <Header onOpenDemo={openDemo} />
      <main>
        <Hero onOpenDemo={openDemo} />
        <Stats />
        <AboutSection />
        <ToolsSection onOpenDemo={openDemo} onSuggestTool={openSuggest} />
        <WhySection />
        <HowSection />
        <WhoSection />
        <QuoteSection />
        <FAQSection />
        <CTA onOpenDemo={openDemo} />
      </main>
      <Footer onOpenDemo={openDemo} onSuggestTool={openSuggest} />
      <DemoRequestModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <SuggestToolModal open={suggestOpen} onClose={() => setSuggestOpen(false)} />
    </div>
  );
}
