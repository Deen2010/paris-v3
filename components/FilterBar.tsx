'use client';

interface FilterBarProps {
  categories: string[];
  sizes: string[];
  selectedCategory: string;
  selectedSize: string;
  selectedGender: string;
  searchQuery: string;
  sortOrder: string;
  onCategoryChange: (val: string) => void;
  onSizeChange: (val: string) => void;
  onGenderChange: (val: string) => void;
  onSearchChange: (val: string) => void;
  onSortChange: (val: string) => void;
}

export default function FilterBar({
  categories,
  sizes,
  selectedCategory,
  selectedSize,
  selectedGender,
  searchQuery,
  sortOrder,
  onCategoryChange,
  onSizeChange,
  onGenderChange,
  onSearchChange,
  onSortChange,
}: FilterBarProps) {
  const genders = ['Alle', 'Dame', 'Herr', 'Unisex'];

  const hasActiveFilters = selectedCategory || selectedSize || selectedGender || searchQuery;

  const selectClass = `
    appearance-none bg-cream border border-charcoal/20 text-charcoal text-xs
    tracking-widest uppercase px-4 py-2 pr-8 cursor-pointer hover:border-blush
    transition-colors duration-200 focus:outline-none focus:border-blush font-body
  `;

  return (
    <div className="py-4 space-y-3">
      {/* Search row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Suchen…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-cream border border-charcoal/20 text-charcoal text-xs tracking-wider px-4 py-2 pl-9 placeholder:text-muted/50 focus:outline-none focus:border-blush transition-colors duration-200 font-body"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal/40 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative ml-auto">
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className={selectClass}
          >
            <option value="newest">Neueste</option>
            <option value="price_asc">Preis ↑</option>
            <option value="price_desc">Preis ↓</option>
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-charcoal/40 text-xs">
            ↓
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted uppercase tracking-widest font-body hidden sm:block mr-1">
          Filter:
        </span>

        {/* Gender pills */}
        <div className="flex gap-1">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => onGenderChange(g === 'Alle' ? '' : g)}
              className={`px-3 py-1.5 text-xs tracking-widest uppercase font-body transition-all duration-200 ${
                (g === 'Alle' && selectedGender === '') || selectedGender === g
                  ? 'bg-charcoal text-cream'
                  : 'bg-transparent text-charcoal/60 hover:text-charcoal border border-charcoal/20 hover:border-charcoal/40'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Category */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={`${selectClass} ${selectedCategory ? 'border-blush text-blush' : ''}`}
          >
            <option value="">Kategorie</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-charcoal/40 text-xs">↓</div>
        </div>

        {/* Size */}
        <div className="relative">
          <select
            value={selectedSize}
            onChange={(e) => onSizeChange(e.target.value)}
            className={`${selectClass} ${selectedSize ? 'border-blush text-blush' : ''}`}
          >
            <option value="">Größe</option>
            {sizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-charcoal/40 text-xs">↓</div>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              onCategoryChange('');
              onSizeChange('');
              onGenderChange('');
              onSearchChange('');
            }}
            className="text-xs text-muted hover:text-blush transition-colors duration-200 underline underline-offset-2 font-body ml-1"
          >
            Zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}
