"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  "All",
  "Bowls",
  "Plates",
  "Takeaway Boxes",
  "Cups",
  "Cup Lids",
  "Cutlery",
  "Containers",
  "Meal Trays",
] as const;

function CollectionsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (initialCategory) {
      // Find matching category case-insensitively
      const match = CATEGORIES.find(
        (c) => c.toLowerCase() === initialCategory.toLowerCase()
      );
      if (match) {
        setSelectedCategory(match);
      }
    }
  }, [initialCategory]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || [];
        setProducts(list);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: products.length };
    for (const cat of CATEGORIES) {
      if (cat !== "All") {
        map[cat] = products.filter((p) => p.category === cat).length;
      }
    }
    return map;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.size?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Navbar />

      <div className="bg-forest py-14 text-center text-ivory relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ivory/10 border border-ivory/20 text-gold text-xs font-medium tracking-widest uppercase mb-4">
          BAGASSE | BETTER BY NATURE
        </div>
        <h1 className="font-serif text-4xl md:text-5xl mb-3 tracking-tight">
          SUGRAVA™ Collections
        </h1>
        <p className="text-ivory/80 max-w-xl mx-auto text-sm sm:text-base font-light px-4">
          100% certified sugarcane bagasse tableware. Thoughtfully designed for everyday dining, food service, and takeaways.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex-grow w-full">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = counts[cat] ?? 0;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 border ${
                  isActive
                    ? "bg-forest text-ivory border-forest shadow-sm"
                    : "bg-white text-charcoal/80 border-beige hover:border-forest/40 hover:text-charcoal"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                    isActive
                      ? "bg-ivory/20 text-ivory"
                      : "bg-beige text-charcoal/60"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar: Count & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-beige gap-4">
          <div className="text-sm text-charcoal/70">
            Showing <span className="font-semibold text-charcoal">{filteredProducts.length}</span>{" "}
            {selectedCategory === "All" ? "products" : `${selectedCategory.toLowerCase()}`}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, size..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-beige rounded-md text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-forest shadow-sm transition-colors"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-charcoal/50 gap-3">
            <Loader2 className="w-8 h-8 text-forest animate-spin" />
            <span className="text-sm">Loading catalogue...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-beige p-8">
            <p className="font-serif text-xl text-charcoal mb-2">No products found</p>
            <p className="text-sm text-charcoal/60 mb-4">
              Try adjusting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-forest text-ivory rounded-md text-sm hover:bg-forest/90 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
                key={product._id || product.id || idx}
              >
                <Link
                  href={`/product/${product._id || product.id}`}
                  className="group flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-beige/60 hover:border-gold/40"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#6E4638]/5">
                    <Image
                      src={product.image || "/images/hero.jpg"}
                      alt={product.name || "Product"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-ivory/90 backdrop-blur-sm text-forest border border-forest/15">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-serif font-medium text-charcoal text-base mb-1 group-hover:text-forest transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-charcoal/60 mb-3 flex-grow line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="mt-auto pt-2 border-t border-beige/50 flex items-center justify-between">
                      <span className="font-serif font-semibold text-lg text-forest">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-sugarcane group-hover:text-forest font-medium">
                        View Details →
                      </span>
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

export default function CollectionsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-ivory">
          <Loader2 className="w-10 h-10 text-forest animate-spin" />
        </main>
      }
    >
      <CollectionsContent />
    </Suspense>
  );
}
