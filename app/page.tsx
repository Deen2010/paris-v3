'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import { supabase, getProductSizes, sortSizes, type Product } from '@/lib/supabase';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  }

  const categories = [...new Set(products.map((p) => p.category))].filter(Boolean);
  const sizes = sortSizes([
    ...new Set(products.flatMap((p) => getProductSizes(p))),
  ]);

  const filtered = products
    .filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedSize) {
        const productSizes = getProductSizes(p);
        if (!productSizes.includes(selectedSize)) return false;
      }
      if (selectedGender && p.gender !== selectedGender) return false;
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'price_asc') return a.price - b.price;
      if (sortOrder === 'price_desc') return b.price - a.price;
      return 0;
    });

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-cream page-enter">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <div className="mb-10 border-b border-charcoal/15 pb-10">
          <p className="font-body text-[11px] tracking-[0.4em] uppercase text-blush mb-3 font-semibold">
            Big Clothing Mainz — Collection
          </p>
          <h1 className="font-display text-6xl sm:text-8xl font-medium text-charcoal leading-[0.9] tracking-tight">
            Freshe
            <br />
            <span className="italic font-normal text-blush">Klamotten.</span>
          </h1>
          <p className="mt-6 font-body text-sm text-muted max-w-md leading-relaxed">
            Freshe Klamotten für Freshe Leute. Kein Webshop — Anfragen nur per DM.
          </p>
        </div>

        {/* Filters */}
        <FilterBar
          categories={categories}
          sizes={sizes}
          selectedCategory={selectedCategory}
          selectedSize={selectedSize}
          selectedGender={selectedGender}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          onCategoryChange={setSelectedCategory}
          onSizeChange={setSelectedSize}
          onGenderChange={setSelectedGender}
          onSearchChange={setSearchQuery}
          onSortChange={setSortOrder}
        />

        {/* Count */}
        <div className="mb-6 flex items-center justify-between border-t border-charcoal/10 pt-4">
          <p className="text-xs text-muted font-body uppercase tracking-widest">
            {loading ? '…' : `${filtered.length} Artikel`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white">
                <div className="aspect-[3/4] skeleton" />
                <div className="p-3 space-y-2">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl font-light text-charcoal/30 mb-2">
              Keine Artikel gefunden
            </p>
            <p className="font-body text-sm text-muted">
              Probiere einen anderen Filter oder eine andere Suche
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((product, index) => (
              <div
                key={product.id}
                className="fade-in-up"
                style={{ animationDelay: `${index * 40}ms`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-charcoal/15 py-10 px-4 bg-cream/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg tracking-[0.2em] text-charcoal/50 font-semibold">
            BIG <span className="italic font-normal">clothing</span>
          </span>
          <a
            href="https://instagram.com/bigclothingmainz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[11px] text-muted hover:text-blush transition-colors duration-200 font-body tracking-[0.25em] uppercase font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            @bigclothingmainz
          </a>
          <p className="text-[11px] text-muted/60 font-body tracking-wider uppercase">
            DM only — Kein Webshop
          </p>
        </div>
      </footer>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 bg-charcoal text-cream flex items-center justify-center hover:bg-blush transition-colors duration-300 back-to-top-enter shadow-lg"
          aria-label="Nach oben"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
