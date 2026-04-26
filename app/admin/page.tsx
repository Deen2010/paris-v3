'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, type Product } from '@/lib/supabase';

const CATEGORIES = [
  // Oberteile
  'T-Shirts', 'Longsleeves', 'Hemden', 'Hoodies', 'Sweatshirts', 'Pullover', 'Strickwaren', 'Tanktops',
  // Sets & Suits
  'Tracksuits', 'Zweiteiler', 'Anzüge', 'Overalls',
  // Unterkörper
  'Hosen', 'Jeans', 'Cargohosen', 'Shorts', 'Jogginghosen', 'Leggings', 'Röcke', 'Kleider',
  // Outerwear
  'Jacken', 'Mäntel', 'Westen', 'Puffer', 'Windbreaker', 'Fleece',
  // Schuhe
  'Sneakers', 'Boots', 'Sandalen', 'Hausschuhe', 'Schuhe',
  // Kopf & Bags
  'Caps', 'Mützen', 'Bauchtaschen', 'Rucksäcke', 'Taschen', 'Gürtel',
  // Schmuck & Uhren
  'Uhren', 'Ketten', 'Ringe', 'Armbänder', 'Ohrringe', 'Schmuck',
  // Sonstiges
  'Accessoires', 'Sportswear', 'Unterwäsche', 'Socken', 'Sonnenbrillen', 'Sonstiges',
];

const SIZES = [
  'One Size',
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
  '34', '36', '38', '40', '42', '44', '46', '48', '50', '52',
  'Schuhe 36', 'Schuhe 37', 'Schuhe 38', 'Schuhe 39', 'Schuhe 40',
  'Schuhe 41', 'Schuhe 42', 'Schuhe 43', 'Schuhe 44', 'Schuhe 45', 'Schuhe 46',
];

const EMPTY_FORM = {
  title: '',
  description: '',
  price: '',
  original_price: '',
  category: '',
  gender: 'Unisex',
  condition: 'Gebraucht',
  status: 'verfügbar',
};

