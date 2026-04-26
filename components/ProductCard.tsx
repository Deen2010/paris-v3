'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  getDiscountPercent,
  formatEuro,
  getProductSizes,
  formatSizesShort,
  type Product,
} from '@/lib/supabase';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('mf-favorites') || '[]');
    setLiked(favorites.includes(product.id));
  }, [product.id]);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('mf-favorites') || '[]');
    const newFavorites = liked
      ? favorites.filter((id: string) => id !== product.id)
      : [...favorites, product.id];
    localStorage.setItem('mf-favorites', JSON.stringify(newFavorites));
    setLiked(!liked);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
  };

  const statusLabel =
    product.status === 'verkauft'
      ? 'Verkauft'
      : product.status === 'reserviert'
      ? 'Reserviert'
      : null;

  const discountPercent = getDiscountPercent(product);
  const hasDiscount = discountPercent > 0;
  const productSizes = getProductSizes(product);
  const sizeLabel = formatSizesShort(productSizes);

  return (
    <Link
      href={`/product/${product.id}`}
      className="product-card block bg-white group cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            priority={index === 0}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted/30">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 image-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status badge */}
        {statusLabel && (
          <div className={`absolute top-3 left-3 px-2 py-1 text-xs tracking-widest uppercase font-body badge-${product.status}`}>
            {statusLabel}
          </div>
        )}

        {/* Discount badge */}
        {!statusLabel && hasDiscount && (
          <div className="absolute top-3 left-3 px-2 py-1 text-[11px] tracking-widest uppercase font-body bg-blush text-cream font-semibold">
            -{discountPercent}%
          </div>
        )}

        {/* Condition badge */}
        <div className="absolute top-3 right-3 px-2 py-1 text-xs tracking-widest uppercase font-body bg-cream/90 text-charcoal">
          {product.condition}
        </div>

        {/* Like button */}
        <button
          onClick={toggleLike}
          className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center bg-cream/90 hover:bg-cream transition-colors duration-200 shadow-sm"
          aria-label={liked ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
        >
          <svg
            className={`w-5 h-5 transition-colors duration-200 ${animating ? 'heart-pop' : ''} ${liked ? 'text-rose-500' : 'text-charcoal/40'}`}
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-display text-lg font-light text-charcoal leading-tight mb-1 group-hover:text-blush transition-colors duration-200">
          {product.title}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className={`font-body text-base font-medium ${hasDiscount ? 'text-blush' : 'text-charcoal'}`}>
              {formatEuro(product.price)}
            </span>
            {hasDiscount && product.original_price && (
              <span className="font-body text-xs text-muted line-through">
                {formatEuro(product.original_price)}
              </span>
            )}
          </div>
          {sizeLabel && (
            <span className="font-body text-xs text-muted uppercase tracking-wider whitespace-nowrap truncate">
              {sizeLabel}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
