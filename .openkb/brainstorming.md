# Brainstorming Website Yayasan ASIB

## Struktur Halaman Website

### 1. Beranda (Home)
- Hero section dengan visi misi
- Statistik dampak (jumlah penerima manfaat, kegiatan, dll)
- Program unggulan
- Testimoni/donor stories
- CTA donasi

### 2. Tentang Kami (About)
- Profil yayasan & sejarah
- Visi & Misi
- Struktur organisasi
- Legalitas (SK Kemenkumham)
- Kontak & lokasi (embedded map)

### 3. Program
- Pendidikan (SD/SMP Islam)
- Bantuan Sosial (sembako, duafa)
- Qurban & Kafarat
- Ekonomi Umat

### 4. Galeri
- Dokumentasi kegiatan
- Video kegiatan
- Album foto kegiatan

### 5. Donasi
- Form donasi
- Informasi rekening
- QRIS
- Konfirmasi donasi

### 6. Berita/Kegiatan
- Update kegiatan terbaru
- Laporan penyaluran donasi
- Artikel keislaman

### 7. Kontak
- Form kontak
- Alamat lengkap
- Social media links

---

## Pertanyaan untuk Diskusi

### 1. Prioritas Halaman
Mana yang paling penting untuk MVP (Minimum Viable Product)?

### 2. Fitur Donasi
- Integrasi payment gateway (Midtrans/Xendit)?
- QRIS langsung?
- Cukup tampilkan info rekening?

### 3. Bahasa
- Bahasa Indonesia saja?
- Bilingual (ID + EN)?

### 4. Konten yang Diperlukan
- Logo yayasan?
- Foto-foto kegiatan?
- Struktur organisasi?
- Visi misi tertulis?

### 5. Target Audiens
- Donatur potensial?
- Orang tua murid?
- Relawan?
- Semua?

### 6. Fitur Khusus
- Laporan donasi real-time?
- Blog/artikel?
- Pendaftaran online (santri/murid)?
- Newsletter subscription?

---

## Stack Teknologi

| Komponen | Teknologi |
|----------|-----------|
| Framework | Astro |
| Styling | Tailwind CSS |
| Package Manager | Bun |
| Deployment | TBD |

---

## Design System & Visual Identity

*Diskusi: 27 Mei 2026*

### State Saat Ini

**Palet Warna:**
- Primary (Islamic Green): 50 → 950 — *solid, sudah WCAG compliant*
- Gold (Accent): 50 → 900 — *masih kurang dipake secara luas*
- Warm (Neutral): 50 → 900 — *baru ditambah 300/500/700 untuk WCAG*

**Tipografi:**
- Body: Inter, Noto Sans
- Display: Inter, Noto Sans — *(sama dengan body, tidak ada kontras)*

**Komponen:**
- Button: 5 varian (primary, gold, whatsapp, outline, outline-light)
- Card: 4 varian (default, hover, overflow, plain)
- PageHeader: Gradient green, semua halaman sama persis
- Icons: SVG inline via Icon.astro (size 4-20)

**Yang bikin terasa statis:**
1. Hanya 2 accent color (gold jarang dipakai) — visual monoton
2. Satu font untuk body & display — tidak ada hierarki tipografi
3. Flat design ekstrim — shadow minim, gradient cuma di hero, section divider lurus
4. Pola section berulang: PageHeader → py-16 section → py-16 section → footer
5. Zero micro-interaction — hover cuma ganti warna, tidak ada gerakan
6. Background seragam: white card di atas warm-50 terus

### Arah Desain: "Modern Islamic"

**Karakter:** Warm, berlapis, elegan — Islami tapi tidak kaku, modern tapi tidak dingin.

**Referensi gaya:**
- Tidak minimalis kaku (seperti sekarang)
- Tidak ramai/berlebihan
- Warm dan mengundang (approachable)
- Tetap profesional dan terpercaya

---

### 1. Perluasan Palet Warna

**Tambahan accent color:**

