'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { supabase, getDiscountPercent, formatEuro, getProductSizes, type Product } from '@/lib/supabase';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (params.id) fetchProduct(params.id as string);
  }, [params.id]);

  useEffect(() => {
    if (product) {
      const favorites = JSON.parse(localStorage.getItem('mf-favorites') || '[]');
      setLiked(favorites.includes(product.id));
    }
  }, [product]);

  async function fetchProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) setProduct(data as Product);
    setLoading(false);
  }

  const toggleLike = () => {
    if (!product) return;
    const favorites = JSON.parse(localStorage.getItem('mf-favorites') || '[]');
    let newFavorites;
    if (liked) {
      newFavorites = favorites.filter((id: string) => id !== product.id);
    } else {
      newFavorites = [...favorites, product.id];
    }
    localStorage.setItem('mf-favorites', JSON.stringify(newFavorites));
    setLiked(!liked);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  const statusDot: Record<string, string> = {
    verfügbar: 'bg-sage',
    reserviert: 'bg-blush',
    verkauft: 'bg-charcoal',
  };
  const statusLabel: Record<string, string> = {
    verfügbar: 'Verfügbar',
    reserviert: 'Reserviert',
    verkauft: 'Verkauft',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-charcoal/5" />
            <div className="space-y-4">
              <div className="h-8 bg-charcoal/5 rounded w-3/4" />
              <div className="h-6 bg-charcoal/5 rounded w-1/4" />
              <div className="h-24 bg-charcoal/5 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="text-center py-24">
          <p className="font-display text-3xl font-light text-charcoal/30">Produkt nicht gefunden</p>
          <Link href="/" className="mt-4 inline-block text-sm text-blush hover:underline">
            Zurück zur Galerie
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent = getDiscountPercent(product);
  const hasDiscount = discountPercent > 0;
  const productSizes = getProductSizes(product);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[11px] text-muted hover:text-charcoal transition-colors mb-10 uppercase tracking-[0.25em] font-body font-medium"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Zurück
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-cream overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 55vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted/20">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Discount badge floating on image */}
            {hasDiscount && (
              <div className="absolute top-4 left-4 px-3 py-1.5 text-[11px] tracking-[0.2em] uppercase font-body bg-blush text-cream font-semibold">
                −{discountPercent}%
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col pt-2">
            {/* Eyebrow */}
            <p className="text-[11px] tracking-[0.3em] uppercase text-muted font-body font-medium mb-4">
              {product.category} <span className="text-muted/50 mx-1">/</span> {product.gender}
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-charcoal leading-[0.95] mb-6 tracking-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 flex-wrap">
              <p className={`font-display text-3xl sm:text-4xl font-medium ${hasDiscount ? 'text-blush' : 'text-charcoal'}`}>
                {formatEuro(product.price)}
              </p>
              {hasDiscount && product.original_price && (
                <p className="font-body text-base text-muted line-through">
                  {formatEuro(product.original_price)}
                </p>
              )}
            </div>

            {/* Status pill */}
            <div className="flex items-center gap-2 mb-8">
              <span className={`w-2 h-2 rounded-full ${statusDot[product.status]}`} />
              <span className="text-[11px] tracking-[0.25em] uppercase font-body font-medium text-charcoal/80">
                {statusLabel[product.status]}
              </span>
            </div>

            {product.description && (
              <p className="font-body text-[15px] text-charcoal/70 leading-relaxed mb-10 max-w-md">
                {product.description}
              </p>
            )}

            {/* Details */}
            <div className="border-t border-charcoal/15 pt-6 mb-10">
              <dl className="grid grid-cols-2 gap-y-5 gap-x-6">
                <div className="col-span-2">
                  <dt className="text-[10px] text-muted uppercase tracking-[0.25em] font-body mb-2">
                    {productSizes.length > 1 ? 'Verfügbare Größen' : 'Größe'}
                  </dt>
                  <dd>
                    {productSizes.length === 0 ? (
                      <span className="text-sm text-charcoal/40 font-body">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {productSizes.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center px-3 py-1.5 border border-charcoal/25 text-charcoal text-xs font-body tracking-wider uppercase bg-white/40"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </dd>
                </div>
                {[
                  { label: 'Zustand', value: product.condition },
                  { label: 'Kategorie', value: product.category },
                  { label: 'Geschlecht', value: product.gender },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-[10px] text-muted uppercase tracking-[0.25em] font-body mb-1.5">{label}</dt>
                    <dd className="text-sm text-charcoal font-body font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              {product.status === 'verfügbar' && (
                <a
                  href={`https://instagram.com/bigclothingmainz`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-charcoal text-cream py-4 text-[11px] tracking-[0.25em] uppercase font-body font-medium hover:bg-blush transition-colors duration-300"
                >
                  <InstagramIcon />
                  DM auf Instagram
                </a>
              )}

              <button
                onClick={toggleLike}
                className={`flex items-center justify-center gap-2 py-4 px-6 text-[11px] tracking-[0.25em] uppercase font-body font-medium border transition-colors ${
                  liked
                    ? 'border-blush text-blush bg-blush/5'
                    : 'border-charcoal/30 text-charcoal hover:border-charcoal'
                }`}
              >
                <svg
                  className={`w-4 h-4 ${animating ? 'heart-pop' : ''}`}
                  fill={liked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {liked ? 'Gemerkt' : 'Merken'}
              </button>
            </div>

            {product.status !== 'verfügbar' && (
              <p className="mt-4 text-xs text-muted font-body text-center">
                {product.status === 'verkauft'
                  ? 'Dieses Stück wurde bereits verkauft.'
                  : 'Aktuell reserviert — bei Interesse trotzdem melden.'}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
