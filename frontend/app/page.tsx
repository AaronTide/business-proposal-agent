import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero, { HowItWorks } from "@/components/Hero";
import ProposalWorkspace from "@/components/ProposalWorkspace";

export default function Home() {
  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,_#ecfdf5_0%,_#fafafa_45%,_#ffffff_100%)]">
      <Header />
      <main className="flex-1">
        <Hero />
        <ProposalWorkspace />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
