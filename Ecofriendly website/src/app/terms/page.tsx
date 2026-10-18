import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function GenericTextPage() {
  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 text-charcoal flex-grow">
        <h1 className="font-serif text-4xl mb-8">Terms of Service</h1>
        <div className="prose prose-sm prose-stone text-charcoal/80">
          <p>These Terms of Service govern your use of the EARTHFORM website and all related services.</p>
          <h3 className="font-serif text-xl mt-6 mb-2">General Conditions</h3>
          <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.</p>
          <h3 className="font-serif text-xl mt-6 mb-2">Modifications to the Service and Prices</h3>
          <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service without notice at any time.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
