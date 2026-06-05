# Yayasan Amal Shalih Insan Bantul — Sisyphus Anchored Summary

> **Diperbarui:** 4 Juni 2026
> **Sesi:** 2 (Sanity CMS, Tooling, Email System, Workspace Mgmt)
> **Status:** ✅ Deployed & live, fitur inti selesai

---

## Goal

Astro site (amalshalih.or.id) — build, deploy, maintain via Cloudflare Workers + Sanity CMS hybrid architecture.

---

## Current Status

| Layer | Status | Notes |
|-------|--------|-------|
| **Deploy** | ✅ Live | `www.amalshalih.or.id` via Cloudflare Workers |
| **Build Pipeline** | ✅ Fixed | Rollup 4.60.x manifest patch applied |
| **Sanity CMS** | ✅ Built | Schema, types, queries, hybrid wiring — deployed & wired |
| **Tooling** | ✅ Setup | Biome, ESLint, Vitest, Husky pre-commit hooks |
| **Email System** | ✅ Configured | Cloudflare Email Routing rules created |
| **Content** | 🟡 Needs filling | Sanity Studio ready — Tim Media input pending |
| **Gallery** | 🟡 Partial | Google Drive system exists, Sanity hybrid pending |

---

## Work Completed (Sesi 2 — 4 Juni 2026)

### Sanity CMS Integration
- **Schema** (`d78278e`): Added document types — `siteSettings` (menu, kontak), `kategoriLabels`, `faq`, `legalInfo`, redirects, `sanity.session` metadata
- **Types, Queries, Client** (`33f87b3`): Full TypeScript types, GROQ queries, Sanity client for hybrid fetch
- **Hybrid Wiring — Layouts** (`c6279eb`): BaseLayout, navigation, footer (contact info, legal links), SEO meta, schema.org JSON-LD, floating contact buttons, mobile bottom nav
- **Hybrid Wiring — Pages** (`9ab6629`): Tentang, Program, Donasi, Kontak, Kegiatan index + detail, FAQ, Kebijakan Privasi, Syarat & Ketentuan — all fetching from Sanity with local fallback
- **Design pattern**: Sanity is source of truth → Astro fetches via GROQ at build time → local `site.ts` fallback when Sanity down

### Email System (Cloudflare Email Routing)
- **Rules created** (`e42cd5a`): `info@` → timitasib@gmail.com, `donasi@` → amalshalih.insanbantul@gmail.com, `admin@` → amalshalih.insanbantul@gmail.com, `humas@` → timitasib@gmail.com, catch-all → timitasib@gmail.com
- **Documentation**: Full user guides for IT team (DNS, wrangler CLI, dashboard) and Media team (Gmail alias setup, App Passwords, inbox filters)
- **Architecture diagram fix** (`5f95fc7`): Corrected `donasi@` routing — Admin Inbox, not IT Inbox

### Tooling & Testing
- **Biome + ESLint** (`fc3b6b2`): Linter/formatter configs with Astro/TypeScript support
- **Vitest + Husky** (`fc094c5`): Test framework setup, pre-commit hooks
- **Tests** (`d348462`): Data integrity tests for constants, kategoriLabels, site data

### Workspace Management
- **Framework docs** (`b5cd3ac`): Workspace & team management transition framework, identity management, email restructuring plan
- **`.openkb/`**: Knowledge base populated — brainstorming, audit, CMS strategy, email system, workspace management, yayasan profile

### Deployment
- **CI/CD fix** (`5a40c9b`): Resolved GitHub Actions build failures (Node 24 deprecation, missing dependencies)
- **Manual deploy** (`e1f166b`): Restored `deploy.yml` with `workflow_dispatch` trigger

---

## Key Technical Details

### Sanity Hybrid Architecture
```
Sanity CMS (source of truth)
       │
       ▼ GROQ via @sanity/client (at build time)
       │
       ▼ HybridData = merge(SanityData, localFallback)
       │
       ▼ Passed to Astro pages as props
       │
       ▼ Rendered as static HTML → Cloudflare Workers
```

- **Project ID**: `fd1bd`
- **Dataset**: `production`
- **CDN**: Enabled (public read)
- **Visual Editing**: Not wired yet (optional)
- **Schema types**: `siteSettings`, `kategoriLabels`, `faq`, `legalInfo`, `redirect`

