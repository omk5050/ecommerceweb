import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest text-beige">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-ivory mb-4 block">
              EARTHFORM
            </Link>
            <p className="text-sm text-beige/80 max-w-sm mb-6 leading-relaxed">
              From Sugarcane Waste to a Better Tomorrow. Thoughtfully crafted bagasse products designed for everyday use.
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
          <p>© 2026 EARTHFORM. All rights reserved.</p>
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