const SIZE_GROUPS: { label: string; sizes: string[] }[] = [
  { label: 'Universal', sizes: ['One Size'] },
  { label: 'Konfektion', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
  { label: 'Numerisch', sizes: ['34', '36', '38', '40', '42', '44', '46', '48', '50', '52'] },
  {
    label: 'Schuhgrößen',
    sizes: [
      'Schuhe 36', 'Schuhe 37', 'Schuhe 38', 'Schuhe 39', 'Schuhe 40',
      'Schuhe 41', 'Schuhe 42', 'Schuhe 43', 'Schuhe 44', 'Schuhe 45', 'Schuhe 46',
    ],
  },
];

export default function AdminPage() {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setProductsLoading(true);
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!fetchError && data) {
      setProducts(data as Product[]);
    }
    setProductsLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      title: product.title || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      original_price: product.original_price != null ? String(product.original_price) : '',
      category: product.category || '',
      gender: product.gender || 'Unisex',
      condition: product.condition || 'Gebraucht',
      status: product.status || 'verfügbar',
    });
    const initialSizes =
      Array.isArray(product.sizes) && product.sizes.length > 0
        ? product.sizes
        : product.size
        ? [product.size]
        : [];
    setSelectedSizes(initialSizes);
    setExistingImageUrl(product.image_url || '');
    setImagePreview(product.image_url || null);
    setImageFile(null);
    setError('');
    setSuccess('');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSelectedSizes([]);
    setImagePreview(null);
    setImageFile(null);
    setExistingImageUrl('');
    setError('');
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Produkt "${product.title}" wirklich löschen?`)) return;
    setError('');
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id);
    if (deleteError) {
      setError('Löschen fehlgeschlagen: ' + deleteError.message);
      return;
    }
    if (editingId === product.id) cancelEdit();
    setSuccess('Produkt gelöscht.');
    setTimeout(() => setSuccess(''), 3000);
    fetchProducts();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      let image_url = existingImageUrl;

      if (imageFile) {
        const mimeToExt: Record<string, string> = {
          'image/jpeg': 'jpg',
          'image/jpg': 'jpg',
          'image/png': 'png',
          'image/webp': 'webp',
          'image/gif': 'gif',
          'image/heic': 'heic',
          'image/heif': 'heif',
        };
        const rawExt = (imageFile.name.includes('.')
          ? imageFile.name.split('.').pop() || ''
          : ''
        ).toLowerCase().replace(/[^a-z0-9]/g, '');
        const safeExt = mimeToExt[imageFile.type] || (rawExt && rawExt.length <= 5 ? rawExt : 'jpg');
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: imageFile.type || undefined,
          });

        if (uploadError) {
          throw new Error('Bild-Upload fehlgeschlagen: ' + (uploadError.message || 'Unbekannter Fehler'));
        }

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        image_url = urlData.publicUrl;
      }

      const parsedOriginal = form.original_price.trim() === '' ? null : parseFloat(form.original_price);
      const parsedPrice = parseFloat(form.price);

      if (parsedOriginal !== null && (isNaN(parsedOriginal) || parsedOriginal <= parsedPrice)) {
        throw new Error('Originalpreis muss höher sein als der aktuelle Preis (oder leer lassen).');
      }

      if (selectedSizes.length === 0) {
        throw new Error('Bitte wähle mindestens eine Größe aus.');
      }

      const payload = {
        title: form.title,
        description: form.description,
        price: parsedPrice,
        original_price: parsedOriginal,
        size: selectedSizes[0],
        sizes: selectedSizes,
        category: form.category,
        gender: form.gender,
        condition: form.condition,
        status: form.status,
        image_url,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw new Error('Aktualisierung fehlgeschlagen: ' + updateError.message);
        setSuccess('Produkt erfolgreich aktualisiert.');
        cancelEdit();
      } else {
        const { error: insertError } = await supabase.from('products').insert([payload]);
        if (insertError) throw new Error('Daten-Upload fehlgeschlagen: ' + insertError.message);
        setSuccess('Produkt erfolgreich hochgeladen. Es erscheint jetzt in der Galerie.');
        setForm(EMPTY_FORM);
        setSelectedSizes([]);
        setImagePreview(null);
        setImageFile(null);
        setExistingImageUrl('');
      }

      setTimeout(() => setSuccess(''), 4000);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Unbekannter Fehler');
    } finally {
      setUploading(false);
    }
  }

  const inputClass = `
    w-full bg-white border border-charcoal/20 text-charcoal text-sm px-4 py-3
    focus:outline-none focus:border-blush transition-colors font-body
    placeholder:text-muted/50
  `;
  const labelClass = 'block text-xs uppercase tracking-widest text-muted font-body mb-1.5';

  const isEditing = editingId !== null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin Header */}
      <header className="bg-charcoal text-cream py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-cream/40 hover:text-cream text-xs uppercase tracking-widest transition-colors">
            ← Galerie
          </Link>
          <span className="text-cream/20">|</span>
          <span className="font-display text-xl tracking-[0.15em]">Admin</span>
        </div>
        <span className="text-xs text-cream/40 uppercase tracking-widest">BIG clothing</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-baseline justify-between mb-2">
          <h1 className="font-display text-4xl font-light text-charcoal">
            {isEditing ? 'Produkt bearbeiten' : 'Neues Produkt'}
          </h1>
          {isEditing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs uppercase tracking-widest text-muted hover:text-charcoal transition-colors font-body"
            >
              Abbrechen
            </button>
          )}
        </div>
        <p className="text-sm text-muted font-body mb-10">
          {isEditing
            ? 'Ändere die Felder und speichere die Änderungen. Lass das Bild leer, um das aktuelle zu behalten.'
            : 'Fülle alle Felder aus. Das Produkt erscheint sofort in der Galerie.'}
        </p>

        {/* Success */}
        {success && (
          <div className="mb-6 bg-sage/10 border border-sage/30 text-sage px-4 py-3 text-sm font-body flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className={labelClass}>
              Produktbild {isEditing ? '' : '*'}
            </label>
            <div
              className={`relative border-2 border-dashed transition-colors cursor-pointer ${
                imagePreview ? 'border-blush' : 'border-charcoal/20 hover:border-blush'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Vorschau" className="w-full max-h-80 object-cover" />
                  <div className="absolute inset-0 bg-charcoal/0 hover:bg-charcoal/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 hover:opacity-100 text-white text-xs uppercase tracking-widest font-body transition-opacity">
                      Bild ändern
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-muted/40 gap-3">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-xs uppercase tracking-widest font-body">Bild hochladen</p>
                  <p className="text-xs font-body">JPG, PNG, WEBP bis 10 MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>Titel *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="z.B. Vintage Levi's 501 Jeans"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Beschreibung</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Details zum Produkt, Besonderheiten, Materialien..."
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* Price + Original price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Preis (€) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="29.00"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Originalpreis (€) — optional</label>
              <input
                type="number"
                name="original_price"
                value={form.original_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="z.B. 49.00 für Rabatt"
                className={inputClass}
              />
              <p className="text-[11px] text-muted/70 font-body mt-1">
                Wenn höher als Preis: Rabatt-Badge erscheint automatisch.
              </p>
            </div>
          </div>

          {/* Sizes (multi-select) */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className={labelClass + ' mb-0'}>Größen *</label>
              <span className="text-[11px] text-muted/70 font-body">
                {selectedSizes.length === 0
                  ? 'Mehrfachauswahl möglich'
                  : `${selectedSizes.length} ausgewählt`}
              </span>
            </div>

            {selectedSizes.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {selectedSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className="inline-flex items-center gap-1.5 bg-charcoal text-cream px-2.5 py-1 text-[11px] tracking-wider uppercase font-body hover:bg-blush transition-colors"
                  >
                    {s}
                    <span className="text-cream/70">×</span>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2.5 bg-white border border-charcoal/20 p-3">
              {SIZE_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] uppercase tracking-widest text-muted font-body mb-1.5">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.sizes.map((s) => {
                      const active = selectedSizes.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSize(s)}
                          className={`px-2.5 py-1 text-[11px] tracking-wider uppercase font-body border transition-colors ${
                            active
                              ? 'bg-charcoal text-cream border-charcoal'
                              : 'bg-cream text-charcoal/70 border-charcoal/20 hover:border-charcoal hover:text-charcoal'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted/70 font-body mt-1.5">
              Wähle alle Größen, in denen dieses Produkt verfügbar ist. Für Caps oder Taschen: "One Size".
            </p>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelClass}>Kategorie *</label>
              <select name="category" value={form.category} onChange={handleChange} required className={inputClass}>
                <option value="">Kategorie wählen</option>
                <optgroup label="Oberteile">
                  {['T-Shirts', 'Longsleeves', 'Hemden', 'Hoodies', 'Sweatshirts', 'Pullover', 'Strickwaren', 'Tanktops'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Sets & Suits">
                  {['Tracksuits', 'Zweiteiler', 'Anzüge', 'Overalls'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Unterkörper">
                  {['Hosen', 'Jeans', 'Cargohosen', 'Shorts', 'Jogginghosen', 'Leggings', 'Röcke', 'Kleider'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Outerwear">
                  {['Jacken', 'Mäntel', 'Westen', 'Puffer', 'Windbreaker', 'Fleece'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Schuhe">
                  {['Sneakers', 'Boots', 'Sandalen', 'Hausschuhe', 'Schuhe'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Caps & Bags">
                  {['Caps', 'Mützen', 'Bauchtaschen', 'Rucksäcke', 'Taschen', 'Gürtel'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Schmuck & Uhren">
                  {['Uhren', 'Ketten', 'Ringe', 'Armbänder', 'Ohrringe', 'Schmuck'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
                <optgroup label="Sonstiges">
                  {['Accessoires', 'Sportswear', 'Unterwäsche', 'Socken', 'Sonnenbrillen', 'Sonstiges'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Gender / Condition / Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Geschlecht</label>
              <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                <option>Dame</option>
                <option>Herr</option>
                <option>Unisex</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Zustand</label>
              <select name="condition" value={form.condition} onChange={handleChange} className={inputClass}>
                <option>Neu</option>
                <option>Gebraucht</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="verfügbar">Verfügbar</option>
                <option value="reserviert">Reserviert</option>
                <option value="verkauft">Verkauft</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-charcoal text-cream py-4 text-xs tracking-widest uppercase font-body hover:bg-blush transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {uploading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {isEditing ? 'Wird gespeichert...' : 'Wird hochgeladen...'}
              </>
            ) : (
              isEditing ? 'Änderungen speichern' : 'Produkt veröffentlichen'
            )}
          </button>
        </form>

        {/* Existing products list */}
        <section className="mt-16">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl font-light text-charcoal">
              Bestehende Produkte
            </h2>
            <span className="text-xs uppercase tracking-widest text-muted font-body">
              {products.length} Artikel
            </span>
          </div>

          {productsLoading ? (
            <p className="text-sm text-muted font-body">Lade Produkte...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted font-body">
              Noch keine Produkte vorhanden. Lade dein erstes Produkt mit dem Formular oben hoch.
            </p>
          ) : (
            <ul className="space-y-3">
              {products.map((product) => {
                const isEditingThis = editingId === product.id;
                return (
                  <li
                    key={product.id}
                    className={`flex items-center gap-4 bg-white border p-3 transition-colors ${
                      isEditingThis ? 'border-blush' : 'border-charcoal/10'
                    }`}
                  >
                    <div className="w-16 h-16 flex-shrink-0 bg-cream overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted/40 text-xs">—</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-charcoal truncate">{product.title}</p>
                      <p className="text-xs text-muted font-body mt-0.5">
                        {product.price?.toFixed(2)} €
                        {product.original_price && product.original_price > product.price && (
                          <span className="ml-1 text-blush font-medium">
                            (statt {product.original_price.toFixed(2)} €)
                          </span>
                        )}
                        {' '}· {(Array.isArray(product.sizes) && product.sizes.length > 0
                          ? product.sizes
                          : product.size
                          ? [product.size]
                          : []
                        ).join(', ') || '—'} · {product.category} ·{' '}
                        <span className="capitalize">{product.status}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="text-xs uppercase tracking-widest font-body text-charcoal border border-charcoal/20 px-3 py-2 hover:border-blush hover:text-blush transition-colors"
                      >
                        Bearbeiten
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="text-xs uppercase tracking-widest font-body text-red-600 border border-red-200 px-3 py-2 hover:bg-red-50 transition-colors"
                      >
                        Löschen
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
