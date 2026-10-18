"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronRight, Filter, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        setProducts(list);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      
      <div className="bg-forest py-16 text-center text-ivory relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ivory/10 border border-ivory/20 text-gold text-xs font-medium tracking-widest uppercase mb-4">
          BAGASSE | BETTER BY NATURE
        </div>
        <h1 className="font-serif text-4xl md:text-5xl mb-3 tracking-tight">SUGRAVA™ Collections</h1>
        <p className="text-ivory/80 max-w-xl mx-auto text-sm sm:text-base font-light">
          A more thoughtful choice for everyday dining. Discover our complete range of certified food-safe bagasse tableware.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex-grow w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-beige pb-6 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex items-center gap-2 text-charcoal/70 hover:text-charcoal px-4 py-2 border border-beige rounded-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <div className="text-sm text-charcoal/60">{products.length} Products</div>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 bg-beige/20 border border-beige rounded-sm text-sm focus:outline-none focus:border-forest"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-charcoal/50">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                key={product._id || product.id || idx}
              >
                <Link href={`/product/${product._id || product.id}`} className="group flex flex-col h-full bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-square overflow-hidden bg-beige">
                    <Image 
                      src={product.image || "/images/hero.jpg"} 
                      alt={product.name || "Product"} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow border-t border-beige">
                    <h3 className="font-medium text-charcoal mb-1">{product.name}</h3>
                    <p className="text-sm text-charcoal/60 mb-3 flex-grow line-clamp-2">{product.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-serif font-medium text-lg text-charcoal">₹{product.price}</span>
                      <span className="text-sugarcane text-sm font-medium hover:text-forest">View Details</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
