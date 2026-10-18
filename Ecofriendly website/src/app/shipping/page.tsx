import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function GenericTextPage() {
  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 text-charcoal flex-grow">
        <h1 className="font-serif text-4xl mb-8">Shipping & Returns</h1>
        <div className="prose prose-sm prose-stone text-charcoal/80">
          <h3 className="font-serif text-xl mt-6 mb-2">Shipping Policy</h3>
          <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
          <p>Standard shipping usually takes 3-5 business days. Bulk or B2B orders may require 7-10 days depending on the volume.</p>
          
          <h3 className="font-serif text-xl mt-6 mb-2">Return Policy</h3>
          <p>We accept returns up to 14 days after delivery, if the item is unused and in its original condition, and we will refund the full order amount minus the shipping costs for the return.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
