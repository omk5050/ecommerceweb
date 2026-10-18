import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export default function StoryPage() {
  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      
      <div className="relative w-full h-[60vh] bg-forest">
        <Image src="/images/hero.jpg" alt="Nature" fill className="object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl md:text-7xl text-ivory tracking-tight text-center">Nature Provides.<br/>We Reimagine.</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 text-charcoal flex-grow">
        <h2 className="font-serif text-3xl mb-6">Our Origins</h2>
        <p className="text-lg leading-relaxed mb-8">
          The concept for EARTHFORM was born from a simple observation: nature creates elegant solutions to complex problems. When we looked at the agricultural industry, specifically sugarcane farming, we saw an incredible resource being overlooked. After the sweet juice is extracted, fibrous stalks remain. Historically, this "waste" was burned or discarded, releasing carbon back into the atmosphere without serving a second purpose.
        </p>
        
        <p className="text-lg leading-relaxed mb-12">
          We realized that this resilient, natural fiber—bagasse—possessed all the qualities needed for robust packaging: strength, flexibility, and heat resistance. By upcycling this agricultural byproduct, we found a way to create premium, functional tableware while preventing unnecessary waste.
        </p>

        <h2 className="font-serif text-3xl mb-6">Our Mission</h2>
        <p className="text-lg leading-relaxed mb-8">
          Our mission is to help individuals and businesses make more responsible packaging choices without compromising on aesthetics or functionality. We believe that everyday essentials should be crafted thoughtfully, bridging the gap between high-end design and environmental consciousness. 
        </p>
        <p className="text-lg leading-relaxed mb-8">
          Every plate, bowl, and cup we produce is a testament to our commitment to a lighter footprint. By choosing bagasse, you aren't just selecting a container; you are participating in a closed-loop system that respects the Earth's natural cycles.
        </p>
      </div>

      <Footer />
    </main>
  );
}
