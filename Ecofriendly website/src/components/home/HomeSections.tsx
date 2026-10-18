"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ShieldCheck, Recycle, CheckCircle2, ChevronRight, Plus, Minus, ArrowRight } from "lucide-react";
import { useState } from "react";

export function Hero() {
  return (
    <section className="relative w-full h-[85vh] bg-beige flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/hero.jpg" 
          alt="Premium bagasse plates and bowls on a linen table" 
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/20 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-center md:text-left flex flex-col md:items-start items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ivory/15 backdrop-blur-sm border border-ivory/30 text-ivory text-xs font-medium tracking-widest uppercase mb-6">
            <span className="text-gold">✦</span> GOODNESS BEYOND WASTE
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-7xl text-ivory font-medium tracking-tight mb-6 text-balance leading-[1.1]">
            Because Every Leftover<br />Deserves a Purpose.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-ivory/90 mb-10 max-w-2xl text-balance font-light leading-relaxed">
            Thoughtfully crafted 100% sugarcane bagasse tableware and sustainable food packaging — better for your table, better by nature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link 
              href="/collections" 
              className="px-8 py-4 bg-forest text-ivory font-medium rounded-sm border border-forest hover:bg-sugarcane transition-all shadow-lg hover:shadow-xl w-full sm:w-auto text-center tracking-wide"
            >
              Explore All Collections
            </Link>
            <Link 
              href="/story" 
              className="px-8 py-4 bg-ivory/95 text-forest font-medium rounded-sm border border-ivory hover:bg-white transition-all shadow-md w-full sm:w-auto text-center tracking-wide"
            >
              Our Sugarcane Story
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ValueStrip() {
  const values = [
    { icon: <Leaf className="w-6 h-6" />, title: "Made from Sugarcane Bagasse" },
    { icon: <CheckCircle2 className="w-6 h-6" />, title: "Designed for Everyday Use" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "A Plant-Based Alternative" },
    { icon: <Recycle className="w-6 h-6" />, title: "Sustainability-Minded Manufacturing" },
  ];

  return (
    <section className="bg-sugarcane py-12 text-ivory border-y border-forest/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {values.map((value, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={idx} 
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="p-3 bg-forest/30 rounded-full">
                {value.icon}
              </div>
              <h3 className="text-sm font-medium tracking-wide">{value.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedCollections() {
  const collections = [
    { name: "Bagasse Plates", desc: "Durable and elegant", image: "/images/plates.jpg", href: "/collections/plates" },
    { name: "Bagasse Bowls", desc: "Perfect for soups and salads", image: "/images/bowls.jpg", href: "/collections/bowls" },
    { name: "Food Containers", desc: "Secure and practical", image: "/images/containers.jpg", href: "/collections/containers" },
    { name: "Cups and Trays", desc: "For everyday essentials", image: "/images/cups.jpg", href: "/collections/cups" },
  ];

  return (
    <section className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-sugarcane font-semibold mb-2 block">
              BAGASSE | BETTER BY NATURE
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-charcoal mb-4">Shop by Category</h2>
            <p className="text-charcoal/70 max-w-xl">Curated collections of premium bagasse products to suit your lifestyle and business needs.</p>
          </div>
          <Link href="/collections" className="text-sugarcane font-medium flex items-center hover:text-forest transition-colors">
            View All Categories <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((item, idx) => (
            <Link key={idx} href={item.href} className="group block">
              <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-md bg-beige border border-beige/60 group-hover:border-gold/50 transition-colors">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-xl text-charcoal mb-1 group-hover:text-forest transition-colors">{item.name}</h3>
              <p className="text-sm text-charcoal/60">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Bestsellers() {
  const products = [
    { id: 1, name: "Premium Classic Plate 9\"", desc: "Pack of 50", price: "450", image: "/images/plates.jpg" },
    { id: 2, name: "Deep Salad Bowl 500ml", desc: "Pack of 50", price: "550", image: "/images/bowls.jpg" },
    { id: 3, name: "Clamshell Container 3-Comp", desc: "Pack of 50", price: "750", image: "/images/containers.jpg" },
    { id: 4, name: "Everyday Cup 250ml", desc: "Pack of 100", price: "350", image: "/images/cups.jpg" },
  ];

  return (
    <section className="py-24 bg-beige/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-sugarcane font-semibold mb-2 block">
            A MORE THOUGHTFUL CHOICE FOR EVERYDAY DINING
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal">Trending Essentials</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col bg-ivory rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-beige/60">
              <div className="relative aspect-square overflow-hidden bg-beige">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                  <button className="bg-ivory text-charcoal px-6 py-2 text-sm font-medium rounded-sm shadow-sm hover:bg-forest hover:text-ivory transition-colors">
                    Quick View
                  </button>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-[10px] tracking-wider uppercase font-medium px-2 py-0.5 rounded-full bg-forest/10 text-forest w-fit mb-2">
                  100% Bagasse · Food Safe
                </span>
                <h3 className="font-medium text-charcoal mb-1">{product.name}</h3>
                <p className="text-sm text-charcoal/60 mb-3">{product.desc}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-serif font-medium text-lg text-charcoal">₹{product.price}</span>
                  <button className="text-sugarcane hover:text-forest p-2">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/shop" className="inline-block px-8 py-3 bg-charcoal text-ivory font-medium rounded-sm hover:bg-forest transition-colors shadow-sm">
            Shop All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export function StorySection() {
  return (
    <section className="py-24 bg-forest text-ivory">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ivory/10 border border-ivory/20 text-gold text-xs font-medium tracking-widest uppercase mb-6">
              SUGRAVA™ ORIGINS
            </div>
            <h2 className="font-serif text-3xl md:text-5xl mb-6">Giving Sugarcane Residue a Real Purpose.</h2>
            <p className="text-ivory/80 text-lg mb-8 leading-relaxed">
              At SUGRAVA™, our journey begins in the sugarcane fields. After the juice is extracted, the remaining fibrous residue—known as bagasse—is often discarded or burned. We transform this abundant agricultural byproduct into premium, practical everyday tableware.
            </p>
            
            <div className="space-y-8">
              {[
                { step: "01", title: "Harvest & Extraction", desc: "Sugarcane is harvested and pressed for juice, leaving behind the fibrous stalks." },
                { step: "02", title: "Pulping & Molding", desc: "The bagasse fibers are cleaned, pulped, and thermoformed into durable shapes." },
                { step: "03", title: "Quality & Delivery", desc: "Finished tableware is rigorously inspected for strength before reaching your dining table." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="font-serif text-xl text-gold font-bold">{item.step}</div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">{item.title}</h3>
                    <p className="text-ivory/70 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[3/4] rounded-md overflow-hidden"
          >
            <Image 
              src="/images/hero.jpg" 
              alt="Sugarcane fields" 
              fill 
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ComparisonSection() {
  return (
    <section className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <h2 className="font-serif text-3xl md:text-5xl text-charcoal mb-6">Why Choose Bagasse?</h2>
        <p className="text-charcoal/70 max-w-2xl mx-auto mb-16">
          A practical, plant-based alternative to conventional disposable plastics, designed for everyday foodservice applications.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Renewable Feedstock", desc: "Made from agricultural residue that regenerates annually, reducing reliance on fossil-based materials." },
            { title: "Practical & Durable", desc: "Sturdy construction suitable for both hot and cold foods, with verified heat resistance for everyday meals." },
            { title: "Responsible End-of-Life", desc: "Designed with the environment in mind. Check product specifications for appropriate disposal guidelines." }
          ].map((item, idx) => (
            <div key={idx} className="bg-beige/30 p-8 rounded-md text-left">
              <h3 className="font-serif text-xl text-charcoal mb-3">{item.title}</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function B2BSection() {
  return (
    <section className="py-24 bg-sage relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("/images/hero.jpg")', backgroundSize: 'cover' }}></div>
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <h2 className="font-serif text-3xl md:text-5xl text-charcoal mb-6">Better Packaging for Businesses That Think Ahead.</h2>
        <p className="text-charcoal/80 text-lg mb-10 max-w-2xl mx-auto">
          We partner with restaurants, cafes, hotels, and caterers to provide premium bulk packaging solutions. Enhance your brand's commitment to sustainability.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/b2b" className="px-8 py-4 bg-charcoal text-ivory font-medium rounded-sm hover:bg-forest transition-colors">
            Request a Wholesale Quote
          </Link>
          <Link href="/contact" className="px-8 py-4 bg-transparent border border-charcoal text-charcoal font-medium rounded-sm hover:bg-charcoal/5 transition-colors">
            Discuss Custom Solutions
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const faqs = [
    { q: "What is sugarcane bagasse?", a: "Bagasse is the dry, pulpy fibrous residue that remains after sugarcane stalks are crushed to extract their juice. Instead of burning or discarding it, we repurpose it into practical tableware." },
    { q: "Are the products suitable for hot and cold foods?", a: "Yes, our bagasse products are sturdy and handle both hot and cold foods well. They offer excellent durability for standard foodservice applications." },
    { q: "Are they microwave-safe?", a: "Most of our standard bagasse plates and bowls are microwave-safe for reheating purposes. Please check individual product specifications for verified usage instructions." },
    { q: "Can businesses place bulk orders?", a: "Absolutely. We offer competitive wholesale pricing for restaurants, catering services, and corporate events. Visit our B2B section to request a quote." }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-24 bg-ivory border-t border-beige">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="font-serif text-3xl md:text-5xl text-charcoal mb-12 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-beige rounded-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 flex items-center justify-between bg-beige/10 hover:bg-beige/30 transition-colors text-left"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <span className="font-medium text-charcoal">{faq.q}</span>
                {openIdx === idx ? <Minus className="w-5 h-5 text-charcoal/50" /> : <Plus className="w-5 h-5 text-charcoal/50" />}
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 py-4 bg-white text-charcoal/70 text-sm leading-relaxed border-t border-beige"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
