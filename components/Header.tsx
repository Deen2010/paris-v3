'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Top banner */}
      <div className="bg-charcoal text-cream text-center py-2.5 px-4 text-[11px] tracking-[0.25em] uppercase font-body font-medium">
        <span className="opacity-60">Freshe Klamotten — </span>
        <a
          href="https://instagram.com/bigclothingmainz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blush hover:text-cream transition-colors duration-200"
        >
          DM @bigclothingmainz ↗
        </a>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 bg-cream border-b border-charcoal/15 transition-shadow duration-300 ${
          scrolled ? 'shadow-md shadow-charcoal/8' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-baseline gap-2 group">
              <span className="font-display text-2xl font-semibold tracking-[0.2em] text-charcoal transition-colors group-hover:text-blush duration-300">
                BIG
              </span>
              <span className="text-blush font-display italic text-2xl font-medium tracking-[0.05em] transition-colors group-hover:text-charcoal duration-300">
                clothing
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-[11px] tracking-[0.25em] uppercase text-charcoal/70 hover:text-charcoal transition-colors duration-200 font-medium"
              >
                Collection
              </Link>
              <a
                href="https://instagram.com/bigclothingmainz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-charcoal text-cream px-4 py-2 text-[11px] tracking-[0.25em] uppercase hover:bg-blush transition-colors duration-300 font-medium"
              >
                <InstagramIcon />
                Instagram
              </a>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-charcoal p-1 transition-transform duration-200 active:scale-90"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-charcoal/15 bg-cream py-4 px-4 slide-down">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center text-sm text-charcoal hover:text-blush transition-colors py-2 uppercase tracking-widest font-body"
            >
              Collection
            </Link>
            <a
              href="https://instagram.com/bigclothingmainz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-charcoal hover:text-blush transition-colors py-2"
            >
              <InstagramIcon />
              @bigclothingmainz
            </a>
          </div>
        )}
      </header>
    </>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
