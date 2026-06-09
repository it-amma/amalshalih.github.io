# Panduan Deployment Website Yayasan ASIB

> **Tujuan dokumen:** Memberikan pemahaman menyeluruh tentang deployment website
> kepada tim IT Yayasan ASIB — dari konsep dasar hingga praktik deployment di
> berbagai platform hosting.
> 
> **Target pembaca:** Tim IT ASIB (developer, maintenance, tangan kedua/handover)
> **Status:** ✅ **ACTIVE** — Production deployment guide
> **Last Updated:** 7 Juni 2026

---

## Daftar Isi

- [1. Konsep Dasar Deployment](#1-konsep-dasar-deployment)
- [2. Ringkasan Project](#2-ringkasan-project)
- [3. Persiapan Build](#3-persiapan-build)
- [4. Cloudflare Workers (Aktif)](#4-cloudflare-pages-aktif)
- [5. Vercel (Alternatif)](#5-vercel-alternatif)
- [6. Platform Lain](#6-platform-lain)
- [7. Perbandingan & Rekomendasi](#7-perbandingan--rekomendasi)
- [8. Troubleshooting](#8-troubleshooting)
- [9. Glossary](#9-glossary)

---

## 1. Konsep Dasar Deployment

### 1.1. Apa Itu Deployment?

Deployment adalah proses meng-upload file website (HTML, CSS, JS, gambar) ke
sebuah server agar bisa diakses oleh publik melalui internet.

Bayangkan seperti ini:
- **Local computer:** File website ada di laptop — cuma Anda yang bisa lihat
- **Build:** Semua file diubah jadi format siap publikasi (HTML statis)
- **Deploy:** File hasil build dikirim ke server hosting — seluruh dunia bisa akses

### 1.2. Static Site vs Workers SSR

Website Yayasan ASIB adalah **Workers SSR**:

| Konsep | Static Site | Server-Side (SSR) |
|--------|-------------|-------------------|
| **HTML** | Sudah jadi saat build | Dibuat setiap ada request |
| **Server** | Serve file + compute runtime | Perlu runtime (Node.js, PHP, dll) |
| **Kecepatan** | Super cepat (CDN) | Bergantung server |
| **Biaya** | Murah / gratis | Lebih mahal |
| **Kompleksitas** | Sederhana | Lebih rumit |

Karena Astro di-mode `static`, output build kita adalah runtime server module —
bisa dideploy ke **hosting manapun** tanpa persyaratan khusus.

### 1.3. Istilah Penting

| Istilah | Arti |
|---------|------|
| **Build** | Proses mengubah source code jadi file siap deploy (`astro build` → folder `dist/`) |
| **Deploy** | Upload file build ke hosting |
| **CDN** | Content Delivery Network — server tersebar di banyak lokasi biar akses cepat |
| **CI/CD** | Continuous Integration / Continuous Deployment — auto-deploy tiap kali ada perubahan kode |
| **Environment** | Lingkungan: `development` (local), `preview` (uji coba), `production` (live) |
| **Domain** | Nama website (contoh: `amalshalih.or.id`) |

---

## 2. Ringkasan Project

### 2.1. Build Output

```bash
bun run build    # → folder dist/
```

Hasil build:
```
dist/
├── index.html              # Beranda
├── 404.html                # Halaman tidak ditemukan
├── donasi/
│   └── index.html
├── kegiatan/
│   ├── index.html
│   ├── jumat-bersedekah/
│   │   └── index.html
│   ├── santunan-sembako-mei-2026/
│   │   └── index.html
│   └── wisuda-juz30-milad-3/
│       └── index.html
├── kontak/
│   └── index.html
├── program/
│   └── index.html
├── rss.xml                  # RSS Feed
├── tentang/
│   └── index.html
└── sitemap-index.xml        # Untuk SEO
```

> **Catatan:** Folder `dist/` adalah **satu-satunya** yang perlu di-upload ke hosting.
> File lainnya (`src/`, `node_modules/`, `astro.config.mjs`) tidak perlu.

### 2.2. Kebutuhan Hosting

Minimal hosting harus bisa:
- ✅ Menyajikan file statis (HTML, CSS, JS, gambar)
- ✅ Mengarahkan semua route ke `index.html` (SPA fallback atau rewrite)
- ✅ HTTPS (SSL) otomatis
- ✅ Mendukung custom domain

**Semua platform di dokumen ini memenuhi persyaratan tersebut.**

### 2.3. Build Command & Output

| Parameter | Value |
|-----------|-------|
| **Framework** | Astro 6.x |
| **Package manager** | Bun 1.x |
| **Build command** | `bun run build` (atau `npm run build` jika pake npm) |
| **Output directory** | `dist/` |
| **Node.js requirement** | >= 22.12.0 |

---

## 3. Persiapan Build

Sebelum deploy ke platform manapun, pastikan build berhasil dulu:

```bash
# 1. Install dependencies (sekali saja, atau saat ada perubahan)
bun install

# 2. Build website
bun run build

# 3. Cek hasil
ls dist/

# 4. (Opsional) Preview hasil build
bun run preview
```

Jika build error, cek:
- Semua import path benar
- Tidak ada TypeScript error
- Versi Bun kompatibel (`bun --version` minimal 1.2)
- Content collection valid (file `.md` di `src/content/kegiatan/`)

---

## 4. Cloudflare Workers (Aktif)

### 4.1. Status Saat Ini

| Item | Status |
|------|--------|
| **Project name** | `amalshalih` |
| **Domain** | `https://amalshalih.pages.dev` |
| **Custom domain** | `amalshalih.or.id` (aktif) |
| **Production branch** | `main` |
| **Metode deploy** | **Sementara:** Manual via Wrangler CLI |
| **Target:** | **Auto-deploy via Git** (setelah hubungkan GitHub) |

### 4.2. Metode A: Auto-deploy via Git (DIREKOMENDASIKAN)

**Prasyarat:**
- Repository sudah di-push ke GitHub
- Akun Cloudflare sudah connect ke GitHub

**Langkah-langkah:**

1. **Hapus project Direct Upload yang lama** (kalau ada)
   - Dashboard Cloudflare → Pages → `amalshalih`
   - Settings → scroll ke bawah → **Delete project**
   - Konfirmasi

2. **Buat project baru via Git**
   - Dashboard Cloudflare → **Workers & Pages** → **Create** → **Pages**
   - Pilih **Connect to Git**
   - Authorize GitHub (install Cloudflare Workers & Pages GitHub App)
   - Pilih repository: `yayasan-amal-shalih-insan-bantul`
   - Isi konfigurasi:

   | Field | Value |
   |-------|-------|
   | Project name | `amalshalih` |
   | Production branch | `main` |
   | Build command | `bun run build` |
   | Build output | `dist` |

   - Klik **Save and Deploy**

3. **Selesai.** Setiap `git push` ke `main` otomatis:
   - Trigger build di Cloudflare
   - Deploy ke `https://amalshalih.pages.dev`
   - Hasil terlihat dalam 1-2 menit

### 4.3. Metode B: Manual Deploy via Wrangler CLI (Cadangan)

Gunakan metode ini jika Git integration belum aktif atau untuk testing.

**Setup (sekali):**

```bash
# Login ke Cloudflare via Wrangler
bunx wrangler login
# → Akan terbuka browser, login dengan akun Cloudflare timitasib
```

Alternatif: jika Wrangler login via browser tidak bisa (misalnya di server tanpa GUI):

```bash
# Set API token langsung
```

**Deploy manual:**

```bash
bun run build
bunx wrangler pages deploy dist/ --project-name=amalshalih
```

**Cek status:**

```bash
bunx wrangler pages deployment list --project-name=amalshalih
```

### 4.4. Konfigurasi Cloudflare

Konfigurasi disimpan di `wrangler.jsonc`:

```jsonc
{
	"name": "amalshalih",
	"pages_build_output_dir": "dist"
}
```

> **Catatan:** File ini hanya untuk referensi. Saat pake Git integration,
> konfigurasi di-set via dashboard (build command, output dir, dll).

### 4.5. Setup Custom Domain

Setelah project terhubung ke Git dan auto-deploy berjalan:

1. Dashboard Cloudflare → Pages → `amalshalih`
2. **Custom domains** → **Set up a custom domain**
3. Masukkan `amalshalih.or.id`

5. Selesai. Website bisa diakses via `https://amalshalih.or.id`

**Catatan penting:** Domain `amalshalih.or.id` adalah domain aktif. Domain `amalshalih.id` (legacy) di-redirect ke `amalshalih.or.id` untuk brand protection.
(di registrar domain seperti Niagahoster, DomaiNesia, dll.) dan nameserver-nya
diarahkan ke Cloudflare untuk bisa manage DNS.

### 4.6. Environment Variables

Jika di masa depan perlu menyimpan API key (misalnya Formspree, Google Analytics),
bisa set di:

Dashboard Cloudflare → Pages → `amalshalih` → **Settings** → **Environment variables**

Variable yang mungkin diperlukan nanti:
- `RESEND_API_KEY` — ID form kontak (jika pakai plan berbayar)
- `PUBLIC_GA_ID` — Google Analytics (jika dipasang)

### 4.7. Preview Deployments (Branch)

Cloudflare Pages otomatis membuat preview URL untuk setiap Pull Request.
Setiap PR akan punya URL unik seperti:
```
https://www-staging.asib.workers.dev (Staging preview)
```
Ini berguna untuk review sebelum merge ke production.

---

## 5. Vercel (Alternatif)

### 5.1. Kenapa Vercel?

Vercel adalah kompetitor utama Cloudflare Pages (+ 1st-class support sama Astro + Next.js).
Beberapa kelebihan:

- **Zero config** — Vercel auto-detect Astro, nggak perlu konfigurasi manual
- **Preview URLs** — setiap commit langsung dapat URL preview
- **Serverless functions** — kalau butuh backend ringan, tinggal taruh file di `api/`
- **Analytics** — built-in web analytics (berbayar untuk production)
- **Edge Network** — CDN global kayak Cloudflare

### 5.2. Cara Deploy ke Vercel

**Opsi A: Via Vercel Dashboard (termudah)**

1. Push repository ke GitHub
2. Buka [vercel.com](https://vercel.com) → Login via GitHub
3. Klik **Add New** → **Project**
4. Import repository `yayasan-amal-shalih-insan-bantul`
5. Vercel auto-detect:
   - Framework: **Astro** ✅
   - Build command: `astro build` (Vercel pakai npm default)
   - Output: `dist` ✅
6. Klik **Deploy**
7. Selesai. Auto-deploy tiap `git push`.

> **Catatan:** Vercel default pakai `npm`. Karena project kita pake Bun,
> ubah build command jadi: `npm install && npx astro build`
> (Vercel sudah punya Node.js, nggak perlu Bun runtime untuk Astro static).

**Opsi B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### 5.3. Konfigurasi Vercel

Bisa pakai `vercel.json` di root project:

```jsonc
{
  "framework": "astro",
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

Atau lebih simpel — tidak perlu config sama sekali, Vercel auto-detect.

### 5.4. Custom Domain di Vercel

1. Dashboard Vercel → Project → **Settings** → **Domains**
2. Masukkan `amalshalih.or.id`
3. Ikuti instruksi DNS (arahkan domain ke Vercel)
4. SSL otomatis aktif

### 5.5. Perbedaan Vercel vs Cloudflare Pages

| Aspek | Vercel | Cloudflare Pages |
|-------|--------|------------------|
| **Setup** | 1 klik (auto-detect) | 2-3 klik |
| **Auto-deploy** | ✅ Default | ✅ (setelah setup) |
| **Preview URLs** | ✅ | ✅ |
| **Bandwidth** | 100 GB/bln (free) | Unlimited (free) |
| **Builds** | 6000 menit/bln | 500 build/bln |
| **Edge Functions** | ✅ (Vercel Edge) | ✅ (Pages Functions) |
| **Serverless Functions** | ✅ (Node.js) | ✅ (workers) |
| **Analytics** | ➖ Berbayar | ➖ Tidak ada bawaan |
| **Custom domain** | ✅ 1 domain (free) | ✅ 100 domain (free) |
| **CDN** | Global | Global (network terbesar) |

---

## 6. Platform Lain

### 6.1. GitHub Pages

**Bisa?** Ya, untuk Astro static site.

**Cara:**

1. Push ke GitHub
2. Settings repo → **Pages**
3. Source: **GitHub Actions**
4. Buat file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install && bun run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

**Kekurangan:**
- Tidak support SPA fallback = perlu kerja ekstra untuk routing
- Repository harus **public** (kecuali pakai GitHub Enterprise)
- Hanya untuk project yang ada di GitHub

### 6.2. Netlify

Mirip Vercel. Auto-detect Astro.

1. Login netlify.com via GitHub
2. Import repository
3. Build command: `bun run build` (atau `npm run build`)
4. Output: `dist`
5. Deploy

Keunggulan Netlify:
- **Forms** — built-in form handler (bisa ganti Formspree)
- **Split testing** — A/B testing untuk branch
- **Unlimited bandwidth** (free tier generous)

### 6.3. Traditional Hosting (cPanel, Shared Hosting)

**Bisa?** Ya, tapi kurang optimal untuk Astro static site.

**Cara:**
1. Build: `bun run build`
2. Upload isi folder `dist/` ke server via FTP / File Manager cPanel
3. Pastikan ada `.htaccess` (Apache) untuk rewrite rules:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Kekurangan:**
- Tidak ada auto-deploy (manual upload)
- Tidak ada CDN (kecuali pakai Cloudflare proxy)
- Performa lebih lambat
- HTTPS perlu setup manual

---

## 7. Perbandingan & Rekomendasi

### 7.1. Tabel Perbandingan Lengkap

| Fitur | Cloudflare Pages | Vercel | Netlify | GitHub Pages |
|-------|-----------------|--------|---------|--------------|
| **Auto-deploy via Git** | ✅ | ✅ | ✅ | ✅ (via Actions) |
| **Free SSL** | ✅ | ✅ | ✅ | ✅ |
| **Custom domain** | ✅ (100 domain) | ✅ (1 domain free) | ✅ | ✅ |
| **Bandwidth free** | Unlimited | 100 GB/bln | 100 GB/bln | 100 GB/bln |
| **Build limit** | 500 build/bln | 6.000 menit/bln | 300 menit/bln | 2.000 menit/bln (Actions) |
| **SPA fallback** | ✅ otomatis | ✅ otomatis | ✅ otomatis | ❌ perlu kerja ekstra |
| **Preview URLs** | ✅ | ✅ | ✅ | ❌ |
| **Serverless fn** | ✅ Workers | ✅ Edge + Node | ✅ | ❌ |
| **Analytics bawaan** | ❌ | ✅ (berbayar) | ✅ | ❌ |
| **Deteksi Astro** | Manual setup | ✅ Otomatis | ✅ Otomatis | Manual |
| **Biaya bulanan** | Gratis | Gratis | Gratis | Gratis |
| **Ekstra untuk performa** | Tidak ada | Vercel Speed Insight | Netlify Analytics | Tidak ada |

### 7.2. Rekomendasi untuk Yayasan ASIB

**Peringkat (1 = terbaik):**

| Peringkat | Platform | Alasan |
|-----------|----------|--------|
| 🥇 | **Cloudflare Pages** | Unlimited bandwidth, network terbesar, cocok untuk Indonesia, gratis selamanya |
| 🥈 | **Vercel** | Setup paling mudah, 1st-class Astro support, fitur preview keren |
| 🥉 | **Netlify** | Solid, fitur forms built-in bisa ganti Formspree |
| 4 | **GitHub Pages** | Gratis tapi ribet untuk SPA routing, repo harus public |
| 5 | **Shared Hosting** | Tidak recommended untuk Astro, manual upload, performa jelek |

**Keputusan saat ini: Cloudflare Pages** ✅
- Unlimited bandwidth → tidak khawatir biaya tambahan
- Network Cloudflare luas di Indonesia
- Gratis untuk selamanya (tidak ada trial)
- Support custom domain (100 domain di free plan)

### 7.3. Migrasi Antar Platform

Karena website kita static, migrasi antar platform sangat mudah:

1. Build ulang: `bun run build`
2. Output `dist/` bisa di-deploy ke platform manapun
3. Update DNS arahkan domain ke platform baru

**Tidak ada vendor lock-in.** Seluruh konten dan kode tetap di repository GitHub.

---

## 8. Troubleshooting

### 8.1. Build Error: "Bun tidak tersedia di environment"

Cloudflare Pages dan Vercel default pakai npm, bukan Bun.

**Solusi:**
- Biarkan build command tetap `bun run build` — Cloudflare sudah support Bun.
- Kalau gagal, ganti build command ke: `npm install && npm run build`

### 8.2. Build Error: "Node.js version too old"

**Solusi:**
- Cloudflare Pages: Settings → **Environment variables** → `NODE_VERSION=22`
- Vercel: Settings → **Node.js Version** → 22.x
- Atau di `package.json` sudah ada `"engines": { "node": ">=22.12.0" }`

### 8.3. 404 di Halaman Selain Home

Astro static menghasilkan file HTML untuk tiap halaman. File `404.html` sudah ada.
Pastikan di platform ada pengaturan **SPA fallback** atau **404 rewrites**:

- **Cloudflare Pages:** Otomatis handle, nggak perlu konfigurasi
- **Vercel:** Otomatis handle
- **Netlify:** Otomatis handle
- **GitHub Pages:** Perlu setting di `.htaccess` atau konfigurasi Jekyll

### 8.4. Custom Domain Tidak Bisa Diakses

**Ceklist:**
1. ✅ Domain sudah terdaftar (registrar aktif)
2. ✅ Nameserver diarahkan ke Cloudflare (untuk Cloudflare Pages)
3. ✅ DNS record CNAME / A sudah benar
4. ✅ SSL sudah active (bisa sampai 24 jam untuk propagasi)
5. ✅ Tunggu propagasi DNS (beberapa menit sampai 24 jam)

### 8.5. Image Tidak Muncul

- Path gambar harus relatif atau absolute dari root (`/logo-yayasan.webp`)
- Format gambar didukung: WebP, JPG, PNG, SVG
- Pastikan image ada di folder `public/`

---

## 9. Glossary

| Istilah | Penjelasan |
|---------|-----------|
| **Astro** | Framework website modern — bikin website cepat dengan zero JavaScript |
| **Bun** | Package manager & JavaScript runtime — lebih cepat dari Node.js |
| **Build** | Proses mengubah kode jadi file siap deploy |
| **CDN** | Server di banyak negara — bikin website cepat diakses dari mana saja |
| **CI/CD** | Otomatisasi deploy — push kode, langsung live |
| **CLI** | Command Line Interface — perintah di terminal |
| **CNAME** | DNS record — mengarahkan subdomain ke domain lain |
| **DNS** | Sistem yang menerjemahkan nama domain ke IP server |
| **Environment** | Lingkungan development vs production |
| **Git** | Version control — nyimpat history perubahan kode |
| **Hosting** | Tempat nyimpen file website biar bisa diakses internet |
| **Production** | Website live yang diakses publik |
| **Repository** | Folder project yang di-track oleh Git |
| **RSS Feed** | Format untuk distribusi konten (berita/kegiatan) |
| **Sitemap** | File XML — bantu Google index semua halaman |
| **SSL/TLS** | Enkripsi koneksi — bikin website aman (https) |
| **Static Site** | Website dari file HTML statis — cepat dan murah |
| **SSR** | Server Side Rendering — HTML dibuat tiap ada pengunjung |
| **WebP** | Format gambar modern — ukuran kecil, kualitas bagus |
| **Workers** | Cloudflare serverless functions — kode jalan di edge server |
| **Wrangler** | CLI untuk deploy ke Cloudflare |

---

## Lampiran: Deployment Cheatsheet

```bash
# =====================
# BUILD
# =====================
bun install                # Install dependencies
bun run build              # Build ke folder dist/
bun run preview            # Preview hasil build (local)
bun run dev                # Development server

# =====================
# CLOUDFLARE PAGES
# =====================
# Setup (sekali):
bunx wrangler login

# Deploy manual:
bunx wrangler pages deploy dist/ --project-name=amalshalih

# Cek deployment:
bunx wrangler pages deployment list --project-name=amalshalih

# =====================
# VERCEL
# =====================
# Setup (sekali):
npx vercel login

# Deploy:
npx vercel
npx vercel --prod

# =====================
# GIT (trigger auto-deploy)
# =====================
# Git integration aktif → push ke main = auto-deploy
git add .
git commit -m "feat: ..."
git push origin main
```

---

> **Dokumen ini diperbarui secara berkala.**
> **Terakhir diperbarui:** 7 Juni 2026
> **Oleh:** PT Koneksi Jaringan Indonesia
