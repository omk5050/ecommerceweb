import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SustainabilityPage() {
  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 text-charcoal flex-grow">
        <h1 className="font-serif text-4xl md:text-5xl mb-8">Sustainability Impact</h1>
        <p className="text-lg leading-relaxed mb-8">
          At SUGRAVA™, sustainability is not just a buzzword—it is the foundation of our entire manufacturing and operational philosophy. We are dedicated to providing transparency regarding the environmental footprint of our products.
        </p>
        
        <div className="bg-sage p-8 rounded-md text-forest mb-12">
          <h2 className="font-serif text-2xl mb-4">Our Impact Metrics (Year to Date)</h2>
          <ul className="space-y-4">
            <li className="flex justify-between items-center border-b border-forest/20 pb-2">
              <span className="font-medium">Quantity of bagasse utilized:</span>
              <span className="font-serif text-xl">120+ Tons</span>
            </li>
            <li className="flex justify-between items-center border-b border-forest/20 pb-2">
              <span className="font-medium">Products supplied:</span>
              <span className="font-serif text-xl">2.5M+</span>
            </li>
            <li className="flex justify-between items-center border-b border-forest/20 pb-2">
              <span className="font-medium">Business customers served:</span>
              <span className="font-serif text-xl">350+</span>
            </li>
          </ul>
        </div>
        
        <h2 className="font-serif text-3xl mb-6">End of Life Responsibility</h2>
        <p className="text-lg leading-relaxed mb-6">
          Our products are made entirely from natural fibers, meaning they are inherently compostable under the right conditions. In commercial composting facilities, bagasse breaks down efficiently, returning organic matter to the soil. We encourage all our partners and customers to dispose of these products responsibly, aligning with local municipal guidelines.
        </p>
      </div>
      <Footer />
    </main>
  );
}
