"use client";

import { useState, useEffect, use, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronRight, Minus, Plus, Heart, Check, ShieldCheck, Leaf, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getApiBaseUrl } from "@/lib/apiConfig";

function ProductContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [packSize, setPackSize] = useState("50");
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    fetch(`${getApiBaseUrl()}/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        const prod = data?.data || data;
        if (prod && !prod.error) {
          setProduct(prod);
          setMainImage(prod.image || "/images/hero.jpg");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [productId]);

  const handleBuyNow = async () => {
    setPurchasing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Demo User",
          customerEmail: "demo@example.com",
          address: "123 Green Way, Earth",
          items: [{ productId: product.id, quantity, packSize }],
          totalAmount: product.price * quantity
        })
      });
      const data = await res.json();
      if (data.success) {
        setPurchaseSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
    setPurchasing(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ivory">
        <Loader2 className="w-12 h-12 text-forest animate-spin" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col bg-ivory">
        <Navbar />
        <div className="flex-grow flex items-center justify-center font-serif text-2xl text-charcoal">
          Product not found.
        </div>
        <Footer />
      </main>
    );
  }

  const images = (product?.image ? [product.image] : ["/images/hero.jpg"]).filter(Boolean);

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      
      <div className="bg-ivory py-4 border-b border-beige">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center text-xs text-charcoal/60">
          <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <Link href="/collections" className="hover:text-charcoal transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <span className="text-charcoal font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          <div className="flex flex-col gap-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square w-full rounded-md overflow-hidden bg-beige"
            >
              <Image src={mainImage || product.image} alt={product.name} fill className="object-cover" />
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`relative w-20 h-20 md:w-24 md:h-24 rounded-sm overflow-hidden flex-shrink-0 border-2 transition-colors ${mainImage === img ? 'border-forest' : 'border-transparent'}`}
                  >
                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-8">
              <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-cocoa bg-beige/60 px-3 py-1 rounded-full mb-3 border border-cocoa/20">
                100% Bagasse · Better by Nature
              </span>
              <h1 className="font-serif text-3xl md:text-5xl text-charcoal mb-4">{product.name}</h1>
              <p className="font-serif text-2xl text-charcoal font-medium mb-6">₹{product.price}</p>
              <p className="text-charcoal/70 leading-relaxed mb-6">
                {product.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-charcoal/80 mb-8 pb-8 border-b border-beige">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-sugarcane" /> Verified Food Safe</div>
                <div className="flex items-center gap-2"><Leaf className="w-4 h-4 text-sugarcane" /> Plant-Based Material</div>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">Pack Size</label>
                <div className="flex gap-3">
                  {["50", "250", "1000"].map((size) => (
                    <button 
                      key={size}
                      onClick={() => setPackSize(size)}
                      className={`px-6 py-2 rounded-sm border text-sm font-medium transition-all ${
                        packSize === size 
                          ? 'border-forest bg-forest text-ivory' 
                          : 'border-beige text-charcoal hover:border-forest/50'
                      }`}
                    >
                      {size} pcs
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-beige rounded-sm">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-charcoal/60 hover:text-charcoal transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-charcoal/60 hover:text-charcoal transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-forest font-medium flex items-center gap-1">
                    <Check className="w-4 h-4" /> In Stock
                  </span>
                </div>
              </div>
            </div>

            {purchaseSuccess ? (
              <div className="bg-sugarcane/20 border border-sugarcane text-sugarcane p-4 rounded-md mb-12 flex items-center gap-3">
                <Check className="w-5 h-5" />
                <span className="font-medium">Order placed successfully! Redirecting...</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="flex-1 bg-charcoal text-ivory font-medium py-4 rounded-sm hover:bg-forest transition-colors shadow-sm">
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={purchasing}
                  className="flex-1 bg-sugarcane text-ivory font-medium py-4 rounded-sm hover:bg-forest transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {purchasing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {purchasing ? "Processing..." : "Buy Now"}
                </button>
                <button className="px-4 border border-beige rounded-sm flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:border-charcoal/30 transition-all">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="border-t border-beige">
              <div className="py-4 border-b border-beige">
                <h3 className="font-medium text-charcoal mb-4">Product Specifications</h3>
                <ul className="space-y-3 text-sm text-charcoal/70">
                  <li className="flex"><span className="w-1/3 font-medium">Dimensions:</span> <span className="w-2/3">{product.dimensions}</span></li>
                  <li className="flex"><span className="w-1/3 font-medium">Material:</span> <span className="w-2/3">{product.material}</span></li>
                  <li className="flex"><span className="w-1/3 font-medium">Capacity:</span> <span className="w-2/3">{product.capacity}</span></li>
                  <li className="flex"><span className="w-1/3 font-medium">Disposal:</span> <span className="w-2/3">{product.compostability}</span></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-ivory">
          <Loader2 className="w-12 h-12 text-forest animate-spin" />
        </main>
      }
    >
      <ProductContent params={params} />
    </Suspense>
  );
}
