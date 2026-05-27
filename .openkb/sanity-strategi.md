# Sanity CMS — Strategi, Arsitektur & Panduan Lengkap

> **Untuk:** Tim Engineering PT Koneksi Jaringan Indonesia & Tim IT Yayasan ASIB
> **Tujuan:** Dokumentasi komprehensif tentang Sanity CMS — dari keputusan strategis,
> arsitektur teknis, pricing, self-hosting, hingga panduan operasional harian.
> **Terakhir diperbarui:** 27 Mei 2026

---

## Daftar Isi

- [1. Ringkasan Eksekutif](#1-ringkasan-eksekutif)
- [2. Latar Belakang: Kenapa Sanity?](#2-latar-belakang-kenapa-sanity)
- [3. Arsitektur Sistem](#3-arsitektur-sistem)
- [4. Self-Hosting: Mitos vs Fakta](#4-self-hosting-mitos-vs-fakta)
- [5. Pricing & Biaya](#5-pricing--biaya)
- [6. Strategi Migrasi (Jika Ingin Pindah)](#6-strategi-migrasi-jika-ingin-pindah)
- [7. Perbandingan CMS Lain](#7-perbandingan-cms-lain)
- [8. Workflow Developer](#8-workflow-developer)
- [9. Panduan Editor Konten (Tim ASIB)](#9-panduan-editor-konten-tim-asib)
- [10. Deployment Studio](#10-deployment-studio)
- [11. FAQ Lengkap](#11-faq-lengkap)
- [12. Glosarium](#12-glosarium)
- [13. Referensi](#13-referensi)

---

## 1. Ringkasan Eksekutif

### 1.1. Apa Itu Sanity?

Sanity adalah **headless CMS (Content Management System)** berbasis cloud — platform untuk
mengelola konten website yang **memisahkan backend (penyimpanan data) dari frontend (tampilan)**.

Bedanya dengan CMS tradisional (seperti WordPress):
- **WordPress**: CMS + database + template jadi satu paket
- **Sanity**: CMS sebagai **layanan terpisah** — konten dikelola di Sanity, tampilan dibangun
  dengan framework apa pun (Astro, Next.js, dll)

### 1.2. Kenapa Sanity untuk ASIB?

| Kebutuhan | Solusi Sanity |
|-----------|---------------|
| Tim non-teknis bisa edit konten | Studio visual drag-and-drop |
| Website tetap cepat | Static site — konten di-fetch saat build, hasilnya HTML murni |
| Tanpa biaya bulanan | Free tier $0 — cukup untuk ASIB |
| Data aman | Hosted di Sanity cloud (SOC 2 compliant) |
| Bisa migrasi kapan saja | Content schema di-repo, data bisa diexport JSON |

### 1.3. Status Project

| Komponen | Status |
|----------|--------|
| Sanity Studio (`studio-amalshalih/`) | ✅ Siap (6 collections) |
| Integrasi Astro (`astro.config.mjs`) | ✅ Terpasang |
| Client library (`src/lib/sanity/`) | ✅ Siap pakai |
| Dokumentasi CMS | ✅ `.openkb/cms-integration.md` |
| Dokumentasi strategi | ✅ **(dokumen ini)** |
| Studio deployed | ⏳ Butuh token |
| Data terisi | ⏳ Butuh token |

---

## 2. Latar Belakang: Kenapa Sanity?

### 2.1. Proses Pemilihan CMS

Sebelum memutuskan Sanity, kami mengevaluasi beberapa opsi:

| CMS | Tipe Hosting | Kemudahan Setup | Biaya | Cocok untuk ASIB? |
|-----|-------------|-----------------|-------|-------------------|
| **Sanity** | SaaS (cloud) | ✅ Sangat mudah | $0 (free tier) | ✅ **Terpilih** |
| **Directus** | Self-hosted | ⚠️ Sedang | $0 (self-host) | ❌ Perlu server sendiri |
| **Strapi** | Self-hosted | ⚠️ Sedang | $0 (self-host) | ❌ Perlu server sendiri |
| **Payload** | Self-hosted | ⚠️ Sedang | $0 (self-host) | ❌ Perlu docker/server |
| **Supabase** | SaaS + self-host | ❌ Rumit | $0 (free tier) | ❌ Terlalu general-purpose |

### 2.2. Alasan Sanity Menang

1. **Zero infrastructure** — tidak perlu urus server, database, atau hosting CMS
2. **Official Astro integration** — `@sanity/astro` langsung jalan tanpa konfigurasi manual
3. **Free tier lega** — 10rb dokumen, 100GB bandwidth (lebih dari cukup untuk website profil yayasan)
4. **Studio visual yang matang** — editor tinggal klik dan isi form, tidak perlu coding
5. **Ekosistem matang** — dokumentasi lengkap, komunitas besar, banyak contoh proyek nyata
6. **Portable** — schema dan data bisa diexport kapan saja, tidak ada lock-in biner

### 2.3. Kapan Sanity TIDAK Cocok?

Sanity tidak cocok jika:
- **Butuh self-hosted total** (data harus di server sendiri) → pilih Directus/Strapi/Payload
- **Data sangat sensitif** (harus on-premise karena regulasi) → pilih yang self-host
- **Traffic sangat tinggi** (jutaan API request/hari) → bisa mahal di Growth plan
- **Butuh e-commerce built-in** → Sanity headless, perlu integrasi tambahan

Untuk kebutuhan ASIB (website profil yayasan, publikasi kegiatan, donasi) — **Sanity adalah pilihan optimal**.

---

## 3. Arsitektur Sistem

### 3.1. Diagram Alur Data

```
┌─────────────────────────────────────────────────────────────┐
│                      SANITY CLOUD                           │
│  ┌─────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │ Sanity      │  │ Content Lake     │  │ Asset CDN     │  │
│  │ Studio (UI) │──│ (Database + API) │──│ (Gambar dll)  │  │
│  │ *.sanity    │  │ api.sanity.io    │  │ cdn.sanity.io │  │
│  │ .studio     │  │                  │  │               │  │
│  └──────┬──────┘  └────────┬────────┘  └───────────────┘  │
└─────────┼──────────────────┼───────────────────────────────┘
          │ (edit konten)    │ (GROQ query)
          ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   ASTRO (BUILD TIME)                        │
│  static site generation  →  fetch data → render HTML        │
│  Output: dist/ (file HTML murni)                            │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                   CLOUDFLARE PAGES                           │
│  https://amalshalih.id  (static hosting, CDN global)        │
│  HTML + CSS + Asset  →  delivered ke pengunjung             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2. Komponen Kunci

#### Content Lake (Database Sanity)

Ini adalah **otak** dari Sanity — tempat semua konten tersimpan:

- **Document store** — database dokumen (seperti MongoDB)
- **GROQ API** — query language khas Sanity
- **GraphQL API** — alternatif query
- **Real-time sync** — perubahan langsung tersinkronisasi
- **Revision history** — semua perubahan tercatat
- **Image pipeline** — otomatis optimasi/resize gambar

#### Sanity Studio (UI Editor)

Ini adalah **dashboard** yang dipakai tim ASIB untuk ngisi konten:

- React SPA (Single Page Application) — open source
- Bisa di-host di Sanity (`yayasan-asib.sanity.studio`) atau di server sendiri
- Drag-and-drop editor untuk rich text (Portable Text)
- Image upload dengan crop & hotspot
- Preview konten sebelum publish

#### Astro Integration

Ini adalah **jembatan** antara Sanity dan website:

| File | Fungsi |
|------|--------|
| `astro.config.mjs` | Registrasi plugin `@sanity/astro` (projectId, dataset) |
| `src/lib/sanity/client.ts` | Helper functions fetch data |
| `src/lib/sanity/queries.ts` | GROQ queries terdefinisi |
| `src/lib/sanity/types.ts` | TypeScript interfaces untuk type safety |
| `src/env.d.ts` | Type reference untuk sanity module |

### 3.3. Static Site vs Dynamic Site

**ASIB pakai static site.** Ini konsekuensi penting yang harus dipahami:

| Aspek | Static Site (ASIB) | Dynamic Site |
|-------|-------------------|--------------|
| **Kapan data diambil?** | Saat build (`bun run build`) | Saat user buka halaman |
| **Kecepatan** | Sangat cepat (file HTML) | Sedang (perlu query DB) |
| **Hosting** | Mana saja (Cloudflare, dll) | Butuh server (Node.js, dll) |
| **Update konten** | Perlu rebuild | Langsung real-time |
| **Beban Sanity API** | 1x per build | Setiap page load |

**Cara update konten setelah edit di Sanity:**
1. Commit & push ke GitHub → auto-deploy via Cloudflare Pages
2. Manual: `bun run build && bunx wrangler pages deploy dist/`
3. (Future) Webhook Sanity → trigger Cloudflare build otomatis

### 3.4. GROQ Queries (Contoh)

```groq
// Ambil semua kegiatan, urut tanggal terbaru
*[_type == "kegiatan"] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  date,
  category,
  excerpt,
  "imageUrl": image.asset->url
}

// Ambil bank donasi yang aktif
*[_type == "bankDonasi" && isActive == true] | order(order asc)

// Ambil pengaturan website
*[_type == "siteSettings"][0]
```

---

## 4. Self-Hosting: Mitos vs Fakta

Ini adalah **topik yang paling sering membingungkan**. Mari kita bedah.

### 4.1. Sanity Studio BISA Di-self-host ✅

Sanity Studio adalah **React SPA open-source** — kodenya bebas diunduh, diubah, dan di-deploy
ke mana saja:

```bash
# Build studio untuk self-hosting
cd studio-amalshalih
bun sanity build   # output di dist/ → deploy ke server Nginx, Vercel, dll
```

Bisa di-host di:
- **Vercel / Netlify / Cloudflare Pages** — gratis
- **Server sendiri** — pakai Nginx/Apache
- **Embedded di aplikasi** — kalau mau studio menyatu dengan website

**Tapi:** self-host studio saja **tidak menghilangkan dependency ke Sanity cloud** — karena
studionya tetap butuh terhubung ke Content Lake Sanity untuk baca/tulis data.

### 4.2. Content Lake (Database) TIDAK Bisa Di-self-host ❌

**Ini yang penting:** Content Lake adalah **proprietary infrastructure milik Sanity** —
tidak ada kode yang bisa di-self-host untuk ini.

Yang termasuk Content Lake:
| Komponen | Self-host? |
|----------|-----------|
| Document storage | ❌ |
| GROQ/GraphQL API | ❌ |
| Image CDN & pipeline | ❌ |
| Real-time sync | ❌ |
| Revision history | ❌ |
| User authentication | ❌ |

### 4.3. Jadi, Sanity Cloud-hosted atau Bisa Self-hosted?

**Jawaban: Sanity adalah SaaS (Software as a Service).** Studio-nya open-source dan bisa
di-host di mana saja, tapi **data tetap di cloud Sanity**.

Analoginya seperti **GitHub vs Git**:
- **Git** (protokol) — bisa self-host, banyak implementasi (GitLab, Gitea dll)
- **GitHub** (platform) — SaaS, fitur tambahan di atas Git

Sanity Studio = Git CLI (open source, bisa di mana aja)
Sanity Content Lake = GitHub (platform, proprietary)

### 4.4. Kalau Sanity Tutup atau Bangkrut?

Ini kekhawatiran yang wajar. Sanity adalah perusahaan venture-backed yang sudah beroperasi
sejak 2017, didanai lebih dari $50 juta. Tapi untuk jaga-jaga:

**Kita tidak lock-in:**
1. **Semua schema ada di repo kita** — blueprint konten aman di `studio-amalshalih/schemaTypes/`
2. **Data bisa diexport kapan saja** — via GROQ query → JSON
3. **Content migration path jelas** — lihat [section 6](#6-strategi-migrasi-jika-ingin-pindah)
4. **Self-hosted alternatif sudah diidentifikasi** — Directus, Strapi, Payload

Ini lebih aman daripada WordPress yang data di database MySQL — kalau kena hack,
data hilang semua. Dengan Sanity, data aman di cloud dengan backup otomatis.

---

## 5. Pricing & Biaya

### 5.1. Tabel Perbandingan Plan

| Fitur | **Free** 🟢 | **Growth** ($99/bln) | **Business** ($949/bln) |
|-------|------------|---------------------|------------------------|
| **Dokumen** | 10.000 | 25.000 | 50.000 |
| **API Requests** | 200 rb/bln | 2 juta/bln | Custom |
| **Bandwidth** | 100 GB | 1 TB | Custom |
| **Dataset** | 3 | Unlimited | Unlimited |
| **Roles** | Admin + Viewer | 5 roles | Custom roles |
| **Private dataset** | ❌ (public) | ✅ | ✅ |
| **Scheduled publish** | ❌ | ✅ | ✅ |
| **AI Assist** | ❌ | ✅ | ✅ |
| **Comments & tasks** | ❌ | ✅ | ✅ |

### 5.2. Growth Trial (30 Hari) — Yang Sedang Aktif

Akun Sanity ASIB saat ini dalam **Growth Trial** — akses gratis ke semua fitur Growth
selama 30 hari. **Setelah 30 hari turun otomatis ke Free — tidak ada tagihan.**

| Yang Didapat Selama Trial | Hilang Setelah Trial |
|--------------------------|---------------------|
| Private dataset | Dataset jadi public read |
| User roles (Editor, etc) | Hanya Admin & Viewer |
| Scheduled publishing | ❌ |
| Comments & tasks | ❌ |
| AI Assist | ❌ |

### 5.3. Untuk ASIB: Free Tier Sudah Cukup?

**Ya, lebih dari cukup.** Analisis:

| Metrik | Kebutuhan ASIB | Free Tier Limit |
|--------|---------------|-----------------|
| Dokumen | ~50 dokumen (5 collection × ~10 entry) | 10.000 ✅ |
| API request | ~1 request per build (1-2x build/hari) | 200 rb/bln ✅ |
| Bandwidth | ~5 GB/bln (website kecil) | 100 GB ✅ |
| Dataset | 1 (production) | 3 ✅ |

**Satu-satunya yang berubah setelah trial:** dataset jadi **public read**.
Ini **tidak masalah** untuk website static — data yang di-fetch saat build untuk
ditampilkan ke publik memang harusnya public.

**Kalau pun Growth tetap gratis setelah trial berakhir?**
Tidak — Growth adalah $99/bulan. Tidak perlu di-upgrade kecuali:
- Ingin dataset private (data sensitif)
- Tim > 2 orang butuh role Editor
- Butuh scheduling publish

### 5.4. Biaya Tersembunyi (Yang Perlu Diketahui)

| Item | Termasuk Free? | Notes |
|------|---------------|-------|
| Hosting studio (sanity.studio) | ✅ | Free, unlimited |
| Image CDN | ✅ | Free, unlimited transformasi |
| API (GROQ/GraphQL) | ✅ (200rb/bln) | Lebih dari cukup |
| Asset storage | ✅ (termasuk 100GB) | Gambar, file |
| Real-time collaboration | ✅ | Termasuk |
| Revision history | ✅ | 30 hari di Free |

**Tidak ada biaya tersembunyi.** Sanity transparan soal pricing.

---

## 6. Strategi Migrasi (Jika Ingin Pindah)

### 6.1. Skenario Migrasi

Kapan perlu migrasi dari Sanity:
1. **Biaya membengkak** — kalau Growth/Business diperlukan tapi terlalu mahal
2. **Data harus on-premise** — ada regulasi baru
3. **Sanity tutup** — skenario worst case
4. **Butuh fitur yang tidak ada di Sanity** — misalnya e-commerce native

### 6.2. Target Migrasi (Self-Hosted CMS)

| CMS | Stack | Kelebihan | Cocok untuk Pengganti Sanity? |
|-----|-------|-----------|------------------------------|
| **Strapi** | Node.js | Paling populer, banyak plugin | ✅ Paling mudah transisinya |
| **Directus** | Node.js | Auto-generate API dari SQL | ✅ UI mirip Sanity |
| **Payload** | Node.js/Next.js | Paling developer-friendly ✅ | ⚠️ Butuh React/Next.js |
| **WordPress** | PHP | Paling dikenal | ❌ Too heavy, legacy |

**Rekomendasi:** **Strapi** atau **Directus** — stack Node.js yang sudah familiar,
self-hosted total, dan komunitas besar.

### 6.3. Proses Migrasi

```
Langkah 1: Export data dari Sanity
┌──────────────┐     ┌──────────────────────┐
│  GROQ Query   │────▶│  JSON Export          │
│  *[_type ==   │     │  kegiatan.json        │
│  "kegiatan"]  │     │  program.json         │
└──────────────┘     │  bankDonasi.json      │
                     └──────────────────────┘
                              │
Langkah 2: Setup CMS Baru     │
┌──────────────┐              │
│  Strapi/     │◀─────────────┘
│  Directus    │──▶ Import JSON → restrukturisasi
└──────────────┘
         │
Langkah 3: Update Frontend
┌──────────────┐
│  Ganti API   │──▶ GROQ → REST/GraphQL CMS baru
│  endpoint    │    Ubah query di src/lib/sanity/
└──────────────┘
```

**Estimasi effort:** 2-4 hari kerja untuk migrasi penuh (data + frontend).

### 6.4. Yang Tetap Sama Setelah Migrasi

- **Frontend (Astro)** — tidak perlu diubah, hanya ganti sumber data
- **Struktur halaman** — tetap 10 halaman
- **Design system** — tidak berubah
- **Hosting (Cloudflare Pages)** — tetap sama
- **Domain** — tetap `amalshalih.id`

---

## 7. Perbandingan CMS Lain

### 7.1. Sanity vs Directus

| Aspek | Sanity | Directus |
|-------|--------|----------|
| **Hosting** | Cloud (SaaS) | Self-host atau Cloud |
| **Database** | Proprietary (Content Lake) | SQL (PostgreSQL, MySQL, dll) |
| **Open source** | Studio only | ✅ Full (backend + frontend) |
| **Self-host possible** | ❌ Content Lake | ✅ Full |
| **Kemudahan setup** | ✅ Sangat mudah | ⚠️ Butuh setup DB |
| **Official Astro support** | ✅ | ❌ (community plugin) |
| **Image pipeline** | ✅ Built-in | ⚠️ Butuh setup |
| **Free tier** | $0 (10rb dokumen) | $0 (self-host) |
| **Real-time** | ✅ | ✅ |

### 7.2. Sanity vs Strapi

| Aspek | Sanity | Strapi |
|-------|--------|--------|
| **Hosting** | Cloud | Self-host (Cloud $99+) |
| **Database** | Content Lake | SQLite / PostgreSQL / MySQL |
| **Open source** | Studio only | ✅ Full MIT license |
| **Self-host possible** | ❌ | ✅ |
| **Plugin ecosystem** | Terbatas | ✅ Banyak |
| **REST API** | ✅ + GROQ + GraphQL | ✅ REST + GraphQL |
| **Official Astro support** | ✅ | ❌ |
| **Popularitas** | Enterprise | Komunitas besar |

### 7.3. Sanity vs WordPress

| Aspek | Sanity | WordPress |
|-------|--------|-----------|
| **Hosting** | Cloud | Self-host atau managed |
| **Arsitektur** | Headless (API-first) | Monolithic (PHP + MySQL) |
| **Editor visual** | Studio (React SPA) | Gutenberg / Classic Editor |
| **Plugin** | Terbatas | ✅ Jutaan |
| **Keamanan** | ✅ Hosted, auto-patch | ⚠️ Rawan exploit, perlu maintain |
| **Kecepatan frontend** | ✅ Static HTML | ⚠️ PHP rendering |
| **Learning curve** | Sangat mudah (isi form) | Sederhana (tapi kompleks) |

### 7.4. Kapan Pilih Mana?

| Skenario | Pilihan |
|----------|---------|
| **Profil yayasan/UMKM** (seperti ASIB) | **Sanity** ✅ |
| **Butuh self-hosted penuh** | Directus / Strapi |
| **Butuh e-commerce + CMS** | WordPress (WooCommerce) |
| **Enterprise, traffic besar** | Sanity Growth+ / Contentful |
| **Butuh real-time collaboration** | Sanity |

---

## 8. Workflow Developer

### 8.1. Setup Lingkungan

```bash
# Clone repo
git clone <repo-url>
cd yayasan-amal-shalih-insan-bantul

# Install dependencies
bun install

# Install studio dependencies
cd studio-amalshalih
bun install
cd ..

# Setup environment
cp .env.example .env
# Isi SANITY_API_READ_TOKEN dengan token dari sanity.io/manage
```

### 8.2. Development

```bash
# Development server (Astro)
bun run dev

# Studio development
cd studio-amalshalih && bun sanity dev
```

### 8.3. Build & Deploy

```bash
# Build website
bun run build

# Deploy ke Cloudflare Pages
bunx wrangler pages deploy dist/ --project-name=amalshalih

# Deploy Sanity Studio
cd studio-amalshalih && bun sanity deploy
```

### 8.4. Mengubah Schema / Collection

Contoh menambah collection baru (misal: `testimoni`):

1. Buat file `studio-amalshalih/schemaTypes/testimoni.ts`:

```typescript
import {defineField, defineType} from 'sanity'

export const testimoniType = defineType({
  name: 'testimoni',
  title: 'Testimoni',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Nama' }),
    defineField({ name: 'content', type: 'text', title: 'Testimoni' }),
    defineField({ name: 'photo', type: 'image', title: 'Foto' }),
  ],
})
```

2. Register di `studio-amalshalih/schemaTypes/index.ts`:

```typescript
import {testimoniType} from './testimoni'
export const schemaTypes = [
  kegiatanType,
  programType,
  bankDonasiType,
  pengurusType,
  siteSettingsType,
  testimoniType,  // ← tambahkan
]
```

3. Buat query di `src/lib/sanity/queries.ts`:

```typescript
export const TESTIMONI_LIST = groq`*[_type == "testimoni"]`
```

4. Fetch di halaman Astro:

```astro
---
import { sanityClient } from '../lib/sanity/client'
const testimoni = await sanityClient.fetch(TESTIMONI_LIST)
---
```

### 8.5. Git Workflow

```
main ← production (Cloudflare Pages auto-deploy)
  ├── feat/sanity-integration  (selesai)
  ├── feat/sanity-data-migration  (next)
  ├── fix/wcag-issue
  └── ...
```

Commit convention: `feat:`, `fix:`, `chore:`, `docs:`

---

## 9. Panduan Editor Konten (Tim ASIB)

### 9.1. Akses Studio

1. Buka **https://yayasan-asib.sanity.studio** (setelah di-deploy)
2. Login via Google/GitHub (diundang oleh admin)
3. Tampilan utama → daftar semua tipe konten di sidebar kiri

### 9.2. Tipe Konten & Fungsinya

| Ikon | Nama | Kegunaan |
|------|------|----------|
| 📝 | **Kegiatan** | Berita, artikel, laporan kegiatan |
| 📋 | **Program** | Program yayasan (Pendidikan, Sosial, Keagamaan) |
| 🏦 | **Bank Donasi** | Daftar rekening untuk donasi |
| 👥 | **Pengurus** | Struktur organisasi yayasan |
| ⚙️ | **Pengaturan** | Data umum (alamat, kontak, medsos) |

### 9.3. Menambah Kegiatan Baru

1. Klik **Kegiatan** di sidebar kiri
2. Klik **✚ Create new** (kanan atas)
3. Isi field:
   - **Judul Kegiatan** — nama kegiatan (wajib)
   - **Slug** — URL otomatis dari judul (jangan diubah setelah publish)
   - **Tanggal** — pilih tanggal kegiatan
   - **Kategori** — Pendidikan / Keagamaan / Sosial / Berita
   - **Ringkasan** — cuplikan singkat (1-3 kalimat)
   - **Gambar** — upload foto kegiatan
   - **Konten** — isi lengkap (rich text, bisa format bold, list, gambar)
4. Klik **Publish** (tombol biru di kanan atas)

### 9.4. Tips & Trik

✅ **Lakukan:**
- Klik **Publish** setelah selesai (Save = draft, tidak tampil di website)
- Upload gambar dengan ukuran wajar (max 2MB) — Sanity akan optimasi otomatis
- Untuk kegiatan lama, atur tanggal sesuai kejadian
- Setelah edit, trigger rebuild: push ke GitHub atau bilang developer untuk deploy ulang

❌ **Jangan:**
- Ubah **Slug** setelah publish — bisa bikin link rusak
- Hapus dokumen yang sudah di-publish (kecuali memang sengaja)
- Upload gambar > 10MB — akan lambat

### 9.5. Pengaturan Website

Menu **Pengaturan** berisi:
- **Site Name** — nama yayasan
- **Short Name** — singkatan
- **Description** — deskripsi website
- **Visi** — visi yayasan
- **Misi** — misi yayasan (bisa lebih dari satu)
- **Alamat** — alamat lengkap
- **Phone** — nomor telepon/WA
- **Email** — email kontak
- **Social Media** — URL Instagram, YouTube, Facebook, Twitter
- **QRIS** — upload gambar QRIS
- **Linktree** — URL Linktree

---

## 10. Deployment Studio

### 10.1. Deploy ke Sanity Hosting (Rekomendasi)

Paling mudah: `bun sanity deploy` → langsung live di `*.sanity.studio`.

```bash
cd studio-amalshalih
bun sanity deploy
```

Pilih hostname: `yayasan-asib`

Hasil: **https://yayasan-asib.sanity.studio**

### 10.2. Deploy ke Vercel / Netlify (Self-Host Studio)

Kalau ingin studio di domain sendiri (misal `cms.amalshalih.id`):

```bash
cd studio-amalshalih
bun sanity build  # hasil di dist/
```

Upload folder `dist/` ke Vercel/Netlify sebagai static site.

**Catatan:** Self-host studio tidak mengubah ketergantungan ke Content Lake Sanity.

### 10.3. CORS Configuration

Agar studio bisa terhubung ke Content Lake, tambahkan CORS origins di
[sanity.io/manage](https://sanity.io/manage) → API → CORS:

| Origin | Keterangan |
|--------|------------|
| `http://localhost:4321` | Development |
| `https://yayasan-asib.sanity.studio` | Sanity hosting |
| `https://amalshalih.id` | Production |
| `https://amalshalih.pages.dev` | Cloudflare Pages |

Centang **Allow credentials** untuk semua.

### 10.4. Manage User

1. Buka https://sanity.io/manage → pilih project
2. Tab **Members** → **Invite members**
3. Tambah tim ASIB dengan role:
   - **Editor** — bisa isi konten
   - **Viewer** — hanya bisa lihat
   - **Administrator** — full akses (hanya untuk IT Koneksi)

---

## 11. FAQ Lengkap

### 11.1. Umum

**Q: Sanity itu database atau CMS?**
A: **Keduanya.** Sanity adalah CMS (Content Management System) yang punya database sendiri
yang disebut Content Lake. Jadi sekaligus jadi CMS dan penyimpanan data — tidak perlu
database terpisah seperti NeonDB/PostgreSQL.

**Q: Apakah Sanity gratis?**
A: Ada free tier $0 dengan limit 10rb dokumen, 200rb API request/bulan, 100GB bandwidth.
Untuk website ASIB, **free tier sudah lebih dari cukup.**

**Q: Apa itu Growth Trial yang active di dashboard?**
A: Sanity memberi akses 30 hari ke fitur Growth ($99/bulan) gratis untuk mencoba.
Setelah 30 hari turun ke Free — **tidak ada tagihan otomatis.** Tidak perlu input
kartu kredit.

### 11.2. Self-Hosting

**Q: Sanity bisa self-hosted?**
A: **Studio-nya bisa** (open source React app). **Content Lake-nya tidak bisa**
(proprietary infrastructure Sanity). Detail lengkap di [section 4](#4-self-hosting-mitos-vs-fakta).

**Q: Kalau ingin yang full self-hosted, pindah kemana?**
A: **Strapi** atau **Directus** — keduanya open source 100%, self-hosted, stack Node.js.
Migrasi dari Sanity sudah didokumentasikan di [section 6](#6-strategi-migrasi-jika-ingin-pindah).

**Q: Apa risiko Sanity tutup?**
A: Sanity sudah beroperasi sejak 2017, didanai $50M+. Tapi jaga-jaga: semua konten
bisa diexport kapan saja (GROQ → JSON). Migrasi ke CMS lain estimasi 2-4 hari.

### 11.3. Teknis

**Q: Kenapa konten tidak muncul setelah di-edit di Sanity?**
A: Karena website ASIB adalah **static site** — data di-fetch SAAT BUILD, bukan saat
user buka halaman. Setelah edit konten, perlu trigger rebuild:
- Manual: `bun run build && bunx wrangler pages deploy dist/`
- Otomatis: push commit ke GitHub (via Cloudflare Pages integration)

**Q: Apakah Sanity bikin website jadi lambat?**
A: **Tidak — malah sebaliknya.** Data Sanity di-fetch saat build, hasilnya file HTML
murni. Nol JavaScript di client. Website tetap super cepat.

**Q: Public dataset — apakah data kami bisa dibaca orang lain?**
A: Public read = siapapun bisa query API Sanity untuk baca data. **Ini tidak masalah**
karena konten website ASIB memang untuk publik (profil, kegiatan, donasi). Data sensitif
seperti password/token internal tidak pernah disimpan di Sanity.

**Q: Apakah Sanity aman?**
A: Sanity adalah SOC 2 compliant, data dienkripsi (at rest dan in transit),
revision history 30 hari, backup otomatis. **Lebih aman daripada self-managed database**
yang rawan human error (lupa backup, kena hack).

### 11.4. Operasional

**Q: Siapa yang bisa akses studio Sanity?**
A: Yang diundang oleh admin. Role:
- **Administrator**: full akses (IT Koneksi)
- **Editor**: input/edit konten (Tim ASIB)
- **Viewer**: lihat saja

**Q: Berapa orang yang bisa pakai free tier?**
A: Free tier support 2 role (Admin + Viewer), jumlah user tidak terbatas.
Growth trial support 5 roles termasuk Editor.

**Q: Kalau Growth trial habis, apa yang hilang?**
A: Private dataset → public read. Roles tambahan → hanya Admin & Viewer.
Fitur scheduling, comments, AI Assist hilang. **Semua konten tetap aman dan tidak hilang.**

### 11.5. Database

**Q: Karena pakai Sanity, kita tidak butuh database lain?**
A: **Benar.** Sanity sudah mencakup CMS + database + CDN gambar + API.
Tidak perlu NeonDB, PostgreSQL, MySQL, atau database terpisah.

**Q: Sanity pakai SQL atau NoSQL?**
A: **Document store** (seperti MongoDB) — data disimpan sebagai JSON dokumen.
Bukan SQL, bukan relational. Tapi ini tidak perlu dipikirkan tim konten —
cukup isi form di studio, Sanity urus semuanya.

**Q: Bagaimana backup data?**
A: Sanity otomatis backup dan revision history 30 hari (free tier).
Untuk backup tambahan, bisa export via GROQ query ke JSON.

### 11.6. Domain & Hosting

**Q: Website ASIB di-host dimana?**
A: **Cloudflare Pages** — CDN global, gratis untuk website statis.
Domain: `amalshalih.id` (sudah terdaftar).

**Q: Kalau mau pindah hosting?**
A: Karena website static (file HTML), bisa di-host di mana saja:
- Vercel / Netlify — drag-and-drop folder `dist/`
- GitHub Pages / GitLab Pages
- Server sendiri (Nginx/Apache)
- Bahkan hosting murah seperti idcloudhost

**Q: Apa bedanya hosting website vs hosting studio?**
A: **Hosting website** = Cloudflare Pages (tempat file HTML ASIB diakses publik)
**Hosting studio** = Sanity cloud (dashboard editor, hanya tim internal)

---

## 12. Glosarium

| Istilah | Arti |
|---------|------|
| **CMS** | Content Management System — sistem untuk mengelola konten website |
| **Headless CMS** | CMS yang hanya backend (API + database), tanpa frontend built-in |
| **Content Lake** | Nama Sanity untuk database cloud mereka |
| **GROQ** | Graph-Relational Object Queries — query language buatan Sanity |
| **GraphQL** | Query language alternatif (juga didukung Sanity) |
| **Portable Text** | Format rich text Sanity (berbasis JSON, bukan HTML) |
| **Schema** | Blueprint/struktur tipe konten (field apa saja yang dimiliki) |
| **Dataset** | Kumpulan data (bisa production, staging, development) |
| **SaaS** | Software as a Service — software yang berjalan di cloud |
| **Self-hosted** | Software yang diinstal dan dijalankan di server sendiri |
| **SPA** | Single Page Application — app React yang jalan di browser |
| **Static Site** | Website yang terdiri dari file HTML murni (tanpa server-side rendering) |
| **CDN** | Content Delivery Network — server tersebar global untuk akses cepat |
| **GROQ Query** | Query untuk mengambil data dari Sanity (mirip SELECT di SQL) |
| **Project ID** | Identitas unik project Sanity (`9yj0dq9v` untuk ASIB) |
| **Token** | API key untuk autentikasi ke Sanity |
| **SOC 2** | Standar keamanan data untuk SaaS companies |
| **Lock-in** | Situasi dimana sulit pindah dari suatu platform karena dependency |

---

## 13. Referensi

### Link Penting

| Resource | URL |
|----------|-----|
| **Sanity Dashboard** | https://sanity.io/manage |
| **Sanity Docs** | https://www.sanity.io/docs |
| **GROQ Query Cheatsheet** | https://www.sanity.io/docs/groq-cheatsheet |
| **Sanity Pricing** | https://www.sanity.io/pricing |
| **Sanity Astro Integration** | https://www.sanity.io/plugins/astro |
| **Cloudflare Pages Dashboard** | https://dash.cloudflare.com/?to=pages |
| **Cloudflare API Token** | (ada di `.openkb/deployment.md`) |

### File Penting di Repo

| File | Keterangan |
|------|------------|
| `.openkb/cms-integration.md` | Panduan teknis integrasi Sanity + Astro |
| `.openkb/deployment.md` | Panduan deploy ke berbagai hosting |
| `.env.example` | Template environment variables |
| `studio-amalshalih/schemaTypes/` | Definisi semua tipe konten |
| `src/lib/sanity/client.ts` | Fetch helpers |
| `src/lib/sanity/queries.ts` | GROQ queries |
| `src/lib/sanity/types.ts` | TypeScript types |
| `astro.config.mjs` | Konfigurasi integrasi Sanity |

---

> **Dokumen ini adalah living document — akan diperbarui seiring perkembangan project.**
> **Untuk pertanyaan atau koreksi, hubungi PT Koneksi Jaringan Indonesia.**
