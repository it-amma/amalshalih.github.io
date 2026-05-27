# Integrasi Sanity CMS — Yayasan ASIB

> **Tujuan dokumen:** Dokumentasi setup Sanity CMS sebagai content management system
> untuk website Yayasan ASIB, termasuk panduan penggunaan untuk tim, deployment studio,
> dan referensi teknis.

---

## Daftar Isi

- [1. Arsitektur](#1-arsitektur)
- [2. Cara Kerja](#2-cara-kerja)
- [3. Untuk Editor Konten (Tim ASIB)](#3-untuk-editor-konten-tim-asib)
- [4. Untuk Developer](#4-untuk-developer)
- [5. Collections / Tipe Konten](#5-collections--tipe-konten)
- [6. Deploy Studio](#6-deploy-studio)
- [7. Panduan Migrasi Data](#7-panduan-migrasi-data)
- [8. Troubleshooting](#8-troubleshooting)

---

## 1. Arsitektur

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Sanity Studio │────▶│   Sanity CDN     │◀────│   Astro (build)  │
│  (sanity.studio)│     │  (api.sanity.io) │     │   static site    │
└─────────────────┘     └──────────────────┘     └──────────────────┘
         │                                              │
         │ (edit konten)                                 │ (fetch GROQ query)
         ▼                                              ▼
   Tim ASIB                                           Cloudflare Pages
   (via browser)                                      (https://amalshalih.id)
```

**Alur data:**
1. Tim ASIB edit konten via Sanity Studio (dashboard web)
2. Data tersimpan di Sanity Cloud (CDN)
3. Saat build, Astro fetch data dari Sanity via GROQ queries
4. HTML statis dihasilkan dengan data terbaru
5. Build dideploy ke Cloudflare Pages

---

## 2. Cara Kerja

### 2.1. Static Site (Saat Ini)

Website ASIB adalah **static site** — semua HTML digenerate saat build (`bun run build`).

**Keuntungan:**
- Super cepat (file HTML murni, nol JavaScript)
- Hosting di mana saja (Cloudflare, Vercel, Netlify)
- SEO maksimal

**Konsekuensi:**
- Setiap perubahan konten di Sanity **butuh trigger rebuild** agar website terupdate
- Rebuild terjadi otomatis tiap `git push` ke `main` (via Cloudflare Pages Git integration)
- Atau manual: `bun run build && bunx wrangler pages deploy dist/`

### 2.2. Trigger Rebuild

Ada 3 cara trigger rebuild setelah konten diubah di Sanity:

| Metode | Cara | Latency |
|--------|------|---------|
| **Manual** | `bun run build && bunx wrangler pages deploy dist/` | 1-2 menit |
| **Git push** | Commit + push ke GitHub → auto-deploy | 2-3 menit |
| **Webhook** | (Future) Sanity webhook → trigger Cloudflare Pages build | ~1 menit |

Yang paling praktis untuk tim ASIB: **edit konten di Sanity → push ke GitHub → auto-deploy**.

---

## 3. Untuk Editor Konten (Tim ASIB)

### 3.1. Akses Studio

1. Buka **https://yayasan-asib.sanity.studio** (setelah studio di-deploy)
2. Login via **Google** atau **GitHub** (sesuai akun yang diundang)
3. Akan tampil dashboard dengan daftar konten

### 3.2. Tipe Konten yang Bisa Diedit

| Menu | Kegunaan |
|------|----------|
| **Kegiatan** | Tambah/edit berita & kegiatan yayasan |
| **Program** | Atur program yayasan (Pendidikan, Sosial, Keagamaan) |
| **Bank Donasi** | Tambah/ubah rekening donasi |
| **Pengurus Yayasan** | Update struktur organisasi |
| **Pengaturan Website** | Edit data umum (alamat, kontak, sosial media) |

### 3.3. Cara Menambah Kegiatan Baru

1. Klik menu **Kegiatan** di sidebar kiri
2. Klik tombol **✚ Create new** (kanan atas)
3. Isi:
   - **Judul Kegiatan** — nama kegiatan
   - **Slug** — otomatis terisi dari judul (URL friendly)
   - **Tanggal** — pilih tanggal kegiatan
   - **Kategori** — Pendidikan / Keagamaan / Sosial / Berita
   - **Ringkasan** — cuplikan singkat (muncul di daftar kegiatan)
   - **Gambar** — upload foto kegiatan
   - **Konten** — isi berita lengkap (rich text)
4. Klik **Publish** (tombol biru, kanan atas)

### 3.4. Cara Mengubah Bank Donasi

1. Klik menu **Bank Donasi**
2. Klik bank yang mau diubah
3. Edit field yang perlu (nama bank, nomor rekening, atas nama)
4. Klik **Publish**

### 3.5. Tips

- ✅ Selalu klik **Publish** setelah selesai edit (kalo cuma Save masih draft)
- ✅ Upload gambar dengan ukuran wajar (max 1MB), Sanity akan optimasi otomatis
- ✅ Untuk kegiatan lama, ubah tanggal sesuai kejadian (bukan tanggal publish)
- ❌ Jangan ubah **Slug** setelah publish — bisa bikin link rusak

---

## 4. Untuk Developer

### 4.1. Struktur Folder

```
yayasan-amal-shalih-insan-bantul/
├── studio-amalshalih/           # Sanity Studio (terpisah dari Astro)
│   ├── sanity.config.ts         # Config (projectId, dataset, plugins)
│   ├── sanity.cli.ts            # CLI config
│   ├── schemaTypes/
│   │   ├── index.ts             # Export semua schemas
│   │   ├── blockContent.ts      # Rich text
│   │   ├── kegiatan.ts          # Dokumen kegiatan/berita
│   │   ├── program.ts           # Program yayasan
│   │   ├── bankDonasi.ts        # Rekening donasi
│   │   ├── pengurus.ts          # Struktur pengurus
│   │   └── siteSettings.ts      # Pengaturan global
│   └── package.json
├── src/
│   ├── lib/
│   │   └── sanity/
│   │       ├── client.ts        # API client (fetch functions)
│   │       ├── queries.ts       # GROQ queries
│   │       └── types.ts         # TypeScript types
│   └── env.d.ts                 # Type reference untuk sanity:client
├── astro.config.mjs             # Integrasi @sanity/astro
└── .env.example                 # Environment variables
```

### 4.2. Setup Lingkungan

**Prasyarat:**
- Bun >= 1.2
- Sanity API token (Viewer) — dari sanity.io/manage → API → Add API Token

**Environment variables:**

```bash
# .env (atau .env.local)
SANITY_API_READ_TOKEN="sk-xxxxxxxxxxxx"
```

Untuk static build, sebenarnya Sanity project defaultnya **public readable** —
token hanya diperlukan untuk Visual Editing (draft mode).

### 4.3. GROQ Queries

GROQ adalah query language dari Sanity. Contoh query yang digunakan:

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

// Ambil kegiatan spesifik via slug
*[_type == "kegiatan" && slug.current == $slug][0]

// Ambil bank donasi yang aktif
*[_type == "bankDonasi" && isActive == true] | order(order asc)
```

Referensi lengkap: https://www.sanity.io/docs/groq

### 4.4. Fetch Data di Astro

```astro
---
// src/pages/kegiatan/index.astro
import { getKegiatanList } from '../lib/sanity/client'

const kegiatan = await getKegiatanList()
---

<ul>
  {kegiatan.map(item => (
    <li>
      <a href={`/kegiatan/${item.slug}`}>{item.title}</a>
      <p>{item.excerpt}</p>
    </li>
  ))}
</ul>
```

### 4.5. Catatan Penting

- **Static build:** Semua data di-fetch saat build. Website tetap static.
- **useCdn: false** — karena static build, kita pake non-CDN biar data fresh.
- **Sanity image CDN** — gambar dari Sanity otomatis di-serve via CDN, nggak perlu optimize manual.
- **Portable Text** — rich text dari Sanity pake format Portable Text (JSON), perlu library `astro-portabletext` untuk render.

---

## 5. Collections / Tipe Konten

### 5.1. Kegiatan (`kegiatan`)

| Field | Tipe | Keterangan |
|-------|------|------------|
| `title` | string | Judul kegiatan (required) |
| `slug` | slug | URL (otomatis dari title) |
| `date` | datetime | Tanggal kegiatan |
| `category` | string | pendidikan/keagamaan/sosial/berita |
| `excerpt` | text | Ringkasan (max 3 baris) |
| `image` | image | Foto kegiatan + hotspot |
| `body` | blockContent | Konten lengkap (rich text) |

### 5.2. Program (`program`)

| Field | Tipe | Keterangan |
|-------|------|------------|
| `title` | string | Nama program |
| `slug` | slug | URL |
| `category` | string | pendidikan/keagamaan/sosial |
| `icon` | string | Nama ikon (book, heart, mosque, dll) |
| `shortDesc` | text | Deskripsi singkat |
| `description` | blockContent | Deskripsi lengkap |
| `image` | image | Gambar |
| `order` | number | Urutan tampil |

### 5.3. Bank Donasi (`bankDonasi`)

| Field | Tipe | Keterangan |
|-------|------|------------|
| `bankName` | string | Nama bank (BSI, BRI, Mandiri, dll) |
| `accountNumber` | string | Nomor rekening |
| `accountName` | string | Atas nama |
| `logo` | image | Logo bank |
| `isActive` | boolean | Aktif/tidak |
| `order` | number | Urutan tampil |

### 5.4. Pengurus (`pengurus`)

| Field | Tipe | Keterangan |
|-------|------|------------|
| `name` | string | Nama lengkap |
| `position` | string | Jabatan |
| `description` | text | Deskripsi |
| `photo` | image | Foto |
| `order` | number | Urutan |

### 5.5. Site Settings (`siteSettings`)

| Field | Tipe | Keterangan |
|-------|------|------------|
| `siteName` | string | Nama yayasan |
| `shortName` | string | Nama singkat |
| `description` | text | Deskripsi website |
| `aboutContent` | blockContent | Konten halaman tentang |
| `visi` | text | Visi yayasan |
| `misi` | array[string] | Misi yayasan |
| `address` | object | Alamat lengkap |
| `phone` | string | No telepon/WA |
| `email` | string | Email |
| `socialMedia` | object | URL sosial media |
| `qrisImage` | image | Gambar QRIS |
| `linktree` | url | Linktree URL |

---

## 6. Deploy Studio

### 6.1. Prasyarat

1. Sanity API token dengan akses **Editor** atau **Admin**
2. Sudah login via CLI

### 6.2. Login

```bash
cd studio-amalshalih
bun sanity login --with-token < token.txt
```

Atau untuk interactive (browser):

```bash
bun sanity login
```

### 6.3. Deploy ke Sanity Hosting

```bash
bun sanity deploy
```

Studio akan live di: **https://yayasan-asib.sanity.studio**

### 6.4. Mengelola User

1. Buka https://sanity.io/manage → pilih project
2. Tab **Members**
3. **Invite members** — tambah tim ASIB dengan role:
   - **Editor** — bisa ngisi konten
   - **Viewer** — cuma bisa lihat

---

## 7. Panduan Migrasi Data

Saat awal setup, Sanity masih kosong. Anda perlu isi data manual:

### 7.1. Data yang Perlu Diisi

| Prioritas | Collection | Data Awal |
|-----------|-----------|-----------|
| 🔴 | **Site Settings** | Nama yayasan, visi-misi, alamat, kontak, sosial media |
| 🔴 | **Bank Donasi** | 5 bank (BSI, BRI, Mandiri, BNI, BCA) |
| 🔴 | **Kegiatan** | 3 kegiatan yang sudah ada |
| 🟡 | **Program** | Semua program yayasan |
| 🟡 | **Pengurus** | Struktur organisasi |

### 7.2. Cara Isi Manual Via Studio

1. Buka studio → tiap menu → **Create new**
2. Salin data dari:
   - `src/data/site.ts` → Site Settings + Bank Donasi
   - `src/content/kegiatan/*.md` → Kegiatan
   - Template inline di `src/pages/*.astro` → Program + Pengurus

### 7.3. Verifikasi

Setelah data terisi, test dengan:

```bash
bun run build   # Harus sukses (data di-fetch tanpa error)
```

---

## 8. Troubleshooting

### 8.1. "Missing SANITY_API_READ_TOKEN"

**Penyebab:** Environment variable belum diset, dan ada code yang pake Visual Editing.

**Solusi:** Buat file `.env` dengan:
```
SANITY_API_READ_TOKEN="sk-xxxxxxxxxxxx"
```

Atau untuk static build, pastikan kode tidak panggil `loadQuery` yang butuh token.

### 8.2. Studio Error: CORS

**Penyebab:** URL development belum di-allow di CORS settings.

**Solusi:** Buka sanity.io/manage → API → CORS → **Add CORS origin**:
- `http://localhost:4321` (development)
- `https://amalshalih.id` (production)
- `https://amalshalih.pages.dev` (production)
- Centang **Allow credentials**

### 8.3. Build Gagal karena Sanity

**Penyebab:** Query error atau Sanity API timeout.

**Solusi:**
1. Cek query di Vision tool (sanity.studio → Vision)
2. Pastikan dataset `production` ada isinya
3. Coba `useCdn: true` di `astro.config.mjs`

### 8.4. Konten Tidak Muncul Setelah Build

**Penyebab:** Data di-fetch SAAT build, bukan tiap page load.

**Solusi:**
1. Pastikan data sudah di-publish di Sanity (bukan draft)
2. Trigger rebuild: commit push ke GitHub atau deploy manual

---

> **Dokumen ini diperbarui secara berkala.**
> **Terakhir diperbarui:** 27 Mei 2026
> **Oleh:** PT Koneksi Jaringan Indonesia
