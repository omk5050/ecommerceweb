import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Hero, 
  ValueStrip, 
  FeaturedCollections, 
  Bestsellers, 
  StorySection, 
  ComparisonSection, 
  B2BSection, 
  FAQ 
} from "@/components/home/HomeSections";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-ivory">
      <Navbar />
      <Hero />
      <ValueStrip />
      <FeaturedCollections />
      <Bestsellers />
      <StorySection />
      <ComparisonSection />
      <B2BSection />
      <FAQ />
      <Footer />
    </main>
  );
}
