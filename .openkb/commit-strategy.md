# Commit Strategy — Handover Tim

> **Dibuat:** 27 Mei 2026
> **Tujuan:** Dokumen ini berisi strategi dan eksekusi commit untuk memudahkan tracking issue dan handover ke tim pengembang.

---

## Daftar Isi

1. [Hasil Audit File — Tracked vs Ignored](#1-hasil-audit-file)
2. [Struktur Commit](#2-struktur-commit)
3. [Cara Eksekusi](#3-cara-eksekusi)
4. [ Troubleshooting — Cara Lacak Issue](#4-troubleshooting)
5. [Appendix: File Reference](#5-appendix)

---

## 1. Hasil Audit File — Tracked vs Ignored

### ✅ WAJIB di-track (repo)

| Kategori | File/Folder | Keterangan |
|----------|-------------|------------|
| Source code | `src/pages/*` | Semua halaman (index, tentang, program, kegiatan, donasi, kontak, 404) |
| Source code | `src/components/*` | UI components (Button, Card, Icon), sections (PageHeader), BaseHead |
| Source code | `src/layouts/BaseLayout.astro` | Layout utama (header, nav, footer, sosial media) |
| Source code | `src/lib/constants.ts` | Navigasi items, kategori labels |
| Source code | `src/data/site.ts` | Semua data konten (SITE, CONTACT, SOCIAL, STATS, DONATION) |
| Source code | `src/styles/global.css` | Tailwind theme, color palette, utilities |
| Source code | `src/content.config.ts` | Konfigurasi content collection |
| Source code | `src/content/kegiatan/*.md` | Artikel kegiatan (3 file) |
| Config | `astro.config.mjs` | Konfigurasi Astro (site URL, integrations) |
| Config | `package.json` | Dependencies & scripts |
| Config | `bun.lock` | Lockfile (commit WAJIB untuk reproduksi) |
| Config | `tsconfig.json` | TypeScript config |
| Config | `.gitignore` | Rules gitignore |
| Assets | `public/logo-yayasan.webp` | Logo utama (13KB, WebP) |
| Assets | `public/logo-yayasan-sm.webp` | Logo kecil (6KB, WebP) |
| Assets | `public/qris.webp` | QRIS (44KB, WebP) |
| Assets | `public/favicon.svg` | Favicon |
| Assets | `public/favicon.ico` | Favicon fallback |
| Docs | `.openkb/*.md` | Dokumentasi dan brainstorming (kecuali binary) |
| Docs | `PROJECT_STATUS.md` | Status project terkini |
| Tools | `.sisyphus/` | Work plans dari Sisyphus agent |

### ❌ JANGAN di-track

| Alasan | File/Folder | Keterangan |
|--------|-------------|------------|
| **Artifacts sementara** | `.playwright-mcp/` | Page snapshots, screenshot dari Playwright MCP — ephemeral |
| **Binary mentah** | `.openkb/*.pdf` | Dokumen legal (Akta, NIB, NPWP, Proposal) — **sensitif, besar** |
| **Binary mentah** | `.openkb/*.jpg` | Kop surat, logo mentah |
| **Binary mentah** | `.openkb/*.jpeg` | WhatsApp image |
| **Binary mentah** | `.openkb/*.png` | Logo mentah, qris mentah |
| **Binary mentah** | `.openkb/*.docx` | Proposal, profil (binary format) |
| **Binary mentah** | `.openkb/*.ai` | File Illustrator |
| **Binary mentah** | `.openkb/*.PNG` | (case-sensitive) |
| **Build output** | `dist/` | ✅ Sudah di .gitignore |
| **Generated types** | `.astro/` | ✅ Sudah di .gitignore |
| **Dependencies** | `node_modules/` | ✅ Sudah di .gitignore |

### .gitignore — Update yang Diperlukan

Tambahkan ini ke `.gitignore` sebelum commit pertama:

```gitignore
# Playwright MCP — ephemeral test artifacts
.playwright-mcp/

# OpenKB binary raw assets (dokumen legal, logo mentah, dll)
.openkb/*.pdf
.openkb/*.jpg
.openkb/*.jpeg
.openkb/*.png
.openkb/*.PNG
.openkb/*.docx
.openkb/*.ai
```

> **Catatan:** File `.md` di dalam `.openkb/` tetap di-track. Hanya binary-nya yang di-ignore.

---

## 2. Struktur Commit

### Prinsip

Setiap commit bersifat **atomic**:
- Satu domain per commit
- Bisa di-revert tanpa kena domain lain
- `git blame` langsung mengarah ke fitur spesifik
- Cocok untuk `git bisect` jika ada issue

### Urutan Eksekusi

```
Commit 1 ── Gitignore + Hapus template boilerplate
Commit 2 ── Config & assets
Commit 3 ── Data & content layer
Commit 4 ── UI Components
Commit 5 ── Layout & PageHeader
Commit 6 ── Semua pages + dokumentasi
```

> Urutan ini memastikan tidak ada dependency conflict. Config dulu, baru data, baru komponen, baru halaman.

---

### Commit 1: `chore: clean up Astro template boilerplate`

**Tujuan:** Membersihkan semua file bawaan template Astro yang tidak dipakai.

**Perubahan:**

| Action | Files |
|--------|-------|
| **Update** | `.gitignore` — tambah ignore rules untuk `.playwright-mcp/` dan binary `.openkb/` |
| **Delete** | `README.md` — README template Astro (sudah dihapus dari disk) |
| **Delete** | `src/content/blog/first-post.md` |
| **Delete** | `src/content/blog/markdown-style-guide.md` |
| **Delete** | `src/content/blog/second-post.md` |
| **Delete** | `src/content/blog/third-post.md` |
| **Delete** | `src/content/blog/using-mdx.mdx` |
| **Delete** | `src/pages/blog/[...slug].astro` |
| **Delete** | `src/pages/blog/index.astro` |
| **Delete** | `src/pages/about.astro` |
| **Delete** | `src/pages/rss.xml.js` |
| **Delete** | `src/pages/index.astro` — *(file baru akan di-add di Commit 6)* |
| **Delete** | `src/components/Footer.astro` |
| **Delete** | `src/components/Header.astro` |
| **Delete** | `src/components/HeaderLink.astro` |
| **Delete** | `src/components/FormattedDate.astro` |
| **Delete** | `src/consts.ts` |
| **Delete** | `src/layouts/BlogPost.astro` |
| **Delete** | `src/assets/blog-placeholder-1.jpg` |
| **Delete** | `src/assets/blog-placeholder-2.jpg` |
| **Delete** | `src/assets/blog-placeholder-3.jpg` |
| **Delete** | `src/assets/blog-placeholder-4.jpg` |
| **Delete** | `src/assets/blog-placeholder-5.jpg` |
| **Delete** | `src/assets/blog-placeholder-about.jpg` |
| **Delete** | `src/assets/fonts/atkinson-bold.woff` |
| **Delete** | `src/assets/fonts/atkinson-regular.woff` |

**Cara:**
```bash
git rm src/content/blog/*.md src/content/blog/*.mdx
git rm src/pages/blog/[...slug].astro src/pages/blog/index.astro
git rm src/pages/about.astro src/pages/rss.xml.js
git rm src/components/Footer.astro src/components/Header.astro
git rm src/components/HeaderLink.astro src/components/FormattedDate.astro
git rm src/consts.ts src/layouts/BlogPost.astro
git rm src/assets/blog-placeholder-*.jpg
git rm src/assets/fonts/atkinson-*.woff
git rm README.md
# Hati-hati: jangan git rm src/pages/index.astro — karena file baru akan di-add nanti
```

> **Catatan:** `src/pages/index.astro` sudah berubah total (modified, bukan deleted). File ini tetap ada tapi isinya berbeda. Jadi kita **tidak** `git rm` index.astro — cukup commit perubahannya saja di Commit 6.

---

### Commit 2: `chore: configure project settings and assets`

**Tujuan:** Menyimpan konfigurasi project dan aset statis.

**Perubahan:**

| Action | Files | Keterangan |
|--------|-------|------------|
| **Modified** | `astro.config.mjs` | Ubah site URL, tambah sitemap integration |
| **Modified** | `package.json` | Tambah dependencies (astro, tailwind, dll) |
| **Modified** | `bun.lock` | Update lockfile sesuai package.json |
| **Kept** | `tsconfig.json` | Tidak berubah dari template |
| **Add** | `public/logo-yayasan.webp` | Logo baru (WebP, 512px, 13KB) |
| **Add** | `public/logo-yayasan-sm.webp` | Logo kecil (WebP, 256px, 6KB) |
| **Add** | `public/qris.webp` | QRIS (WebP, 44KB) |

**Cara:**
```bash
git add astro.config.mjs package.json bun.lock tsconfig.json
git add public/logo-yayasan.webp public/logo-yayasan-sm.webp public/qris.webp
git commit -m "chore: configure project settings and assets"
```

---

### Commit 3: `feat: add data layer and content`

**Tujuan:** Menyimpan semua data konten dan konfigurasi content collection. Commit ini bisa di-blame kalo ada masalah dengan data yayasan (kontak salah, rekening salah, dll).

**Perubahan:**

| Action | Files |
|--------|-------|
| **Add** | `src/data/site.ts` — SITE, CONTACT, SOCIAL, STATS, DONATION |
| **Add** | `src/lib/constants.ts` — NAV_ITEMS, KATEGORI_LABELS |
| **Modified** | `src/content.config.ts` — Ubah dari blog ke kegiatan collection |
| **Add** | `src/content/kegiatan/jumat-bersedekah.md` |
| **Add** | `src/content/kegiatan/santunan-sembako-mei-2026.md` |
| **Add** | `src/content/kegiatan/wisuda-juz30-milad-3.md` |

**Cara:**
```bash
git add src/data/site.ts src/lib/constants.ts src/content.config.ts
git add src/content/kegiatan/
git commit -m "feat: add data layer and content"
```

---

### Commit 4: `feat: add UI components`

**Tujuan:** Menyimpan komponen UI yang reusable. Commit ini memudahkan tracking kalo ada issue di button style, card layout, atau icon rendering.

**Perubahan:**

| Action | Files |
|--------|-------|
| **Add** | `src/components/ui/Button.astro` — 5 varian (primary, gold, whatsapp, outline, outline-light) |
| **Add** | `src/components/ui/Card.astro` — 4 varian (default, hover, overflow, plain) |
| **Add** | `src/components/ui/Icon.astro` — SVG icons (18 icons, inline SVG) |

**Catatan:** Icon.astro berisi fix Tailwind v4 dynamic class issue — size di-passing sebagai atribut `width`/`height` langsung ke SVG element (bukan hanya CSS class). File ini penting untuk referensi jika ada masalah icon tidak muncul.

**Cara:**
```bash
git add src/components/ui/
git commit -m "feat: add UI components"
```

---

### Commit 5: `feat: add layout and navigation`

**Tujuan:** Menyimpan layout utama dan komponen navigasi. Commit ini penting untuk issue terkait header, footer, nav, atau social icons.

**Perubahan:**

| Action | Files |
|--------|-------|
| **Add** | `src/layouts/BaseLayout.astro` — Layout utama dengan navbar sticky, footer, social icons |
| **Add** | `src/components/sections/PageHeader.astro` — Gradient page header reusable |
| **Modified** | `src/components/BaseHead.astro` — OG image default, meta tags |

**BaseLayout terkena beberapa fix penting:**
- Footer h3 "Yayasan ASIB" — pakai `text-white` eksplisit (override global h3 text-warm-900)
- Social icons — pakai `width`/`height` eksplisit (fix Tailwind v4 dynamic class)
- Social icons — `p-1.5` untuk memperbesar click area

**Cara:**
```bash
git add src/layouts/BaseLayout.astro
git add src/components/sections/PageHeader.astro
git add src/components/BaseHead.astro
git commit -m "feat: add layout and navigation"
```

---

### Commit 6: `feat: add all pages and documentation`

**Tujuan:** Menyimpan semua halaman, styling global, dan dokumentasi project. Commit terbesar — jadi yang paling mungkin mengandung issue.

**Perubahan:**

| Action | Files | Keterangan |
|--------|-------|------------|
| **Modified** | `src/pages/index.astro` | Beranda — hero, stats, program, CTA |
| **Add** | `src/pages/tentang.astro` | Profil, visi-misi, legalitas, kontak |
| **Add** | `src/pages/program.astro` | 3 bidang program + CTA |
| **Add** | `src/pages/kegiatan/index.astro` | Daftar kegiatan (dynamic dari collection) |
| **Add** | `src/pages/kegiatan/[slug].astro` | Detail kegiatan (dynamic routing) |
| **Add** | `src/pages/donasi.astro` | Donasi channel, QRIS, Kitabisa |
| **Add** | `src/pages/kontak.astro` | Kontak info + form contact |
| **Add** | `src/pages/404.astro` | Halaman not found |
| **Modified** | `src/styles/global.css` | Full custom theme (primary, gold, warm) + utilities |
| **Add** | `.openkb/brainstorming.md` | Brainstorming fitur & design system |
| **Add** | `.openkb/yayasan-profile.md` | Profil yayasan |
| **Add** | `.openkb/audit-komprehensif.md` | Audit komprehensif |
| **Add** | `.openkb/commit-strategy.md` | Dokumen ini |
| **Add** | `PROJECT_STATUS.md` | Status project terkini |
| **Add** | `.sisyphus/` | Work plans Sisyphus |

**Cara:**
```bash
git add src/pages/ src/styles/global.css
git add .openkb/*.md PROJECT_STATUS.md .sisyphus/
git commit -m "feat: add all pages and documentation"
```

---

## 3. Cara Eksekusi

### Step-by-step (urut)

```bash
# 1. Update .gitignore dulu
#    Edit .gitignore — tambah rules untuk .playwright-mcp/ dan .openkb/ binary

# 2. Commit 1 — Clean template
git rm src/content/blog/*.md src/content/blog/*.mdx
git rm src/pages/blog/[...slug].astro src/pages/blog/index.astro
git rm src/pages/about.astro src/pages/rss.xml.js
git rm src/components/Footer.astro src/components/Header.astro
git rm src/components/HeaderLink.astro src/components/FormattedDate.astro
git rm src/consts.ts src/layouts/BlogPost.astro
git rm src/assets/blog-placeholder-*.jpg
git rm src/assets/fonts/atkinson-*.woff
git rm README.md
git add .gitignore
git commit -m "chore: clean up Astro template boilerplate"

# 3. Commit 2 — Config & assets
git add astro.config.mjs package.json bun.lock tsconfig.json
git add public/logo-yayasan.webp public/logo-yayasan-sm.webp public/qris.webp
git commit -m "chore: configure project settings and assets"

# 4. Commit 3 — Data & content
git add src/data/site.ts src/lib/constants.ts src/content.config.ts
git add src/content/kegiatan/
git commit -m "feat: add data layer and content"

# 5. Commit 4 — Components
git add src/components/ui/
git commit -m "feat: add UI components"

# 6. Commit 5 — Layout & navigation
git add src/layouts/BaseLayout.astro
git add src/components/sections/PageHeader.astro
git add src/components/BaseHead.astro
git commit -m "feat: add layout and navigation"

# 7. Commit 6 — Pages & documentation
git add src/pages/ src/styles/global.css
git add .openkb/*.md PROJECT_STATUS.md .sisyphus/
git commit -m "feat: add all pages and documentation"
```

### Verifikasi setelah semua commit

```bash
git log --oneline
# Output:
# 6a1b2c3 feat: add all pages and documentation
# 4d5e6f7 feat: add layout and navigation
# 7g8h9i0 feat: add UI components
# 1j2k3l4 feat: add data layer and content
# 5m6n7o8 chore: configure project settings and assets
# 9p0q1r2 chore: clean up Astro template boilerplate

git status
# Output: nothing to commit, working tree clean
```

---

## 4. Troubleshooting — Cara Lacak Issue

### Prinsip: `git blame` + `git log -- <file>`

Setiap issue bisa dilacak ke commit spesifik:

| Issue Yang Muncul | Cek Commit | File yang di-Blame |
|---|---|---|
| **Kontak/sosial media salah** | Commit 3 | `src/data/site.ts` |
| **Button tidak muncul** | Commit 4 | `src/components/ui/Button.astro` |
| **Icon tidak kelihatan** | Commit 4 | `src/components/ui/Icon.astro` |
| **Header/footer layout rusak** | Commit 5 | `src/layouts/BaseLayout.astro` |
| **Halaman error** | Commit 6 | `src/pages/<nama>.astro` |
| **Warna/tema bermasalah** | Commit 6 | `src/styles/global.css` |
| **Konten kegiatan salah** | Commit 3 | `src/content/kegiatan/<slug>.md` |
| **Build gagal** | Commit 2 | `astro.config.mjs`, `package.json` |
| **Tailwind class tidak jalan** | Commit 4 atau 6 | `global.css` atau komponen terkait |

### Git bisect (untuk bug regression)

```bash
# Mulai bisect
git bisect start

# Tandai commit terakhir sebagai "bad"
git bisect HEAD

# Tandai commit sebelum fitur ditambahkan sebagai "good"
git bisect good e51b209  # Initial commit dari Astro

# Git akan checkout midpoint — test, lalu:
git bisect good  # atau
git bisect bad

# Ulangi sampai ketemu commit pertama yang introduce bug
# Output: first bad commit
```

### Revert commit spesifik

```bash
# Kalo commit 3 bermasalah (data layer):
git revert <hash-commit-3>

# Kalo butuh partial revert, pake:
git revert --no-commit <hash>
git reset  # Unstage semua
git add <file-spesifik>
git commit -m "partial revert: fix <file>"
```

---

## 5. Appendix: File Reference

### Status File Awal (sebelum commit)

```
Tracked (dari template Astro):
  36 files

Modified (perubahan dari template):
  - astro.config.mjs
  - bun.lock
  - package.json
  - src/components/BaseHead.astro
  - src/content.config.ts
  - src/pages/index.astro
  - src/styles/global.css

Deleted (dari template, file dihapus):
  - README.md
  - 5 blog posts
  - 2 blog pages
  - about page
  - RSS page
  - 3 old components
  - consts.ts
  - BlogPost layout
  - 5 placeholder images
  - 2 font files

Untracked (file baru):
  - 19+ file (pages, components, data, content, assets, docs)
```

### File Baru — Detail

| Folder | Files |
|--------|-------|
| `src/pages/` | `index.astro`, `404.astro`, `tentang.astro`, `program.astro`, `donasi.astro`, `kontak.astro` |
| `src/pages/kegiatan/` | `index.astro`, `[slug].astro` |
| `src/layouts/` | `BaseLayout.astro` |
| `src/components/ui/` | `Button.astro`, `Card.astro`, `Icon.astro` |
| `src/components/sections/` | `PageHeader.astro` |
| `src/data/` | `site.ts` |
| `src/lib/` | `constants.ts` |
| `src/content/kegiatan/` | `jumat-bersedekah.md`, `santunan-sembako-mei-2026.md`, `wisuda-juz30-milad-3.md` |
| `public/` | `logo-yayasan.webp`, `logo-yayasan-sm.webp`, `qris.webp` |
| `.openkb/` | `brainstorming.md`, `yayasan-profile.md`, `audit-komprehensif.md`, `commit-strategy.md` |
| Root | `PROJECT_STATUS.md` |
| `.sisyphus/` | Work plan files |

---

*Dokumen ini bisa langsung dipakai oleh siapapun di tim untuk mengeksekusi commit atau melacak issue.*
*Terakhir diperbarui: 27 Mei 2026*
