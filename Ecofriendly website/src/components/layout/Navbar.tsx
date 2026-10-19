"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ensure client-side route changes start at scroll position 0
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  const handleNavClick = (href: string) => {
    // If navigation targets an anchor/hash on the SAME page, preserve normal anchor behavior
    if (href.startsWith("#") || (pathname && href.startsWith(`${pathname}#`))) {
      return;
    }
    // For navigation to a different page/route or clicking current page
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/collections" },
    { name: "Our Story", href: "/story" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <div className="bg-forest text-ivory text-center py-2 px-4 text-xs font-medium tracking-wider flex items-center justify-center gap-2">
        <span className="tracking-widest">BAGASSE | BETTER BY NATURE</span>
        <span className="hidden sm:inline text-gold">•</span>
        <span className="hidden sm:inline text-ivory/85">GOODNESS BEYOND WASTE</span>
      </div>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-ivory/95 backdrop-blur-md shadow-sm py-3.5" : "bg-ivory py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-charcoal hover:text-sugarcane transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            scroll={true}
            onClick={() => handleNavClick("/")}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-10 h-10 md:w-11 md:h-11 overflow-hidden rounded-full border border-forest/15 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <Image 
                src="/images/logo.png" 
                alt="SUGRAVA Logo" 
                fill 
                className="object-cover" 
                priority
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif text-2xl md:text-2xl font-bold tracking-wider text-forest leading-none">
                SUGRAVA<span className="text-[10px] align-top font-sans font-normal ml-0.5">™</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-charcoal/60 font-sans mt-0.5">
                Goodness Beyond Waste
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                scroll={true}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-charcoal/80 hover:text-sugarcane transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Showcase CTA: Request a Quote */}
          <div className="flex items-center">
            <Link
              href="/b2b"
              scroll={true}
              onClick={() => handleNavClick("/b2b")}
              className="px-3.5 py-1.5 sm:px-5 sm:py-2 bg-forest text-ivory text-xs sm:text-sm font-medium rounded-full hover:bg-forest/90 transition-all duration-200 shadow-sm hover:shadow tracking-wide whitespace-nowrap"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 bg-ivory flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-beige">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 overflow-hidden rounded-full border border-forest/15 shadow-sm flex-shrink-0">
                  <Image 
                    src="/images/logo.png" 
                    alt="SUGRAVA Logo" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-serif text-2xl font-bold tracking-wider text-forest leading-none">
                    SUGRAVA<span className="text-[10px] align-top font-sans font-normal ml-0.5">™</span>
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-charcoal/60 font-sans mt-0.5">
                    Goodness Beyond Waste
                  </span>
                </div>
              </div>
              <button
                className="text-charcoal"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-6 p-6 flex-grow">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  scroll={true}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNavClick(link.href);
                  }}
                  className="text-2xl font-serif text-charcoal hover:text-sugarcane"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="p-6 border-t border-beige">
              <Link
                href="/b2b"
                scroll={true}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick("/b2b");
                }}
                className="w-full inline-flex items-center justify-center py-3 px-4 bg-forest text-ivory text-sm font-medium rounded-md hover:bg-forest/90 transition-colors shadow-sm text-center"
              >
                Request a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
