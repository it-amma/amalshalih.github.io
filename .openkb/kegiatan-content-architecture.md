# Konten Kegiatan — Arsitektur

## Alur Konten

Halaman **Kegiatan** (`/kegiatan`) menggunakan **Sanity CMS sebagai sumber utama**.

```
 Sanity CMS ──→ SSR API ──→ Render halaman
                      ↓ (fallback jika Sanity unreachable)
                 File markdown statis
```

## Prioritas Sumber Data

| Situasi | Sumber |
|---------|--------|
| Normal (Sanity reachable) | **Sanity CMS** — GROQ query `*[_type == "kegiatan"]` |
| Sanity unreachable | **Markdown fallback** — `getCollection('kegiatan')` |
| Sanity body kosong | Metadata dari Sanity, **body dari markdown** (fallback partial) |

## Implementasi

- **`src/pages/kegiatan/index.astro`** — Listing: Sanity first, markdown fallback
- **`src/pages/kegiatan/[slug].astro`** — Detail: Sanity first, partial fallback ke markdown jika body Sanity kosong

## File Markdown

Lokasi: `src/content/kegiatan/*.md`

File markdown berfungsi sebagai:
1. **Fallback** ketika Sanity API tidak dapat dijangkau
2. **Backup** konten yang ter-track di git
3. **Referensi** untuk development lokal

## Sanity Schema (kegiatan)

| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| title | string | ✅ | Judul kegiatan |
| slug | slug | ✅ | Auto dari title |
| date | datetime | ✅ | Tanggal ISO |
| category | string | ✅ | `pendidikan` / `keagamaan` / `sosial` / `berita` |
| excerpt | text | ❌ | Ringkasan (tampil di card) |
| image | image | ❌ | Gambar hero |
| body | blockContent | ❌ | Konten rich text |

## Catatan

- Sanity adalah **source of truth** — selalu update Sanity untuk perubahan konten
- File markdown hanya backup — jangan edit Sanity dan markdown secara terpisah tanpa sinkronisasi
- Untuk menambah kegiatan: **Priority 1 via Sanity Studio**, Priority 2 via file markdown
