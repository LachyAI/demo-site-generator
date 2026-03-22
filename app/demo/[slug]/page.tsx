import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDemo } from "@/lib/blob";
import { Navbar } from "@/components/demo/navbar";
import { Hero } from "@/components/demo/hero";
import { TrustBar } from "@/components/demo/trust-bar";
import { Services } from "@/components/demo/services";
import { HowItWorks } from "@/components/demo/how-it-works";
import { Gallery } from "@/components/demo/gallery";
import { Reviews } from "@/components/demo/reviews";
import { About } from "@/components/demo/about";
import { ServiceAreas } from "@/components/demo/service-areas";
import { QuoteForm } from "@/components/demo/quote-form";
import { Footer } from "@/components/demo/footer";
import { ChatWidget } from "@/components/demo/chat-widget";
import { MobileStickyBar } from "@/components/demo/mobile-sticky-bar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = await getDemo(slug);
  if (!config) return { title: "Demo Not Found" };
  return {
    title: `${config.businessName} — ${config.suburb}`,
    description: config.tagline || `Professional handyman services in ${config.suburb}`,
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getDemo(slug);

  if (!config) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar config={config} />
      {/* Add padding-top to account for fixed navbar */}
      <main className="pt-[72px]">
        <Hero config={config} />
        <TrustBar config={config} />
        <Services config={config} />
        <HowItWorks />
        <Gallery config={config} />
        <Reviews config={config} />
        <About config={config} />
        <ServiceAreas config={config} />
        <QuoteForm config={config} />
      </main>
      <Footer config={config} />
      <ChatWidget config={config} />
      <MobileStickyBar config={config} />
    </div>
  );
}
