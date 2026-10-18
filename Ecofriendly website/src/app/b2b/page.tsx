"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check } from "lucide-react";
import Image from "next/image";

export default function B2BPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">Wholesale & B2B Solutions</h1>
            <p className="text-charcoal/80 text-lg mb-8 leading-relaxed">
              We partner with restaurants, cafes, hotels, catering businesses, and corporate buyers to provide sustainable packaging solutions at scale.
            </p>
            
            <div className="space-y-6 mb-12">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-sugarcane/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-forest font-bold font-serif">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-charcoal mb-1">Competitive Bulk Pricing</h3>
                  <p className="text-sm text-charcoal/70">Enjoy significant discounts on large volume orders for your business.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-sugarcane/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-forest font-bold font-serif">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-charcoal mb-1">Custom Branding</h3>
                  <p className="text-sm text-charcoal/70">Add your logo and brand messaging to select packaging items.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-sugarcane/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-forest font-bold font-serif">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-charcoal mb-1">Dedicated Account Manager</h3>
                  <p className="text-sm text-charcoal/70">Get personalized support and streamlined reordering processes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-md shadow-sm border border-beige">
            <h2 className="font-serif text-2xl text-charcoal mb-6">Request a Wholesale Quote</h2>
            
            {submitted ? (
              <div className="bg-sugarcane/10 border border-sugarcane text-forest p-6 rounded-md text-center">
                <div className="w-16 h-16 bg-sugarcane text-ivory rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl mb-2">Request Received!</h3>
                <p className="text-sm">Thank you for your interest. A member of our wholesale team will be in touch with you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">First Name</label>
                    <input required type="text" className="w-full px-4 py-2 border border-beige rounded-sm focus:outline-none focus:border-forest" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Last Name</label>
                    <input required type="text" className="w-full px-4 py-2 border border-beige rounded-sm focus:outline-none focus:border-forest" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Company / Business Name</label>
                  <input required type="text" className="w-full px-4 py-2 border border-beige rounded-sm focus:outline-none focus:border-forest" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Email Address</label>
                    <input required type="email" className="w-full px-4 py-2 border border-beige rounded-sm focus:outline-none focus:border-forest" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Phone Number</label>
                    <input type="tel" className="w-full px-4 py-2 border border-beige rounded-sm focus:outline-none focus:border-forest" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Estimated Monthly Volume</label>
                  <select className="w-full px-4 py-2 border border-beige rounded-sm focus:outline-none focus:border-forest bg-white">
                    <option>Less than 1,000 units</option>
                    <option>1,000 - 5,000 units</option>
                    <option>5,000 - 10,000 units</option>
                    <option>10,000+ units</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Additional Details</label>
                  <textarea rows={4} className="w-full px-4 py-2 border border-beige rounded-sm focus:outline-none focus:border-forest"></textarea>
                </div>

                <button type="submit" className="w-full py-4 bg-forest text-ivory font-medium rounded-sm hover:bg-charcoal transition-colors">
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
          
        </div>
      </div>

      <Footer />
    </main>
  );
}
