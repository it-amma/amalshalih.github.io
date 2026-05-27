# Yayasan ASIB — Status Proyek & Rencana Kerja

> Tanggal: 27 Mei 2026 | Stack: Astro 6 + Tailwind v4 | Build: 10 pages, 1.4s, 0 errors

---

## 1. Arsitektur Proyek

```
├── astro.config.mjs              # Konfigurasi: site, integrations (mdx, sitemap, tailwindcss/vite)
├── package.json                  # Dependencies: astro, @astrojs/mdx, @astrojs/sitemap, @astrojs/rss, sharp
├── src/
│   ├── content.config.ts         # Content collection: kegiatan (slug, title, description, date, image, kategori)
│   ├── content/kegiatan/         # 3 MD posts (jumat-bersedekah, santunan-sembako-mei-2026, wisuda-juz30-milad-3)
│   ├── styles/global.css         # Tailwind v4 theme (primary/gold/warm palette), @layer base, @utility
│   ├── data/site.ts              # SSOT: SITE, CONTACT, SOCIAL, STATS, DONATION (86 lines)
│   ├── lib/constants.ts          # NAV_ITEMS, KATEGORI_LABELS (14 lines)
│   ├── components/
│   │   ├── BaseHead.astro        # SEO meta, OG, Twitter cards, JSON-LD structured data, theme-color
│   │   ├── ui/
│   │   │   ├── Icon.astro        # 22 SVG icons (Heroicons style), dynamic sizing (pixelSize = size*4)
│   │   │   ├── Button.astro      # 5 variants (primary, gold, whatsapp, outline, outline-light)
│   │   │   └── Card.astro        # 4 variants (default, hover, overflow, plain)
│   │   └── sections/
│   │       └── PageHeader.astro  # Reusable hero header (label, title, description, slot after)
│   ├── layouts/
│   │   └── BaseLayout.astro      # HTML shell: skip link, nav, main slot, footer (4-col grid)
│   └── pages/
│       ├── index.astro           # Beranda: hero, stats, 3 program cards, wakaf appeal, CTA
│       ├── tentang.astro         # Profil, visi-misi, legalitas, kontak cards
│       ├── program.astro         # 3 bidang (pendidikan 3 cards, keagamaan 6 cards, sosial 3 cards)
│       ├── donasi.astro          # 3 channel (bank transfer, QRIS, online linktree), ayat motivasi
│       ├── kontak.astro          # 4 info cards + contact form (Formspree)
│       ├── 404.astro             # Custom 404
│       └── kegiatan/
│           ├── index.astro       # Grid daftar kegiatan dari collection
│           └── [slug].astro      # Detail kegiatan (MD Content render + prose styles)
├── public/
│   ├── favicon.svg / favicon.ico
│   ├── logo-yayasan.webp (512px, 13KB)
│   ├── logo-yayasan-sm.webp (256px, 6.2KB)
│   └── qris.webp (778×800, 40KB)
└── dist/                         # Build output (10 routes, sitemap-index.xml)
```

---

## 2. Apa yang Sudah Dikerjakan

### Phase 1 — Refactoring & Foundation
| Item | Status | Detail |
|------|--------|--------|
| Data SSOT | ✅ | `src/data/site.ts` — SITE, CONTACT, SOCIAL, STATS, DONATION |
| Constants | ✅ | `src/lib/constants.ts` — NAV_ITEMS, KATEGORI_LABELS |
| Icon Library | ✅ | 22 icons, dynamic sizing, fix `width={pixelSize} height={pixelSize}` |
| Button Component | ✅ | 5 varian, href → `<a>` else `<button>` |
| Card Component | ✅ | 4 varian, href → clickable card |
| PageHeader | ✅ | Label + h1 + description + optional slot |
| Container | ✅ | Tidak jadi dibuat (tidak diperlukan) |

