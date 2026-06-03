# Email Yayasan Amal Shalih Insan Bantul

> Status: 🔄 **RESTRUCTURING** — 4 Juni 2026
> Teknologi: Cloudflare Email Routing → 3 Gmail Inboxes (IT / Admin / Media)
> 
> **Dokumen ini bagian dari `workspace-management.md` — baca dulu untuk konteks penuh.**

## Daftar Email & Target Routing

Ada dua kondisi yang kita kelola: **Kondisi Transisi (Saat Ini)** demi kelancaran operasional pengurus yang ada, dan **Arsitektur Ideal (Target Akhir)** yang akan diwujudkan setelah sosialisasi oleh Head IT.

### 1. Target Akhir (Arsitektur Ideal)
> Ini adalah goal akhir manajemen workspace yayasan. Transisi ke sini membutuhkan rapat sosialisasi karena akun Gmail yang ada terlanjur dibuat mandiri oleh masing-masing personil.

| Email @amalshalih.or.id | Diteruskan Ke | Fokus | Status |
|---|---|---|---|
| **info@** | `it.amalshalih@gmail.com` | [IT] | 🟡 Perlu update routing (goal akhir) |
| **donasi@** | `admin.amalshalih@gmail.com` | [ADM] | 🟡 Perlu update routing (goal akhir) |
| **admin@** | `admin.amalshalih@gmail.com` | [ADM] | 🟡 Perlu update routing (goal akhir) |
| **humas@** | `media.amalshalih@gmail.com` | [MED] | 🟡 Perlu update routing (goal akhir) |
| **Catch-all** | `it.amalshalih@gmail.com` | [IT] | 🟡 Perlu update routing (goal akhir) |

### 2. Kondisi Transisi (Sementara - Aktif)
> Status penyesuaian saat ini menggunakan email existing pengurus agar roda organisasi tetap berjalan selama masa transisi.

| Email @amalshalih.or.id | Diteruskan Ke | Fokus | Status |
|---|---|---|---|
| **info@** | `timitasib@gmail.com` | [IT] | ✅ Aktif |
| **donasi@** | `amalshalih.insanbantul@gmail.com` | [ADM] | 🟡 Menunggu Verifikasi di Cloudflare |
| **admin@** | `amalshalih.insanbantul@gmail.com` | [ADM] | 🟡 Menunggu Verifikasi di Cloudflare |
| **humas@** | `[Email Media Sementara]` | [MED] | 🟡 Menunggu Pembuatan/Pemberian Email |
| **Catch-all** | `timitasib@gmail.com` | [IT] | ✅ Aktif |

---

## Cara Kerja

```
Pengirim → info@amalshalih.or.id
                ↓
        Cloudflare Email Routing
                ↓
        MX: route1/2/3.mx.cloudflare.net
        SPF: v=spf1 include:_spf.mx.cloudflare.net
        DKIM: cf2024-1._domainkey.amalshalih.or.id
                ↓
        timitasib@gmail.com (inbox utama)
```

Cloudflare menerima email di alamat custom, lalu meneruskannya (forward) ke Gmail. Semua email masuk ke inbox yang sama — tinggal pakai filter/label Gmail untuk memisahkan per alamat.

---

## Untuk Tim Media — Cara Pakai Email

### Menerima Email
Tidak perlu melakukan apapun. Email yang dikirim ke `info@`, `donasi@`, `admin@`, `humas@` akan otomatis masuk ke inbox `timitasib@gmail.com`.

**Tips organisasi inbox:**
1. Buka Gmail → Settings (⚙️) → See all settings → Filters and Blocked Addresses
2. Buat filter untuk masing-masing alamat, misalnya:
   - `to:info@amalshalih.or.id` → label "Info"
   - `to:donasi@amalshalih.or.id` → label "Donasi"
   - `to:admin@amalshalih.or.id` → label "Admin"
   - `to:humas@amalshalih.or.id` → label "Humas"

### Mengirim Email dari Alamat Custom

Agar bisa **membalas** email dari alamat yang sama (misal email masuk ke `info@`, dibalas dari `info@` juga), setting Gmail:

1. Buka **Gmail** → ⚙️ **Settings** → **See all settings**
2. Tab **Accounts and Import** → **Send mail as** → **Add another email address**
3. Isi:
   - Name: `Yayasan Amal Shalih Insan Bantul`
   - Email: `info@amalshalih.or.id`
