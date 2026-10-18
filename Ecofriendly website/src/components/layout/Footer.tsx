import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-forest text-beige">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-full bg-ivory/10 border border-ivory/20 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                <Image 
                  src="/images/logo.png" 
                  alt="SUGRAVA Logo" 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-wider text-ivory leading-none">
                  SUGRAVA<span className="text-[10px] align-top font-sans font-normal ml-0.5">™</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-sans mt-0.5">
                  Goodness Beyond Waste
                </span>
              </div>
            </Link>
            <p className="text-sm text-beige/85 max-w-sm mb-2 leading-relaxed">
              Because Every Leftover Deserves a Purpose. Thoughtfully crafted 100% sugarcane bagasse tableware designed for everyday dining.
            </p>
            <p className="text-xs text-beige/60 max-w-sm mb-6 leading-relaxed italic">
              A more thoughtful choice for everyday dining.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-beige/80 hover:text-ivory transition-colors font-medium text-sm">
                Instagram
              </a>
              <a href="#" className="text-beige/80 hover:text-ivory transition-colors font-medium text-sm">
                Twitter
              </a>
              <a href="#" className="text-beige/80 hover:text-ivory transition-colors font-medium text-sm">
                Facebook
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg text-ivory mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-sm text-beige/80 hover:text-ivory transition-colors">All Products</Link></li>
              <li><Link href="/collections/plates" className="text-sm text-beige/80 hover:text-ivory transition-colors">Plates & Bowls</Link></li>
              <li><Link href="/collections/containers" className="text-sm text-beige/80 hover:text-ivory transition-colors">Containers</Link></li>
              <li><Link href="/collections/cups" className="text-sm text-beige/80 hover:text-ivory transition-colors">Cups & Trays</Link></li>
              <li><Link href="/b2b" className="text-sm text-beige/80 hover:text-ivory transition-colors">Bulk & B2B Orders</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg text-ivory mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/story" className="text-sm text-beige/80 hover:text-ivory transition-colors">Our Story</Link></li>
              <li><Link href="/sustainability" className="text-sm text-beige/80 hover:text-ivory transition-colors">Sustainability</Link></li>
              <li><Link href="/materials" className="text-sm text-beige/80 hover:text-ivory transition-colors">Materials</Link></li>
              <li><Link href="/contact" className="text-sm text-beige/80 hover:text-ivory transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-sm text-beige/80 hover:text-ivory transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg text-ivory mb-4">Newsletter</h3>
            <p className="text-sm text-beige/80 mb-4">
              Thoughtful Products. Better Habits. Occasional Updates.
            </p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-transparent border border-beige/30 rounded-md px-4 py-2 text-sm text-ivory placeholder:text-beige/50 focus:outline-none focus:border-ivory transition-colors"
              />
              <button type="submit" className="bg-ivory text-forest font-medium text-sm py-2 rounded-md hover:bg-beige transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-beige/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-beige/60">
          <p>© 2026 SUGRAVA™. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ivory transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ivory transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-ivory transition-colors">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
