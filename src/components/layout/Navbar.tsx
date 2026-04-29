"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import { CATALOG_TAXONOMY } from "@/lib/catalog";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "Mobilier", href: "/mobilier", mega: "mobilier" as const },
  { name: "Décoration", href: "/decoration", mega: "decoration" as const },
  { name: "Cuisine domestique", href: "/cuisine-domestique" },
  { name: "Sur Mesure", href: "/sur-mesure" },
  { name: "Espace Client", href: "/suivi" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled ? "glass py-2 shadow-sm" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/daricraft-mark.svg"
            alt="DariCraft logo"
            width={52}
            height={52}
            priority
            unoptimized
            className="h-11 w-auto"
          />
          <span className="text-xl md:text-2xl font-bold tracking-tight text-primary">
            DariCraft<span className="text-secondary">.</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            if (!("mega" in link)) {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-foreground hover:text-secondary transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </Link>
              );
            }

            return (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className="text-sm font-medium text-foreground hover:text-secondary transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </Link>

                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                  <div
                    className={clsx(
                      "bg-card border border-border rounded-2xl shadow-xl p-6 max-h-[70vh] overflow-y-auto",
                      link.mega === "mobilier" ? "w-[min(92vw,960px)]" : "w-[min(92vw,720px)]"
                    )}
                  >
                    {link.mega === "mobilier" ? (
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {CATALOG_TAXONOMY.mobilier.map((section) => (
                          <div key={section.key}>
                            <Link
                              href={`/mobilier?sub=${encodeURIComponent(section.key)}`}
                              className="block text-sm font-semibold text-primary hover:text-secondary transition-colors"
                            >
                              {section.title}
                            </Link>
                            <ul className="mt-3 space-y-2">
                              {section.items.map((item) => (
                                <li key={item.key}>
                                  <Link
                                    href={`/mobilier?sub=${encodeURIComponent(item.key)}`}
                                    className="text-sm text-foreground/80 hover:text-secondary transition-colors"
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <Link
                          href="/decoration"
                          className="block text-sm font-semibold text-primary hover:text-secondary transition-colors"
                        >
                          Décoration
                        </Link>
                        <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
                          {CATALOG_TAXONOMY.decoration[0]?.items.map((item) => (
                            <li key={item.key}>
                              <Link
                                href={`/decoration?sub=${encodeURIComponent(item.key)}`}
                                className="text-sm text-foreground/80 hover:text-secondary transition-colors"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <Link
            href="/devis"
            className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-transform hover:scale-105"
          >
            Devis Gratuit
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-0 bg-background z-40 flex flex-col items-center justify-center space-y-8 md:hidden px-6 py-10 overflow-y-auto"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-light text-foreground hover:text-secondary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/devis"
              className="px-8 py-3 bg-primary text-primary-foreground text-lg rounded-full"
              onClick={() => setIsOpen(false)}
            >
              Demander un devis
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
