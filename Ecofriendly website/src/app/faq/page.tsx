import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function GenericPage() {
  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 text-charcoal flex-grow">
        <h1 className="font-serif text-4xl md:text-5xl mb-8">Frequently Asked Questions</h1>
        <div className="space-y-8">
          <div>
            <h3 className="font-serif text-xl mb-2">What is sugarcane bagasse?</h3>
            <p className="text-charcoal/70">Bagasse is the dry, pulpy fibrous residue that remains after sugarcane stalks are crushed to extract their juice. Instead of burning or discarding it, we repurpose it into practical tableware.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl mb-2">Are the products suitable for hot and cold foods?</h3>
            <p className="text-charcoal/70">Yes, our bagasse products are sturdy and handle both hot and cold foods well. They offer excellent durability for standard foodservice applications.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl mb-2">Are they microwave-safe?</h3>
            <p className="text-charcoal/70">Most of our standard bagasse plates and bowls are microwave-safe for reheating purposes. Please check individual product specifications for verified usage instructions.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