```
Opsi A — Teal (#0d9488) → pendamping green, fresh, tetap islami-friendly
Opsi B — Deep Amber (#d97706) → masih di keluarga gold tapi lebih bold
Opsi C — Navy (#1e3a5f) → kontras tinggi, profesional
```

**Ekspansi gold:**
- gold saat ini cuma dipake di button hero + label PageHeader
- gold perlu dipake lebih luas: sebagai bg soft (gold-50), border, icon hover, tag

**Penggunaan warna baru:**
- Tombol sekunder (variant baru)
- Background section selingan
- Icon hover state
- Tag/kategori badge variant
- Link hover color

**Aturan kontras (WAJIB):**
- Setiap kombinasi bg + text harus >= 4.5:1 (AA)
- Jangan sampai kejadian warm-900 di atas primary-800 lagi
- Semua warna baru harus diverifikasi kontrasnya sebelum dipakai

---

### 2. Tipografi — Display Font

**Masalah:** Inter untuk body dan display — tidak ada pembeda hierarki.

**Rekomendasi display font:**
- Plus Jakarta Sans — variable, modern, punya weight contrast tinggi
- Satoshi — clean, distinguished
- Atau font display dengan ciri warm: serif ringan untuk headline saja

**Implementasi:**
```css
--font-sans: 'Inter', 'Noto Sans', ui-sans-serif, sans-serif;    /* body */
--font-display: 'Plus Jakarta Sans', 'Inter', sans-serif;         /* headings */
```

**Hanya untuk h1-h3.** h4 dan seterusnya tetap pakai Inter biar konsisten.

**Aturan:**
- Body: Inter, weight 400/500/600
- Display (h1-h3): font display, weight 700/800, `tracking-tight`
- Caps/label: Inter 600/700, `uppercase tracking-widest`
- Tidak pakai serif — terlalu tradisional untuk brand "profesional modern"

---

### 3. Layering & Depth

**Transisi section:**
- Sekarang semua section rata — perlu variasi
- Opsi: section diseling `bg-white` dan `bg-primary-50/30`
- Subtle pattern overlay di hero/footer (geometric islamic, opacity 2-3%)
- Wave/curve divider antar section (via SVG clip-path)

**Shadow:**
- Sekarang cuma `shadow-lg` di card stats
- Perlu sistem shadow:
  - Card default: `shadow-sm`
  - Card hover: `shadow-lg hover:-translate-y-1`
  - Nav: `shadow-sm`
  - Modal/popup: `shadow-2xl`

**Overlap:**
- Hero → stats overlap (udah ada, perlu dipertegas dengan shadow)
- CTA section bisa overlap dengan section sebelumnya
- Foto/ilustrasi bisa keluar dari card boundary

---

### 4. Background Pattern & Texture

**Subtle patterns — bukan batik penuh, tapi hint aja:**
- Hero: geometric islamic pattern sebagai `bg-[url(...)]` opacity 0.02-0.03
- Footer: pattern serupa tapi lebih gelap
- Atau grain texture universal — ini aja udah beda drastis

**Cara implementasi:**
- SVG pattern inline (bukan file gambar — zero HTTP request)
- Base64 pattern kecil di CSS
- Cukup 1-2 pola, jangan banyak

---

### 5. Komponen & Interaksi

**Button — tambah varian & animasi:**
```
Sekarang: hover:bg-primary-700 — flat
Saran:    tambah hover:scale-[1.02] active:scale-95 transition-all duration-200
          tambah shadow di hover
```

**Button varian baru:**
- `secondary` — pakai accent color baru (teal/amber)
- `ghost` — transparan, muncul di hover aja
- `link` — kayak hyperlink tapi styled sebagai button

**Card — lebih hidup:**
- `hover:-translate-y-1 hover:shadow-xl`
- `transition-all duration-300` bukan cuma `transition-colors`
- Foto/icon di card bisa subtle scale di hover

**PageHeader — tidak seragam:**
- Sekarang 6 halaman pake gradient yang sama
- Alternatif tiap halaman bisa variasi:
  - Gradient arah beda (to-r, to-b, to-tl)
  - Overlay pattern berbeda
  - Dengan atau tanpa background image

