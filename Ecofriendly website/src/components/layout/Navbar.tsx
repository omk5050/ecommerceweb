"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <Link href="/" className="flex items-center gap-2.5 group">
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
                className="text-sm font-medium text-charcoal/80 hover:text-sugarcane transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button className="text-charcoal hover:text-sugarcane transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden sm:block text-charcoal hover:text-sugarcane transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="text-charcoal hover:text-sugarcane transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-sugarcane text-ivory text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
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
            <nav className="flex flex-col gap-6 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-serif text-charcoal hover:text-sugarcane"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
