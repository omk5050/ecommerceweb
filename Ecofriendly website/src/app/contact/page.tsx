import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 text-charcoal flex-grow">
        <h1 className="font-serif text-4xl md:text-5xl mb-8">Contact Us</h1>
        <p className="text-lg leading-relaxed mb-8">
          Have a question about our products, an existing order, or a potential partnership? We'd love to hear from you.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
              <input type="text" className="w-full px-4 py-2 border border-beige rounded-sm focus:outline-none focus:border-forest" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-beige rounded-sm focus:outline-none focus:border-forest" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Message</label>
              <textarea rows={5} className="w-full px-4 py-2 border border-beige rounded-sm focus:outline-none focus:border-forest"></textarea>
            </div>
            <button type="button" className="w-full py-4 bg-charcoal text-ivory font-medium rounded-sm hover:bg-forest transition-colors">
              Send Message
            </button>
          </form>
          
          <div>
            <h3 className="font-serif text-xl mb-4">Direct Contact</h3>
            <p className="text-sm text-charcoal/70 mb-2">Email: hello@sugrava.com</p>
            <p className="text-sm text-charcoal/70 mb-6">Phone: +91 123 456 7890</p>
            
            <h3 className="font-serif text-xl mb-4">Office</h3>
            <p className="text-sm text-charcoal/70 leading-relaxed">
              123 Sustainability Ave<br/>
              Green District, Nature City<br/>
              Earth, 000000
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
