# Yayasan Amal Shalih Insan Bantul — Website Resmi

[![Astro](https://img.shields.io/badge/Astro-6.x-BC52EE?logo=astro)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Bun](https://img.shields.io/badge/Bun-1.x-000000?logo=bun)](https://bun.sh)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com)
[![WCAG AA](https://img.shields.io/badge/WCAG-AA-1a7f37)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **Repository internal — PT Koneksi Jaringan Indonesia**
> Website resmi Yayasan Amal Shalih Insan Bantul (ASIB), dibangun sebagai solusi digital
> untuk menunjang visi dakwah, transparansi donasi, dan pelayanan publik yayasan.

---

## Daftar Isi

- [Sekilas Project](#sekilas-project)
- [Tech Stack](#tech-stack)
- [Fitur](#fitur)
- [Struktur Project](#struktur-project)
- [Persiapan Lingkungan](#persiapan-lingkungan)
- [Development](#development)
- [Build & Deploy](#build--deploy)
- [Design System](#design-system)
- [Commit Convention](#commit-convention)
- [Tim Pengembang](#tim-pengembang)

---

## Sekilas Project

**Yayasan Amal Shalih Insan Bantul (ASIB)** adalah organisasi nirlaba yang bergerak di bidang
Pendidikan Islam, Sosial Kemanusiaan, dan Keagamaan. Website ini dibangun untuk:

| Tujuan | Deskripsi |
|--------|-----------|
| **Publikasi** | Menampilkan profil, program, dan kegiatan yayasan secara transparan |
| **Donasi** | Memudahkan donatur menyalurkan donasi melalui berbagai channel (transfer bank, QRIS, Kitabisa) |
| **Dakwah Digital** | Menjangkau masyarakat luas dengan informasi keislaman dan laporan kegiatan |
| **Profesionalitas** | Menunjukkan keseriusan yayasan sebagai lembaga yang modern dan terpercaya |

**Domain:** [https://amalshalih.id](https://amalshalih.id)
**Status:** 🟢 Production (Private Repository)

---

## Tech Stack

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| **Framework** | [Astro](https://astro.build) v6 | Static Site Generator, island architecture |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) v4 | Utility-first CSS dengan custom theme |
| **Package Manager** | [Bun](https://bun.sh) | Runtime & package manager |
| **Icons** | Inline SVG via komponen `<Icon />` | Zero dependency icon system |
| **Content** | Astro Content Collections | Markdown/MDX untuk konten kegiatan |
| **Sitemap** | `@astrojs/sitemap` | Auto-generate sitemap.xml |
| **Deployment** | [Cloudflare Pages](https://pages.cloudflare.com) | Edge deployment, CDN global |
| **Monitoring** | [Sentry](https://sentry.io) + [Spotlight](https://spotlightjs.com) | Error tracking & debugging |
| **Kualitas Gambar** | WebP | Semua aset gambar dikompresi ke format WebP |

### Persyaratan Sistem

| Dependency | Versi Minimal |
|------------|---------------|
| [Bun](https://bun.sh) | ≥ 1.2 |
| [Node.js](https://nodejs.org) | ≥ 22.12.0 (via Bun) |

---

## Fitur

### Halaman

| Halaman | Route | Konten |
|---------|-------|--------|
| **Beranda** | `/` | Hero section, statistik, program unggulan, ajakan donasi |
| **Tentang** | `/tentang` | Profil yayasan, visi-misi, legalitas (SK, NIB, NPWP) |
| **Program** | `/program` | 3 pilar program: Pendidikan, Keagamaan, Sosial |
| **Kegiatan** | `/kegiatan` | Daftar kegiatan & berita (dinamis dari content collection) |
| **Detail Kegiatan** | `/kegiatan/:slug` | Konten lengkap kegiatan |
| **Donasi** | `/donasi` | Channel donasi (BSI, QRIS, Kitabisa) |
| **Kontak** | `/kontak` | Alamat, telepon, email, form kontak (Formspree) |
| **404** | `/*` | Halaman tidak ditemukan |

### Aksesibilitas

Website ini dibangun dengan **WCAG AA** sebagai standar minimum:

- ✅ Kontras warna minimum 4.5:1 untuk semua teks
- ✅ Semantic HTML (`<header>`, `<main>`, `<article>`, `<nav>`, `<footer>`)
- ✅ Skip-to-content link
- ✅ ARIA labels pada icon dan link sosial media
- ✅ Focus-visible ring untuk keyboard navigasi
- ✅ Form labels dan required attributes
- ✅ Responsive sampai 320px viewport width

### Performa

- ✅ **WebP** — semua gambar dalam format WebP (logo: 13KB, QRIS: 44KB)
- ✅ **Zero JS runtime** — Astro static rendering, tanpa JavaScript di client
- ✅ **CSS purging** — Tailwind v4 hanya generate class yang terpakai
- ✅ **Sitemap otomatis** — untuk SEO
- ✅ **Font system** — menggunakan system font stack + Inter (variable font)

---

## Struktur Project

```
yayasan-amal-shalih-insan-bantul/
├── public/                          # Aset statis (favicon, logo, QRIS)
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── logo-yayasan.webp            # Logo utama (512px, 13KB)
│   ├── logo-yayasan-sm.webp         # Logo kecil (256px, 6KB)
│   └── qris.webp                    # QRIS (44KB)
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   └── PageHeader.astro     # Gradient page header (reusable)
│   │   ├── ui/
│   │   │   ├── Button.astro         # 5 varian button
│   │   │   ├── Card.astro           # 4 varian card
│   │   │   └── Icon.astro           # SVG icon system (18 icons)
│   │   └── BaseHead.astro           # SEO & meta tags
│   ├── content/
│   │   └── kegiatan/                # Markdown content collection
│   │       ├── jumat-bersedekah.md
│   │       ├── santunan-sembako-mei-2026.md
│   │       └── wisuda-juz30-milad-3.md
│   ├── data/
│   │   └── site.ts                  # Semua data konten (SITE, CONTACT, SOCIAL, dll)
│   ├── layouts/
│   │   └── BaseLayout.astro         # Layout utama (header, nav, footer)
│   ├── lib/
│   │   └── constants.ts             # NAV_ITEMS, KATEGORI_LABELS
│   ├── pages/
│   │   ├── index.astro              # Beranda
│   │   ├── 404.astro                # Not Found
│   │   ├── tentang.astro
│   │   ├── program.astro
│   │   ├── donasi.astro
│   │   ├── kontak.astro
│   │   └── kegiatan/
│   │       ├── index.astro          # Daftar kegiatan
│   │       └── [slug].astro         # Detail kegiatan (dynamic route)
│   └── styles/
│       └── global.css               # Tailwind theme, custom utilities
├── .openkb/                         # Pengetahuan project (internal team)
│   ├── brainstorming.md
│   ├── yayasan-profile.md
│   ├── audit-komprehensif.md
│   └── commit-strategy.md
├── .sisyphus/                       # Work plans Sisyphus AI agent
├── sentry.client.config.js          # Sentry client-side initialization
├── sentry.server.config.js          # Sentry server-side initialization
├── .env.example                     # Contoh environment variables
├── wrangler.toml                    # Cloudflare Pages config
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── bun.lock
```

---

## Persiapan Lingkungan

### 1. Clone Repository

```bash
git clone <repo-url>
cd yayasan-amal-shalih-insan-bantul
```

### 2. Install Dependencies

```bash
bun install
```

> **Catatan:** Project ini menggunakan **Bun** sebagai package manager.
> Jangan gunakan `npm install` atau `yarn` — lockfile (`bun.lock`) hanya kompatibel dengan Bun.

### 3. Environment Variables

Salin `.env.example` ke `.env` dan isi nilai yang diperlukan:

```bash
cp .env.example .env
```

| Variable | Wajib | Deskripsi |
|----------|-------|-----------|
| `SENTRY_AUTH_TOKEN` | ✅ Production | Auth token Sentry untuk source maps & release tracking. Generate di [sentry.io](https://sentry.io/settings/account/api/auth-tokens/). Scope: `org:read`, `project:releases`, `project:write` |
| `SANITY_API_READ_TOKEN` | ❌ Opsional | Read-only token Sanity. Tidak diperlukan untuk development karena konten di-fetch publik |

> **Catatan:** Sentry hanya aktif di production. Spotlight aktif di development mode untuk debugging lokal.

---

## Development

### Menjalankan Development Server

```bash
bun run dev
```

Server akan berjalan di `http://localhost:4321` dengan hot-reload.

### Mematikan Server

```
Ctrl + C
```

### Build Production

```bash
bun run build
```

Output akan tersimpan di `dist/` — siap dideploy.

### Preview Build

```bash
bun run preview
```

---

## Build & Deploy

### Cloudflare Pages

Project ini dideploy ke **Cloudflare Pages** dengan konfigurasi:

| Parameter | Value |
|-----------|-------|
| **Framework preset** | Astro |
| **Build command** | `bun run build` |
| **Build output** | `dist/` |
| **Node version** | 22.x |

### Cara Deploy

**Automatic (via Git):**
1. Push ke branch `main` di GitHub
2. Cloudflare Pages auto-detect perubahan dan trigger build

**Manual (via Wrangler CLI):**
```bash
bunx wrangler pages deploy dist/ --project-name=amalshalih
```

> **Catatan:** Untuk deployment production, pastikan environment variables
> sudah dikonfigurasi di dashboard Cloudflare Pages.

---

## Observability & Monitoring

### Sentry — Error Tracking

Project menggunakan [Sentry](https://sentry.io) untuk memantau error di production.

**Inisialisasi:**

DSN dan konfigurasi ada di:
- `sentry.client.config.js` — konfigurasi client-side (browser)
- `sentry.server.config.js` — konfigurasi server-side (SSR/API)

**Integrasi Astro:**

`@sentry/astro` terdaftar sebagai integration di `astro.config.mjs`:
```js
sentry({
	project: 'amalshalih',
	org: 'yayasan-amal-shalih-insan-bant',
	authToken: process.env.SENTRY_AUTH_TOKEN,
})
```

**Environment Variables:**

| Variable | Required | Source |
|----------|----------|--------|
| `SENTRY_AUTH_TOKEN` | ✅ Production | [sentry.io → Settings → API → Auth Tokens](https://sentry.io/settings/account/api/auth-tokens/) |

Scopes yang dibutuhkan: `org:read`, `project:releases`, `project:write`

### Spotlight — Debugging Sidecar

[Spotlight](https://spotlightjs.com) adalah sidecar debugger yang menampilkan log Sentry secara real-time di localhost.

**Aktivasi:**

```bash
bunx spotlight
```

Kemudian akses `http://localhost:4321` — panel Spotlight akan muncul di pojok kanan bawah.

**Konfigurasi:**

Spotlight terdaftar sebagai integration di `astro.config.mjs`. Urutan penting:
```js
integrations: [
	sentry(),      // 1. Sentry dulu
	spotlightjs(), // 2. Spotlight setelah Sentry
]
```

Spotlight **hanya aktif** di development — tidak akan muncul di production.

### Struktur File

```
sentry.client.config.js    # Inisialisasi Sentry untuk browser
sentry.server.config.js    # Inisialisasi Sentry untuk server
.env.example               # Contoh environment variables (token, dll)
```

---

## Design System

Dokumen design system lengkap tersedia di:
📄 [`.openkb/brainstorming.md`](.openkb/brainstorming.md) — section **"Design System & Visual Identity"**

### Prinsip Desain

| Prinsip | Penerapan |
|---------|-----------|
| **WCAG AA** | Semua kombinasi warna minimum 4.5:1 |
| **Modern Islamic** | Warm, berlapis, elegan — hijau islami + gold aksen |
| **Mobile First** | Responsive dari 320px ke atas |
| **Zero JS Client** | Semua halaman static, tanpa JavaScript runtime |
| **Konsisten** | Satu design language di semua halaman |

### Palet Warna

| Role | Color | Tailwind Class |
|------|-------|----------------|
| **Primary** (Islamic Green) | #166534 → #14532d | `primary-800` → `primary-900` |
| **Gold** (Accent) | #fcd34d → #f59e0b | `gold-300` → `gold-500` |
| **Warm** (Neutral) | #fafaf9 → #1c1917 | `warm-50` → `warm-900` |

---

## Commit Convention

Project ini mengikuti **Conventional Commits** dengan format:

```
<type>: <deskripsi singkat>
```

| Type | Penggunaan |
|------|------------|
| `feat` | Fitur baru (halaman, komponen, data) |
| `fix` | Bug fix (WCAG, styling, accessibility) |
| `chore` | Tugas maintenance (config, cleanup, dependencies) |
| `docs` | Dokumentasi (README, brainstorming, handover) |
| `refactor` | Perubahan kode tanpa perubahan fungsionalitas |
| `style` | Perubahan styling (formatting, spacing, warna) |

### Struktur Commit per Domain

Setiap commit bersifat **atomic** — satu domain per commit:

```bash
# Contoh:
chore: clean up Astro template boilerplate
chore: configure project settings and assets
feat: add data layer and content
feat: add UI components
feat: add layout and navigation
feat: add all pages and documentation
fix: resolve WCAG contrast on page header titles
```

> **Referensi:** Dokumen commit strategy lengkap →
> [`.openkb/commit-strategy.md`](.openkb/commit-strategy.md)

---

## Tim Pengembang

| Peran | Nama / Tim | Keterangan |
|-------|------------|------------|
| **Pengembang** | PT Koneksi Jaringan Indonesia | Development & maintenance |
| **Klien** | Yayasan Amal Shalih Insan Bantul (ASIB) | Pemilik produk & konten |

> **PT Koneksi Jaringan Indonesia**
> Perusahaan pengembang perangkat lunak yang berfokus pada solusi digital
> untuk organisasi nirlaba, pendidikan, dan dakwah Islam.

### Kontak Pengembang

Untuk issue teknis, pengembangan fitur, atau maintenance, hubungi tim pengembang
melalui kanal yang telah ditentukan dalam kontrak project.

---

## Lisensi

**Hak Cipta © 2026 Yayasan Amal Shalih Insan Bantul**

Repository ini bersifat **private** dan seluruh hak cipta dilindungi undang-undang.
Tidak diperkenankan mendistribusikan, menggandakan, atau menggunakan kode ini
tanpa izin tertulis dari pemilik hak cipta.

---

*Dokumen README ini diperbarui secara berkala.*
*Terakhir diperbarui: 27 Mei 2026*