**Nav — active indicator lebih explicit:**
- Sekarang cuma bg-primary-50 + text-primary-700
- Bisa tambah bottom border atau underline animated

---

### 6. Tata Letak (Layout)

**Sekarang (terlalu seragam):**
```
PageHeader → section (py-16) → section (py-16) → CTA → footer
```

**Variasi yang bisa dilakukan:**
- Alternating background antar section
- Full-width section diseling contained section
- Hero yang berbeda bentuk per halaman
- Content yang bisa punya sidebar (layout 2/3 + 1/3)
- Testimonial/carousel section

**Padding sistem:**
```
py-16  → section standar
py-20  → section premium/hero kecil
py-24+ → section utama/high impact
py-12  → section pendukung/kecil
```

---

### 7. Prioritas Implementasi

**Fase 1 — High Impact, Low Effort:**
- Display font (ganti variable font di CSS, no structural change)
- Card hover animation (+translateY +shadow)
- Button hover animation (+scale +shadow)
- Alternating section bg
- PageHeader variasi gradient direction

**Fase 2 — Medium:**
- Subtle background pattern (geometric SVG)
- Tambah accent color (teal/amber) + button variant
- Wave/section divider
- Nav active indicator

**Fase 3 — High Impact, High Effort:**
- PageHeader redesign per halaman
- Custom illustration/pattern
- Full micro-interaction system
- Carousel/testimonial section

---

### 8. Prinsip yang Gak Boleh Dilanggar

1. **WCAG AA** — jangan korbankan aksesibilitas demi estetik. Setiap perubahan warna harus dicek kontrasnya.
2. **Loading speed** — semua tambahan (pattern, font, animasi) harus diukur impact-nya. Pattern pakai SVG inline, font pakai variable dengan subset Latin.
3. **Konsistensi** — kalo udah milih arah, semua halaman harus ngikut. Jangan campur-campur gaya.
4. **Mobile first** — animasi dan efek harus tetap halus di HP. Jangan sampai jadi berat.
5. **Brand identity** — green dan gold sebagai identitas utama jangan ditinggalkan. Tambahan warna hanya sebagai pelengkap.

---

*Dokumen ini dibuat untuk keperluan brainstorming pengembangan website.*
*Terakhir diperbarui: 27 Mei 2026*

---

## Temuan dari Foto Kantor Sekretariat (27 Mei 2026)

### Sumber
Foto WhatsApp `WhatsApp Image 2026-05-27 at 8.28.01 AM.jpeg` — dokumentasi penyaluran bantuan di depan Kantor Sekretariat ASIB, Juron, Pendowoharjo, Sewon, Bantul. Foto menampilkan anak-anak asuh, pengurus yayasan, donatur, dan paket sembako.

### Data Bank Lengkap (5 Bank)
Tercantum di papan nama sekretariat. Sebelumnya hanya ada BSI.

| Bank | No. Rekening | Atas Nama |
|------|-------------|-----------|
| BSI | 9515769570 | Amal Shalih Insan Bantul |
| BRI | 023601001504565 | Yayasan Amal Shalih Insan Bantul |
| Mandiri | 1370023221274 | Yayasan Amal Shalih Insan Bantul |
| BNI | 1822474588 | Amal Shalih Insan Bantul |
| BCA | 7317108000 | Yayasan Amal Shalih Insan Bantul |

### Program yang Belum Ada di Website

| Program | Keterangan |
|---------|------------|
| LAZIS ASIB | Lembaga Amil Zakat Infaq Shadaqah — pengelolaan ZIS |
| Panti Asuhan | Panti asuhan anak yatim dan dhuafa |
| Bimbel Proton | Bimbingan belajar untuk anak-anak binaan |
| Relawan AMMA | Jaringan relawan yayasan |

*Sudah ada: PKBM BIM, PAUD BTM, RTQ/Rumah Tahfidz, Shodaqoh Barkas.*

### Aset Foto
- `public/dampak-nyata.webp` — 800×600, 83KB
- `public/dampak-nyata-sm.webp` — 400×300, 24KB

Digunakan di beranda sebagai section "Dampak Nyata".
