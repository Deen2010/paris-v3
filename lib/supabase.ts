import { createClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(input: string): string {
  const trimmed = (input || '').trim();
  if (!trimmed) return '';
  try {
    const u = new URL(trimmed);
    return `${u.protocol}//${u.host}`;
  } catch {
    return trimmed.replace(/\/+$/, '');
  }
}

const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  size: string | null;
  sizes: string[] | null;
  category: string;
  gender: 'Herr' | 'Dame' | 'Unisex';
  condition: 'Neu' | 'Gebraucht';
  status: 'verfügbar' | 'reserviert' | 'verkauft';
  image_url: string;
  created_at: string;
};

export function getDiscountPercent(product: Pick<Product, 'price' | 'original_price'>): number {
  if (!product.original_price || product.original_price <= product.price) return 0;
  return Math.round((1 - product.price / product.original_price) * 100);
}

export function formatEuro(value: number): string {
  return value.toFixed(2).replace('.', ',') + ' €';
}

const SIZE_ORDER = [
  'One Size',
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
  '34', '36', '38', '40', '42', '44', '46', '48', '50', '52',
  'Schuhe 36', 'Schuhe 37', 'Schuhe 38', 'Schuhe 39', 'Schuhe 40',
  'Schuhe 41', 'Schuhe 42', 'Schuhe 43', 'Schuhe 44', 'Schuhe 45', 'Schuhe 46',
];

export function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a);
    const bi = SIZE_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function getProductSizes(product: Pick<Product, 'sizes' | 'size'>): string[] {
  if (Array.isArray(product.sizes) && product.sizes.length > 0) {
    return sortSizes(product.sizes.filter(Boolean));
  }
  if (product.size) return [product.size];
  return [];
}

export function formatSizesShort(sizes: string[]): string {
  if (sizes.length === 0) return '';
  if (sizes.length === 1) {
    return sizes[0] === 'One Size' ? 'One Size' : `Gr. ${sizes[0]}`;
  }
  return `Gr. ${sizes.join(' · ')}`;
}
