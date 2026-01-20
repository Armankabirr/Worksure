import Header from "@/components/Header";
import PremiumHero from "@/components/PremiumHero";
import PremiumServices from "@/components/PremiumServices";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import SocialProof from "@/components/SocialProof";
import SpecialHighlight from "@/components/SpecialHighlight";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="home">
        <PremiumHero />
        <PremiumServices />
        <WhyChooseUs />
        <HowItWorks />
        <SocialProof />
        <SpecialHighlight />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;