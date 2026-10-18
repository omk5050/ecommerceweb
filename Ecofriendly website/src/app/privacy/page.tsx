import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function GenericTextPage() {
  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 text-charcoal flex-grow">
        <h1 className="font-serif text-4xl mb-8">Privacy Policy</h1>
        <div className="prose prose-sm prose-stone text-charcoal/80">
          <p>Last updated: October 10, 2026</p>
          <p>At EARTHFORM, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website.</p>
          
          <h3 className="font-serif text-xl mt-6 mb-2">Personal Information We Collect</h3>
          <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
          
          <h3 className="font-serif text-xl mt-6 mb-2">How We Use Your Information</h3>
          <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