### Email System
- **Provider**: Cloudflare Email Routing (free)
- **DNS**: Managed by Cloudflare (MX, SPF, DKIM auto-configured)
- **Inboxes**: 3 Gmail inboxes — IT (`timitasib@gmail.com`), Admin (`amalshalih.insanbantul@gmail.com`), Media (`media.amalshalih@gmail.com`)
- **Status**: Basic routing active. Transition to ideal architecture (3 separate inboxes) pending IT team socialization.

### Build Patch (from Sesi 1)
- **Root cause**: Rollup 4.60.x emits virtual `\0virtual:astro:manifest` chunk separately, so worker-entry chunk's `moduleIds` doesn't contain the resolved virtual ID
- **Fix**: Added `|| c.code.includes(MANIFEST_REPLACE)` fallback in `extractRelevantChunks()` and `manifestBuildPostHook()`
- **Permanent fix needed**: Postinstall script or Astro/Cloudflare adapter upgrade

---

## Relevant Files

### Sanity Integration
| File | Purpose |
|------|---------|
| `src/lib/sanity.ts` | Sanity client, CDN config, image URL builder |
| `src/lib/sanity.queries.ts` | All GROQ queries |
| `src/lib/sanity.types.ts` | TypeScript types for Sanity documents |
| `src/lib/hybrid-data.ts` | Hybrid merge logic (Sanity → local fallback) |
| `src/data/site.ts` | Local fallback data (static) |

### Core Pages (Sanity-wired)
| Page | Sanity Document Used |
|------|---------------------|
| `src/pages/index.astro` | siteSettings, kategoriLabels |
| `src/pages/tentang.astro` | siteSettings |
| `src/pages/program.astro` | siteSettings |
| `src/pages/donasi.astro` | siteSettings |
| `src/pages/kontak.astro` | siteSettings |
| `src/pages/faq.astro` | faq |
| `src/pages/kebijakan-privasi.astro` | legalInfo |
| `src/pages/syarat-ketentuan.astro` | legalInfo |
| `src/layouts/BaseLayout.astro` | siteSettings, legalInfo |

### Email System
| File | Purpose |
|------|---------|
| `.openkb/email-system.md` | Full documentation for IT & Media teams |
| `.sisyphus/plans/email-setup.md` | Technical setup checklist |

### Tooling
| File | Purpose |
|------|---------|
| `biome.json` | Biome config (formatter + linter) |
| `eslint.config.js` | ESLint config |
| `vitest.config.ts` | Vitest test runner config |
| `.husky/pre-commit` | Pre-commit hook (linter + tests) |
| `.husky/pre-push` | Pre-push hook |

---

## Domains

| Domain | Status | Notes |
|--------|--------|-------|
| `www.amalshalih.or.id` | ✅ Live | Production — Cloudflare Workers |
| `amalshalih.or.id` | ✅ Redirects to www | Cloudflare redirect rule |
| `www.asib.workers.dev` | ✅ Active | Worker default subdomain |
| `amalshalih.id` | ❌ Expired | Not renewed (2023/2024) |

---

## Next Steps

### 1. 🟡 Deploy current code
Latest 20+ commits (Sanity, tooling, email) are committed but **not deployed**. Run:
```bash
git push
# GitHub Actions deploy.yml will deploy via workflow_dispatch
```

### 2. 🟡 Content filling via Sanity Studio
Tim Media perlu mengisi data pengurus via Sanity Studio:
- **Pengurus** — nama Pembina, Dewan Pengawas, Pembina Yayasan
- **Menu** — edit navigasi menu
- **Label Kategori** — edit label kegiatan
- **FAQ** — isi pertanyaan & jawaban
- **Legal info** — Kebijakan Privasi & Syarat Ketentuan
- **Foto** — upload foto kegiatan, pengurus
- **Profile** — visi, misi, sejarah yayasan

### 3. 🔵 Optional: Detail footer
Wire `operatingHoursDetail` di BaseLayout footer — currently using simplified hours.

### 4. 🔵 Optional: Multi-email di halaman lain
`syarat-ketentuan.astro` dan `kebijakan-privasi.astro` masih pakai `CONTACT.email` hardcoded — perlu update ke array email dari Sanity.

### 5. 🔵 Optional: Visual Editing
Wire up Sanity Presentation tool / Visual Editing for live preview.

---

## Constraints & Preferences

- Build must produce valid Cloudflare Worker output (no `@@ASTRO_MANIFEST_REPLACE@@` left in chunks)
- Use `wrangler deploy` (not Pages)
- Domain utama: **`www.amalshalih.or.id`** (TLD `.or.id`)
- Sanity hybrid: Sanity as source of truth, local data as fallback
- Zero JS client-side — all static rendering where possible
