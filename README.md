# Mainzer Fashion 👗

Eine minimalistische Mode-Galerie mit Instagram-Verkauf und Admin-Upload.

---

## 🚀 Setup in 5 Schritten

### 1. Supabase Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) → "New project"
2. Wähle einen Namen (z.B. `mainzer-fashion`) und ein Passwort
3. Warte bis das Projekt bereit ist (~1 Minute)

### 2. Datenbank einrichten

1. Im Supabase Dashboard: **SQL Editor** → "New query"
2. Kopiere den Inhalt von `supabase-setup.sql` und klicke **Run**
3. Das erstellt die `products`-Tabelle und den `product-images` Storage Bucket

### 3. Storage Bucket überprüfen

1. Gehe zu **Storage** im Supabase Dashboard
2. Du solltest den Bucket `product-images` sehen
3. Falls nicht: Manuell erstellen → "New bucket" → Name: `product-images` → **Public** aktivieren

### 4. Umgebungsvariablen einrichten

1. Kopiere `.env.local.example` zu `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Im Supabase Dashboard: **Settings → API**
3. Kopiere:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Beispiel `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Dependencies installieren & starten

```bash
npm install tailwindcss autoprefixer postcss
npm run dev
```

Die Website läuft auf **http://localhost:3000**

---

## 📦 Produkt hochladen

1. Öffne **http://localhost:3000/admin**
2. Fülle das Formular aus:
   - Bild hochladen (JPG/PNG/WEBP)
   - Titel, Beschreibung, Preis
   - Größe, Kategorie, Geschlecht, Zustand, Status
3. Klicke **"Produkt veröffentlichen"**
4. Das Produkt erscheint sofort in der Galerie! ✅

---

## 🌐 Instagram-Handle ändern

Suche in allen Dateien nach `mainzer.fashion` und ersetze es mit deinem echten Instagram-Handle.

Dateien:
- `components/Header.tsx`
- `app/product/[id]/page.tsx`
- `app/page.tsx`

---

## 📁 Projektstruktur

```
mainzer-fashion/
├── app/
│   ├── page.tsx          # Galerie (Startseite)
│   ├── admin/page.tsx    # Admin Upload
│   ├── product/[id]/     # Produktdetailseite
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx        # Header + Instagram Banner
│   ├── ProductCard.tsx   # Produktkarte
│   └── FilterBar.tsx     # Filter (Kategorie, Größe, Geschlecht)
├── lib/
│   └── supabase.ts       # Supabase Client + Types
├── supabase-setup.sql    # DB Setup Script
└── .env.local.example
```

---

## 🔒 Admin-Seite absichern (optional)

Aktuell ist `/admin` öffentlich zugänglich. Für Produktion empfohlen:
- Einfaches Passwort mit Next.js Middleware
- Oder Supabase Auth hinzufügen

---

## 🎨 Design-Anpassungen

- Farben: `tailwind.config.js` → `cream`, `charcoal`, `blush`, `sage`
- Schriften: `app/globals.css` → Google Fonts Import
- Instagram-Handle: Alle `@mainzer.fashion` ersetzen