4. **Uncheck** "Treat as an alias" (biar bisa pilih signature berbeda)
5. Next → SMTP Settings:
   - **SMTP Server**: `smtp.gmail.com`
   - **Port**: `587`
   - **Username**: `timitasib@gmail.com`
   - **Password**: pakai **App Password** (lihat cara di bawah)
   - **Secured connection**: TLS
6. Klik **Add Account** → kode verifikasi dikirim ke `timitasib@gmail.com` (masuk kok karena catch-all)
7. Masukkan kode → selesai
8. Ulangi langkah 2-7 untuk `donasi@`, `admin@`, `humas@`

**App Password (wajib kalau 2FA aktif):**
1. Buka https://myaccount.google.com/security
2. **2-Step Verification** → **App passwords**
3. Pilih app: **Mail**, device: **Other** → ketik "Cloudflare Email"
4. Copy password 16 digit yang muncul
5. Gunakan password itu di setting SMTP Gmail di atas

---

## Untuk Tim IT — Panduan Teknis

### Stack
- **Email Routing**: Cloudflare (free, included with domain)
- **DNS**: Cloudflare nameservers (`ara.ns.cloudflare.com` / `mustafa.ns.cloudflare.com`)
- **Inbox**: Gmail (free)
- **Biaya**: Rp 0 (gratis)

### Konfigurasi DNS (Otomatis oleh Cloudflare)

Setelah Email Routing diaktifkan, Cloudflare otomatis menambahkan:

| Type | Name | Content | Priority |
|---|---|---|---|
| MX | amalshalih.or.id | route1.mx.cloudflare.net | 37 |
| MX | amalshalih.or.id | route2.mx.cloudflare.net | 68 |
| MX | amalshalih.or.id | route3.mx.cloudflare.net | 22 |
| TXT | amalshalih.or.id | v=spf1 include:_spf.mx.cloudflare.net ~all | - |
| TXT | cf2024-1._domainkey | DKIM key (RSA 2048) | - |

> **⚠️ Jangan dihapus atau diedit manual** — Cloudflare mengelola ini otomatis.

### Manajemen via CLI (Wrangler)

Semua operasi bisa dilakukan lewat `wrangler` di server ini:

```bash
# Cek status
wrangler email routing settings amalshalih.or.id

# Lihat semua rules
wrangler email routing rules list amalshalih.or.id

# Lihat destination addresses
wrangler email routing addresses list

# Tambah rule baru
wrangler email routing rules create amalshalih.or.id \
  --name "NamaRule" \
  --match-type "literal" \
  --match-field "to" \
  --match-value "emailbaru@amalshalih.or.id" \
  --action-type "forward" \
  --action-value "timitasib@gmail.com"

# Hapus rule
wrangler email routing rules delete amalshalih.or.id <RULE_ID>

# Matiin catch-all sementara
wrangler email routing rules update amalshalih.or.id catch-all \
  --action-type "drop"
```

### Manajemen via Dashboard Cloudflare

1. Login ke https://dash.cloudflare.com
2. Pilih domain **amalshalih.or.id**
3. Kiri sidebar → **Email** → **Email Routing**
4. Dari sini bisa: tambah/hapus rules, lihat log, dsb

### Log & Monitoring

- Email routing log tersedia di dashboard Cloudflare → Email → Email Routing → **View logs**
- Untuk monitoring error: cek Sentry (project dashboard) atau wrangler logs

---

## Perubahan di Website

Setelah email aktif, update website:

1. **Footer/kontak** — tambah email:
   ```
   info@amalshalih.or.id (kontak umum)
   donasi@amalshalih.or.id (donasi)
   ```
2. **Halaman kontak** — update form action atau display email
3. **Business Profile** (Google, Instagram) — update email kontak

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| Email tidak masuk | Cek spam Gmail. Cek log di Cloudflare dashboard |
| SPF error | Verifikasi TXT record `v=spf1 include:_spf.mx.cloudflare.net ~all` masih ada |
| DKIM error | Cloudflare otomatis manage — cek di dashboard Email → DKIM |
| Verifikasi email gagal | Resend dari Cloudflare dashboard → Destination addresses |
| Gmail reject kirim | Pastikan pakai App Password, bukan password biasa |

---

## Referensi

- Cloudflare Email Routing docs: https://developers.cloudflare.com/email-routing/
- Tech guide: https://altersquare.medium.com/free-custom-domain-emails-with-gmail-and-cloudflare-a-beginners-guide-84d759b373f7
- Dibuat oleh: **it-amma** (Sisyphus) — 3 Juni 2026