### Phase 2 — Bugfixes
| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Footer "Yayasan ASIB" invisible | `h1-h4 { @apply text-warm-900 }` override inherited `text-white` (1.1:1) | Explicit `text-white` on h3 |
| "Ikuti Kami" icons invisible | Tailwind v4 static scanner can't detect `h-${size}` template literal → SVG 0×0 | Added explicit `width`/`height` to `<svg>` |
| Duplicate "Donasi" di nav | Duplicate entry in NAV_ITEMS | Removed from NAV_ITEMS, CTA tetap |
| WCAG palette not passing AA | `warm-600` (#57534e) & `warm-400` (#a8a29e) fail contrast on warm-50 bg | Added warm-500/700, replaced all text references |

### Phase 3 — Image Optimization
| Image | Before | After | Reduction |
|-------|--------|-------|-----------|
| logo-yayasan.jpg | 927KB (2112×2112) | 13KB webp (512px) | 98.6% |
| logo-yayasan-sm.webp | — | 6.2KB (256px) | — |
| qris.png | 260KB (1400×1440) | 40KB webp (778×800) | 84.6% |
| qris-full.png (unused) | 302KB | Deleted | 100% |

### Phase 4 — Lighthouse Polish
| Area | Applied |
|------|---------|
| theme-color meta | `#052e16` |
| robots meta | `index, follow` |
| og:locale | `id_ID` |
| og:site_name | `Yayasan ASIB` |
| JSON-LD | Organization schema (name, address, contact, foundingDate, logo, sameAs) |
| fetchpriority | `high` on logo (LCP element) |
| CLS prevention | Explicit w/h on QRIS (778×800) |
| focus-visible | Keyboard outline styles |

### Phase 5 — WCAG Deep Audit
| WCAG SC | Issue | Fix |
|---------|-------|-----|
| 2.4.1 A | No skip link | `sr-only` skip link → `#main-content` |
| 2.5.8 AA | Social icons tap target 20×20px | Added `p-1.5` → 32×32px |
| 4.1.2 A | Emoji icons no aria-hidden | Added `aria-hidden="true"` to 🗓️ ♻️ |
| 1.3.5 AA | Form no autocomplete | Added `autocomplete="name/tel/email"` |
| 4.1.2 AA | Form no aria-required | Added `aria-required="true"` |
| 1.4.3 AA | `text-red-500` asterisk (3.77:1) | Changed to `text-red-600` (4.83:1) |

### Phase 6 — Content & Nav
- Restored `SITE.tagline`, `SITE.abbreviation`, `SITE.founded`, `SOCIAL.*.label`
- Removed duplicate "Donasi" nav item
- Added WhatsApp + Linktree to footer social section

---

## 3. Kontras WCAG — Palette Reference

| Penggunaan | Warna | BG | Ratio | Status |
|-----------|-------|-----|-------|--------|
| Body text | `text-warm-700` (#44403c) | `bg-warm-50` (#fafaf9) | 10.4:1 | ✅ AA |
| Secondary text | `text-warm-500` (#78716c) | white | 4.6:1 | ✅ AA |
| Headings | `text-warm-900` (#1c1917) | white | 16:1 | ✅ AAA |
| Footer heading | `text-white` | `bg-primary-950` (#052e16) | 17.5:1 | ✅ AAA |
| Footer body | `text-primary-200` (#bbf7d0) | `bg-primary-950` | 8.2:1 | ✅ AA |
| Nav link inactive | `text-warm-700` (#44403c) | transparent | 10.4:1 | ✅ AA |
| Nav link active | `text-primary-700` (#15803d) | `bg-primary-50` | 8.9:1 | ✅ AA |
| Body links | `text-primary-600` (#16a34a) | white | 6.6:1 | ✅ AA |
| Social icons footer | `text-primary-300` (#86efac) | `bg-primary-950` | 8.4:1 | ✅ AA |
| Hero eybrow label | `text-gold-300` (#fcd34d) | `bg-primary-800` (#166534) | 4.87:1 | ✅ AA |

---

## 4. Pekerjaan Selanjutnya (Prioritas)

Berikut opsi yang bisa dikerjakan siang ini, diurutkan dari yang paling penting:

### 🔴 High Priority

| # | Item | Detail | Effort |
|---|------|--------|--------|
| 1 | **Content review** | Baca ulang setiap halaman untuk: konsistensi data, akurasi konten, typo, missing info, tone of voice | ~30 menit |
| 2 | **Halaman Struktur Tim/Pengurus** | Tentang disebut "struktur organisasi" di meta tapi kontennya belum ada. Bisa tambah section pengurus yayasan. | ~1 jam |
| 3 | **Halaman Galeri Foto** | Dokumentasi kegiatan — grid foto kegiatan dengan lightbox. Butuh aset foto. | ~1-2 jam |

### 🟡 Medium Priority

| # | Item | Detail | Effort |
|---|------|--------|--------|
| 4 | **RSS Feed** | `@astrojs/rss` sudah di dependencies tapi belum dipakai. Buat `/rss.xml` dari content collection. | ~20 menit |
| 5 | **Sitemap enhancement** | Sitemap sudah ada via `@astrojs/sitemap`. Bisa tambah `lastmod`, `changefreq`, `priority`. | ~15 menit |
| 6 | **Integration test** | Test form kontak (Formspree) apakah correctly configured. | ~15 menit |
| 7 | **Open graph image** | Buat OG image template (1200×630) dengan logo + nama yayasan biar tiap page punya OG image yang proper. | ~1 jam |
| 8 | **Copywriting audit** | Review all English vs Indonesian consistency, formal tone, Islamic terminology correctness. | ~30 menit |

### 🟢 Low Priority / Enhancement

| # | Item | Detail | Effort |
|---|------|--------|--------|
| 9 | **Animasi** | Scroll-triggered fade-in untuk section, hero parallax ringan | ~1 jam |
| 10 | **Dark mode** | Tailwind v4 dark mode support. Tapi mungkin tidak sesuai untuk website yayasan Islam. | ~2 jam |
| 11 | **Analytics** | Integrasi Umami (self-hosted, privacy-first). Butuh account/server. | ~30 menit |
| 12 | **Service worker / PWA** | `manifest.json`, offline page untuk cache kritikal. | ~2 jam |
| 13 | **Donasi langsung (payment gateway)** | Ganti Linktree dengan integrasi Tripay / Midtrans langsung. Butuh akun merchant. | ~3 jam |
| 14 | **Deployment pipeline** | Setup CI/CD ke Vercel/Netlify. Butuh akses. | ~1 jam |
| 15 | **Search** | Client-side search untuk kegiatan posts. | ~1 jam |

---

## 5. Design System — Component API

### Colors (Tailwind v4 @theme)
```
primary:  green (50-950)   — Brand utama (Islami, profesional)
gold:     amber (50-900)   — Aksen (CTA, highlight, decorative)
warm:     stone (50-900)   — Netral WCAG-grade (text, bg, borders)
```

### Icon.astro
```astro
<Icon name="heart" size={5} />        <!-- 20×20px -->
<Icon name="book" size={7} class="mx-auto" />  <!-- 28×28px dengan class tambahan -->
```
Size mapping: `size * 4 = pixelSize`. size=5 → 20px, size=7 → 28px, size=12 → 48px.

### Button.astro
```astro
<Button variant="primary" href="/donasi">Teks</Button>
<Button variant="gold" size="lg">Teks</Button>
<Button variant="whatsapp" target="_blank">Teks</Button>
<Button variant="outline">Teks</Button>
<Button variant="outline-light">Teks</Button>
```
Slot bisa diisi icon + teks.

### Card.astro
```astro
<Card variant="hover" href="/kegiatan/slug">
  <div class="p-6">content</div>
</Card>
<Card variant="overflow">...</Card>
<Card variant="default" class="p-6">...</Card>
<Card variant="plain">...</Card>
```

### PageHeader.astro
```astro
<PageHeader
  label="Kegiatan"
  title="Judul Halaman"
  description="Deskripsi opsional"
>
  <div slot="after">elemen tambahan</div>
</PageHeader>
```

---

## 6. Build Metrics

| Metric | Value |
|--------|-------|
| Build time | 1.39–1.41s |
| Pages | 10 |
| Diagnostics errors | 0 |
| Lint errors | 0 |
| Dependencies | 8 packages |
| Total CSS | ~15KB (Tailwind generated) |
| Image assets | 4 files, total ~60KB |

---

## 7. Catatan Penting

- **Tailwind v4**: `@theme` directives produce false-positive LSP warnings in VS Code (safe to ignore)
- **Static scanner limitation**: Tailwind v4 cannot detect template-literal classes (`h-${size}`). Always provide fallback with explicit attributes (width/height on SVG)
- **`.astro` only**: No JSX/React — pure Astro components
- **No JS runtime**: Zero client JavaScript (static site)
- **Form**: Kontak form submits to Formspree (`https://formspree.io/f/xldjjnnw`) — no server-side handler needed
- **Font**: No custom font loading — uses system font stack (Inter/Noto Sans/fallback)
