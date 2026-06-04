# Manajemen Workspace & Tim — Yayasan Amal Shalih Insan Bantul

> **Status:** 🟢 Aktif — 4 Juni 2026
> **Penanggung Jawab:** Kepala Koordinator IT (sandikodev)
> **Tujuan:** Dokumen ini mendefinisikan struktur kerja, pembagian fokus tim, pengelolaan workspace digital, dan alur komunikasi — agar seluruh operasional yayasan teraudit, transparan, dan tidak bergantung pada individu tertentu.

---

## Daftar Isi

- [1. Filosofi & Prinsip Dasar](#1-filosofi--prinsip-dasar)
- [2. Tiga Fokus Utama (3-Pilar Tim)](#2-tiga-fokus-utama-3-pilar-tim)
- [3. Struktur Organisasi Yayasan](#3-struktur-organisasi-yayasan)
- [4. Mapping Peran ke Tiga Fokus](#4-mapping-peran-ke-tiga-fokus)
- [5. Manajemen Email & Komunikasi](#5-manajemen-email--komunikasi)
- [6. Manajemen Akses & Workspace Digital](#6-manajemen-akses--workspace-digital)
- [7. Alur Kerja & Eskalasi](#7-alur-kerja--eskalasi)
- [8. Audit Trail & Akuntabilitas](#8-audit-trail--akuntabilitas)
- [9. Infrastruktur Teknis](#9-infrastruktur-teknis)
- [10. Strategic Roadmap](#10-strategic-roadmap)
- [Lampiran](#lampiran)

---

## 1. Filosofi & Prinsip Dasar

### Mengapa Dokumen Ini Ada

Yayasan ASIB berkembang dari lembaga kecil berbasis relawan menjadi organisasi dengan 3 unit pendidikan, puluhan pengurus, dan jangkauan donasi nasional. Pertumbuhan ini menuntut sistem pengelolaan yang:

1. **Tidak sentral ke satu orang** — semua akses, password, dan keputusan terdokumentasi
2. **Sesuai kemampuan yayasan** — prioritas solusi gratis/terjangkau (Cloudflare, Gmail, Sanity free tier)
3. **Strategis** — bisa scale up ke Google Workspace for Nonprofit jika nanti disetujui
4. **Teraudit** — setiap fokus punja penanggung jawab yang jelas

### Prinsip Dasar

| Prinsip | Makna |
|---------|-------|
| **Zero Single Point of Failure** | Tidak ada akses yang cuma dikuasai 1 orang |
| **Auditability First** | Setiap tindakan bisa dilacak siapa, kapan, dan kenapa |
| **Progressive Enhancement** | Mulai dari yang gratis dan cukup, upgrade bertahap |
| **Separation of Concerns** | Tiga fokus (IT, Admin, Media) tidak campur aduk |

---

## 2. Tiga Fokus Utama (3-Pilar Tim)

Setelah evaluasi, seluruh operasional yayasan dikelompokkan ke dalam **3 fokus utama**. Setiap fokus memiliki tanggung jawab, akses, dan wewenang yang jelas.

### Pilar 1: IT & Infrastruktur

| Aspek | Detail |
|-------|--------|
| **Kode** | `[IT]` |
| **Penanggung Jawab** | Kepala Koordinator IT (sandikodev) |
| **Fokus** | Infrastruktur digital, teknis, sistem, keamanan data |

**Lingkup Tanggung Jawab:**
- ✅ Seluruh infrastruktur digital (domain, hosting, DNS, email routing)
- ✅ Pengembangan & maintenance website (amalshalih.id)
- ✅ Manajemen repository, CI/CD, deployment
- ✅ Integrasi sistem (Sanity CMS, Sentry monitoring, Cloudflare)
- ✅ Keamanan data dan akses (API keys, secrets, credentials)
- ✅ Dokumentasi teknis dan SOP
- ✅ Audit sistem berkala

**Akses yang Dimiliki:**
- Cloudflare dashboard (full admin)
- GitHub repository (admin)
- VPS/server (jika ada)
- Domain registrar (amalshalih.or.id, amalshalih.id)
- Sanity CMS (admin)
- Google account IT (`it.amalshalih@gmail.com`)
- Semua secrets/credentials (API keys, auth tokens)

---

### Pilar 2: Administrasi & Akuntabilitas

| Aspek | Detail |
|-------|--------|
| **Kode** | `[ADM]` |
| **Penanggung Jawab** | Bendahara / Sekretaris Yayasan |
| **Fokus** | Administrasi program, keuangan, donasi, pelaporan |

**Lingkup Tanggung Jawab:**
- ✅ Manajemen donasi masuk (verifikasi, pencatatan, pelaporan)
- ✅ Administrasi program pendidikan (pendaftaran santri, data siswa)
- ✅ Pengelolaan dokumen legal (SK, akta, NIB, NPWP, laporan tahunan)
- ✅ Akuntabilitas keuangan (laporan penerimaan & penyaluran dana)
- ✅ Korespondensi resmi (surat-menyurat, MOU, kerja sama)
- ✅ Data penerima manfaat (yatim, dhuafa, santri binaan)

**Akses yang Dimiliki:**
- Email admin (`admin.amalshalih@gmail.com`)
- Rekening bank yayasan (akses lihat mutasi)
- Google Drive folder dokumen yayasan
- Sanity CMS (editor — konten program & laporan)

---

### Pilar 3: Media, Publikasi & Publishing

| Aspek | Detail |
|-------|--------|
| **Kode** | `[MED]` |
| **Penanggung Jawab** | Koordinator Media / Humas |
| **Fokus** | Publikasi, konten, media sosial, hubungan masyarakat |

**Lingkup Tanggung Jawab:**
- ✅ Manajemen media sosial (Instagram, Facebook, TikTok, YouTube)
- ✅ Publikasi kegiatan yayasan (foto, video, artikel)
- ✅ Content creation untuk website (berita, kegiatan, galeri)
- ✅ Hubungan masyarakat (media partner, press release)
- ✅ Branding & komunikasi publik
- ✅ Laporan dampak ke publik (infografis, newsletter)

**Akses yang Dimiliki:**
- Email media (`media.amalshalih@gmail.com`)
- Akun media sosial yayasan (Instagram, Facebook, TikTok, YouTube)
- Sanity CMS (editor — konten publikasi & galeri)
- Canva / alat desain (jika digunakan)

---

## 3. Struktur Organisasi Yayasan

### Dewan Pengurus (berdasarkan dokumen resmi)

| Jabatan | Nama |
|---------|------|
| **Ketua** | Haryadi |
| **Sekretaris** | Fat-han Kurnia Mubina |
| **Bendahara** | Muhammad Ilham Syaifudin |

> **Catatan:** Struktur lengkap (Dewan Pembina, Dewan Pengawas) masih ada di Akta Yayasan (PDF). Perlu diekstrak manual.

### Koordinator Bidang

| Bidang | Koordinator |
|--------|-------------|
| Pesantren Ramadhan | Furi Artanto & Az Zahra Salsabila Husna |
| Santunan Dhuafa & Yatim | Ismail Fahmi & Markhamah Niswatul Mukminah |
| Peringatan Nuzulul Qur'an | Muhammad Supanto & Salma Nikmah Hidayah |
| Wakaf Rumah Tahfidz | Nafi'ah Firahmatillah & Siti Fatimah |
| Silaturahmi Idul Fitri | Wakhid Rohmadin Setiawan & Fikri Fachrurrozi |

### Unit Pendidikan

| Unit | Kepala | Keterangan |
|------|--------|------------|
| **PKBM Bina Insan Mulia** | Fury Artanto | 17 ustadz/ustadzah, 70 santri |
| **PAUD Bina Tunas Mulia** | Wahyuningsih, S.Pd | 3 guru, 8 siswa |
| **Tahfidz & Tahsin** | — | 2 ustadzah, 25 santriwati |

---

## 4. Mapping Peran ke Tiga Fokus

Setiap peran dalam organisasi dipetakan ke salah satu dari 3 pilar. Satu orang bisa memiliki beberapa peran, tapi setiap peran memiliki fokus yang jelas.

```
KETUA DEWAN PENGURUS (Haryadi)
│
├── [IT] Kepala Koordinator IT (sandikodev)
│   └── Infrastruktur digital, website, sistem
│
├── [ADM] Sekretaris (Fat-han Kurnia Mubina)
│   └── Administrasi, surat-menyurat, dokumen legal
│
├── [ADM] Bendahara (Muhammad Ilham Syaifudin)
│   └── Keuangan, donasi, laporan keuangan
│
├── [ADM] Koordinator Santunan (Ismail Fahmi)
│   └── Data penerima manfaat, penyaluran bantuan
│
├── [MED] Koordinator Media & Publikasi
│   └── Sosmed, konten, publikasi kegiatan
│
├── [ADM] Kepala PKBM (Fury Artanto)
│   └── Operasional PKBM, data santri
│
├── [ADM] Kepala PAUD (Wahyuningsih, S.Pd)
│   └── Operasional PAUD, data siswa
│
└── [MED] Koordinator Acara & Dokumentasi
    └── Dokumentasi kegiatan, peliputan acara
```

---

## 5. Manajemen Email & Komunikasi

### Arsitektur Email

```
                   ┌──────────────────────┐
                   │  @amalshalih.or.id    │
                   │  (Cloudflare Email    │
                   │   Routing)            │
                   └──────────┬───────────┘
                              │
            ┌─────────────────┼──────────────────┐
            ▼                 ▼                   ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │   info@      │  │  admin@      │  │  humas@      │
    │              │  │  donasi@     │  │              │
    ├──────────────┤  ├──────────────┤  ├──────────────┤
    │  → IT Inbox  │  │ → Admin Inb  │  │ → Media Inb  │
    └──────────────┘  └──────────────┘  └──────────────┘
```

### Tabel Routing

| Email @amalshalih.or.id | Diteruskan Ke | Fokus | Digunakan Untuk |
|---|---|---|---|
| **info@** | `it.amalshalih@gmail.com` | [IT] | Pertanyaan teknis, info umum, laporan bug website |
| **donasi@** | `admin.amalshalih@gmail.com` | [ADM] | Konfirmasi donasi, zakat, infak, sedekah |
| **admin@** | `admin.amalshalih@gmail.com` | [ADM] | Administrasi, pendaftaran, surat-menyurat |
| **humas@** | `media.amalshalih@gmail.com` | [MED] | Media, publikasi, kerja sama, press |
| *@amalshalih.or.id (catch-all) | `it.amalshalih@gmail.com` | [IT] | Semua alamat lain yang tidak terdefinisi |

### Alur Penanganan Email

1. **Email masuk** → routing otomatis ke inbox tujuan sesuai mapping
2. **Penerima** membaca dan menindaklanjuti sesuai fokus masing-masing
3. **Jika butuh lintas fokus** — forward ke email fokus terkait, CC kepala koordinator IT
4. **Jika butuh keputusan** — eskalasi ke Ketua Yayasan via grup WhatsApp koordinasi

### Catatan Penting

- **Google Workspace for Nonprofit**: Saat ini masih dalam proses pengajuan. Jika ACC, destinasi routing bisa diubah dari `@gmail.com` ke `@amalshalih.or.id` tanpa mengubah struktur.
- **Tidak ada webmail**: Semua email dikelola via Gmail. Tidak perlu hosting email sendiri.
- **Filter Gmail**: Masing-masing inbox disarankan membuat filter/label untuk memisahkan email per alamat (misal di `admin.amalshalih@gmail.com`, filter `to:donasi@` → label "Donasi").

---

## 6. Manajemen Akses & Workspace Digital

### Platform & Tingkat Akses

| Platform | [IT] | [ADM] | [MED] | Catatan |
|----------|------|-------|-------|---------|
| **Cloudflare Dashboard** | Admin | — | — | Domain, DNS, Email Routing, Workers |
| **GitHub Repository** | Admin | — | — | Private repo, IT handle all code |
| **Sanity CMS** | Admin | Editor | Editor | IT: schema & struktur; ADM/MED: konten |
| **Sentry** | Admin | — | — | Error tracking, monitoring |
| **Gmail IT** (it.amalshalih@gmail.com) | Full | — | — | Info & catch-all email |
| **Gmail Admin** (admin.amalshalih@gmail.com) | — | Full | — | Admin & donasi email |
| **Gmail Media** (media.amalshalih@gmail.com) | — | — | Full | Humas & publikasi email |
| **Google Drive** | — | Admin | Editor | Dokumen yayasan, laporan, arsip |
| **Instagram/Facebook/TikTok/YT** | — | — | Admin | Sosial media yayasan |
| **Canva** | — | — | Admin | Desain konten |

### Kredensial & Secrets

Semua kredensial penting (API keys, password, token) dikelola sebagai berikut:

1. **Tidak disimpan di satu tempat** — minimal 2 orang tahu akses kritis
2. **GitHub Secrets** — untuk CI/CD (SENTRY_AUTH_TOKEN, CLOUDFLARE_API_TOKEN, dll)
3. **`.dev.vars`** — untuk development lokal (tidak di-commit)
4. **Dokumentasi** — lokasi penyimpanan kredensial dicatat di dokumen internal

### Prinsip Akses

| Prinsip | Penerapan |
|---------|-----------|
| **Least Privilege** | Setiap orang hanya punya akses yang dibutuhkan untuk perannya |
| **No Shared Accounts** | Tidak ada akun bersama — setiap orang punya akses sendiri |
| **Audit Trail** | Setiap perubahan bisa dilacak (git log, sentry, dashboard logs) |
| **Recovery** | Setiap platform memiliki recovery contact minimal 2 orang |

---

## 7. Alur Kerja & Eskalasi

### Alur Permintaan / Pengaduan

```
Orang/Donatur/Mitra
        │
        ▼
Email masuk ke salah satu inbox (info/admin/donasi/humas)
        │
        ▼
Penerima membaca & klasifikasi
        │
        ├── [IT]  → Teknis, website, sistem           → selesai
        ├── [ADM] → Administrasi, donasi, pendaftaran  → selesai
        ├── [MED] → Publikasi, media, konten           → selesai
        └── Butuh keputusan → Eskalasi ke Ketua via WA
```

### Alur Publikasi Konten

```
[MED] Membuat konten (artikel, foto, video)
        │
        ▼
[MED] Upload draft ke Sanity CMS
        │
        ▼
[ADM] Review konten & verifikasi data (jika terkait program)
        │
        ▼
[IT]  Publish / deploy (jika perlu perubahan kode)
   atau
[MED] Publish langsung (jika hanya konten CMS)
```

### Alur Pelaporan Donasi

```
Donatur transfer ke rekening yayasan
        │
        ▼
[ADM] Bendahara verifikasi masuknya dana
        │
        ▼
[ADM] Catat di laporan keuangan
        │
        ▼
[MED] Publikasikan laporan penyaluran (infografis)
        │
        ▼
[IT]  Update halaman donasi / laporan di website
```

### Eskalasi

| Tingkat | Kepada | Via |
|---------|--------|-----|
| L1 — Operasional | Masing-masing PIC fokus | Email / WA group |
| L2 — Lintas Fokus | Kepala Koordinator IT | WA / Email |
| L3 — Keputusan Strategis | Ketua Yayasan | WA / Rapat |

---

## 8. Audit Trail & Akuntabilitas

Yang membuat sistem ini robust bukan tools-nya, tapi bagaimana setiap aktivitas tercatat dan bisa diaudit.

### Mekanisme Audit per Fokus

| Fokus | Audit Trail | Frekuensi |
|-------|-------------|-----------|
| **[IT]** | Git commit log (setiap perubahan kode tercatat) | Real-time |
| **[IT]** | Cloudflare dashboard logs (DNS, email routing) | Bulanan |
| **[IT]** | Sentry error history | Mingguan |
| **[ADM]** | Laporan keuangan (penerimaan & penyaluran) | Bulanan |
| **[ADM]** | Email log (administrasi) | Bulanan |
| **[ADM]** | Data penerima manfaat | Per program |
| **[MED]** | Jadwal publikasi & konten terbit | Mingguan |
| **[MED]** | Analytics media sosial | Bulanan |

### Akses Kepala Koordinator IT ke Audit

Koordinator IT (sandikodev) memiliki akses **read-only** ke semua audit trail:
- Git history — lihat semua perubahan kode
- Cloudflare logs — lihat routing, DNS changes
- Sentry — lihat error & performance
- Google Drive — lihat dokumen (jika diberi akses)
- Email routing logs — lihat volume & status pengiriman

---

## 9. Infrastruktur Teknis

### Stack Digital

| Komponen | Teknologi | Biaya | Status |
|----------|-----------|-------|--------|
| **Domain** | amalshalih.or.id (email) + amalshalih.id (website) | Berbayar (tahunan) | ✅ |
| **DNS & Email Routing** | Cloudflare | Gratis | ✅ |
| **Website Framework** | Astro 6 + Tailwind 4 | Gratis (open source) | ✅ |
| **Hosting** | Cloudflare Workers | Gratis (10M req/bln) | ✅ |
| **CMS** | Sanity (headless) | Gratis (free tier) | ✅ |
| **Monitoring** | Sentry | Gratis (developer tier) | ✅ |
| **Repository** | GitHub (private) | Gratis | ✅ |
| **Email Inboxes** | Gmail (3 akun) | Gratis | 🔧 Setup |
| **Design** | Canva (free) | Gratis | ✅ |
| **Package Manager** | Bun | Gratis | ✅ |

### Keterangan Biaya

| Item | Perkiraan Biaya | Dibayar Oleh |
|------|----------------|--------------|
| Domain (.or.id + .id) | ~Rp 300-500k/tahun | Yayasan / PT KJI |
| Email gratis (Gmail) | Rp 0 | — |
| Cloudflare Workers | Rp 0 (kuota cukup) | — |
| Sanity CMS | Rp 0 (free tier) | — |

### Jika Google Workspace for Nonprofit ACC

Perubahan yang terjadi:
1. Email routing: destinasi dari `@gmail.com` → `@amalshalih.or.id`
2. Inbox: dari Gmail biasa → Google Workspace (tetap akses via Gmail)
3. Fitur tambahan: Shared Drive, lebih banyak storage, admin panel terpusat
4. Struktur 3 fokus tidak berubah — hanya platform inbox yang berbeda

---

## 10. Strategic Roadmap

### Fase 1 — Foundation (✅ Selesai)
- [x] Website live (amalshalih.id)
- [x] Cloudflare Email Routing aktif
- [x] Repository & CI/CD pipeline
- [x] CMS Sanity terintegrasi
- [x] Struktur 3 fokus didefinisikan

### Fase 2 — Workspace Setup (🔜 Sekarang)
- [ ] Membuat 3 Google inbox: `it`, `admin`, `media` @gmail.com
- [ ] Update routing Cloudflare sesuai mapping 3 fokus
- [ ] Konfigurasi Gmail filters & labels per inbox
- [ ] Dokumentasi akses & kredensial
- [ ] Sosialisasi ke pengurus yayasan

### Fase 3 — Pematangan Sistem
- [ ] Standard operating procedure untuk setiap fokus
- [ ] Template email untuk donasi, admin, media
- [ ] Kalender publikasi konten
- [ ] Laporan berkala (bulanan) dari masing-masing fokus

### Fase 4 — Scale Up (Jika Google Workspace ACC)
- [ ] Migrasi inbox dari @gmail.com ke @amalshalih.or.id
- [ ] Google Shared Drive untuk dokumen yayasan
- [ ] Admin panel terpusat (Google Admin)
- [ ] Audit keamanan menyeluruh

---

## Lampiran

### A. Daftar Email & Routing

#### 1. Target Goal (Arsitektur Ideal Akhir)
> **Catatan Head IT**: Ini adalah arsitektur akhir yang disepakati sebagai standar baku manajemen workspace yayasan. Transisi ke sistem ini memerlukan sosialisasi dan rapat pengurus karena akun-akun Gmail saat ini terlanjur dibuat secara mandiri oleh masing-masing personil, bukan di-inisiasi terpusat oleh IT dari awal. Kita harus mengelolanya secara hati-hati agar tidak mengganggu operasional yang sedang berjalan.

| Alamat | Routing | Fokus | Status |
|--------|---------|-------|--------|
| **info@amalshalih.or.id** | → `it.amalshalih@gmail.com` | [IT] | 🟡 Perlu update routing (setelah sosialisasi) |
| **donasi@amalshalih.or.id** | → `admin.amalshalih@gmail.com` | [ADM] | 🟡 Perlu update routing (setelah sosialisasi) |
| **admin@amalshalih.or.id** | → `admin.amalshalih@gmail.com` | [ADM] | 🟡 Perlu update routing (setelah sosialisasi) |
| **humas@amalshalih.or.id** | → `media.amalshalih@gmail.com` | [MED] | 🟡 Perlu update routing (setelah sosialisasi) |
| **\*@amalshalih.or.id (catch-all)** | → `it.amalshalih@gmail.com` | [IT] | 🟡 Perlu update routing (setelah sosialisasi) |

#### 2. Kondisi Transisi Saat Ini (Masa Penyesuaian)
> **Status Sementara**: Digunakan untuk menjamin roda yayasan tetap berputar selagi proses sosialisasi manajemen baru berjalan.

| Alamat | Routing | Fokus | Status |
|--------|---------|-------|--------|
| **info@amalshalih.or.id** | → `timitasib@gmail.com` | [IT] | ✅ Aktif |
| **donasi@amalshalih.or.id** | → `amalshalih.insanbantul@gmail.com` | [ADM] | 🟡 Menunggu Verifikasi di Cloudflare |
| **admin@amalshalih.or.id** | → `amalshalih.insanbantul@gmail.com` | [ADM] | 🟡 Menunggu Verifikasi di Cloudflare |
| **humas@amalshalih.or.id** | → `[Email Media Sementara]` | [MED] | 🟡 Menunggu Pembuatan/Pemberian Email |
| **\*@amalshalih.or.id (catch-all)** | → `timitasib@gmail.com` | [IT] | ✅ Aktif |

---

### B. Analisis Dilema Manajemen Workspace (Catatan Strategis Head IT)

Mengatur tata kelola IT di lembaga nirlaba seperti Yayasan ASIB memiliki tantangan non-teknis yang jauh lebih pelik dibanding tantangan teknis:

1. **Dilema Sentralisasi vs Desentralisasi**: 
   Inisiasi awal akun digital yang dibuat secara desentralisasi oleh masing-masing pengurus membuat aset digital yayasan tersebar dan sulit diaudit. Sentralisasi langsung secara mendadak bisa memicu resistensi atau kebingungan operasional.
   
2. **Strategi Pendekatan Humanis (Social-Technical approach)**:
   - **Fase 1 (Sistem Bayangan)**: Kita pasang sistem Cloudflare routing sementara mengarah ke email existing mereka agar tim tidak perlu mengubah cara kerja mereka hari ini.
   - **Fase 2 (Rapat Sosialisasi)**: Kepala IT menyajikan dokumen tata kelola ini ke Ketua dan Pengurus untuk menyamakan visi pentingnya kepemilikan aset lembaga secara terpusat (it.amalshalih@, admin.amalshalih@, dll).
   - **Fase 3 (Handover Terkontrol)**: Pembuatan akun pattern baru dilakukan bersama, lalu routing dialihkan total secara perlahan, dibarengi training singkat cara setting SMTP Gmail agar mereka bisa membalas menggunakan alamat `@amalshalih.or.id`.

3. **Langkah Mitigasi Risiko**:
   - Jangan memutus routing lama sebelum tim siap dengan akun baru.
   - Dokumentasikan setiap akun Gmail beserta nomor pemulihan (recovery phone) yang harus menggunakan nomor resmi yayasan, bukan nomor pribadi pengurus.

---

### C. Program & Layanan Yayasan

| Program | Fokus Terkait | Keterangan |
|---------|---------------|------------|
| Rumah Tahfidz | [ADM] | Pesantren tahfidz shift |
| PKBM Bina Insan Mulia | [ADM] | Pendidikan diniyah, 70 santri |
| PAUD Bina Tunas Mulia | [ADM] | TPA & Kelompok Bermain |
| Santunan Sembako Bulanan | [ADM] + [MED] | 110 penerima binaan |
| Jumat Bersedekah | [MED] | Nasi kotak keliling Jogja |
| Wakaf Jariyah | [ADM] + [MED] | Pengadaan lahan 2000 m² |
| ZIS (Zakat, Infaq, Shadaqah) | [ADM] | Penerimaan & penyaluran |
| Qurban & Kafarat | [ADM] | Layanan tahunan |
| Barkas (Sedekah Barang Bekas) | [MED] | Donasi barang layak jual |
| LAZIS ASIB | [ADM] | Lembaga Amil Zakat |
| Relawan AMMA | [MED] | Jaringan relawan |
| Bimbel Proton | [ADM] | Bimbingan belajar |

### C. Akun Bank Yayasan

| Bank | No. Rekening | Atas Nama |
|------|-------------|-----------|
| BSI | 9515769570 | Amal Shalih Insan Bantul |
| BRI | 023601001504565 | Yayasan Amal Shalih Insan Bantul |
| Mandiri | 1370023221274 | Yayasan Amal Shalih Insan Bantul |
| BNI | 1822474588 | Amal Shalih Insan Bantul |
| BCA | 7317108000 | Yayasan Amal Shalih Insan Bantul |

### D. Media Sosial Resmi

| Platform | Akun | Dikelola Oleh |
|----------|------|---------------|
| Instagram | @amalshalihinsan | [MED] |
| Facebook | @amalshalihinsanbantul | [MED] |
| TikTok | @yayasan.amalshalihinsan | [MED] |
| YouTube | Amal Shalih Insan Bantul | [MED] |
| Website | amalshalih.id | [IT] |

---

## Referensi

- Dokumen terkait di `.openkb/`: `yayasan-profile.md`, `audit-komprehensif.md`, `email-system.md`
- Domain: amalshalih.or.id (Cloudflare)
- Website: amalshalih.id (Cloudflare Workers)
- Repository: Private GitHub — PT Koneksi Jaringan Indonesia
- Dibuat oleh: **sandikodev** (Kepala Koordinator IT) — 4 Juni 2026
