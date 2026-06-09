# Architecture Decisions

Dokumen ini mencatat keputusan arsitektur penting dalam project Yayasan Amal Shalih Insan Bantul.

## Deployment Platform: Cloudflare Workers

**Keputusan:** Menggunakan Cloudflare Workers dengan Astro SSR, bukan Cloudflare Pages.

**Alasan:**
- `@astrojs/cloudflare` v13+ menghasilkan output Workers (`entry.mjs` dengan `export default { fetch }`)
- Workers mendukung `nodejs_compat` untuk library seperti `@sentry/cloudflare`
- Static assets ditangani via **Workers Assets** binding
- SSR memungkinkan fitur dinamis seperti API routes dan KV storage

**Konfigurasi:**
```jsonc
// wrangler.jsonc
{
  "name": "amalshalih",
  "main": "@astrojs/cloudflare/entrypoints/server",
  "compatibility_date": "2025-05-29",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist/client",
    "binding": "ASSETS"
  }
}
```

## Runtime Compatibility: Web Crypto API

**Keputusan:** Menggunakan Web Crypto API (`crypto.subtle`) alih-alih Node.js `node:crypto`.

**Alasan:**
- Cloudflare Workers menggunakan workerd runtime, bukan Node.js
- `node:crypto` tidak tersedia di workerd tanpa polyfill
- Web Crypto API adalah standard web yang didukung oleh workerd
- JWT signing untuk Firebase Admin SDK membutuhkan cryptographic operations

**Implementasi:**
```typescript
// Menggunakan crypto.subtle untuk JWT signing
const signature = await crypto.subtle.sign(
  { name: 'RSASSA-PKCS1-v1_5' },
  privateKey,
  data
);
```

**File terdampak:** `src/lib/firebase/admin.ts`

## Storage: Cloudflare KV untuk Likes

**Keputusan:** Menggunakan Cloudflare KV untuk menyimpan data likes, bukan in-memory storage.

**Alasan:**
- In-memory storage hilang saat Worker di-recycle (ephemeral)
- KV menyediakan durability dan konsistensi data
- KV didesain untuk read-heavy workloads (perfect untuk like counts)
- Global replication KV memastikan data tersedia di semua edge locations

**Konfigurasi:**
```jsonc
{
  "kv_namespaces": [
    { "binding": "LIKES", "id": "0525d17bcb8b43098ec8415b976e2dca" }
  ]
}
```

**Access pattern:**
```typescript
import { env } from 'cloudflare:workers';
const likes = env.LIKES;
await likes.put(key, value.toString());
```

## Rendering Strategy: SSR untuk Detail Pages

**Keputusan:** Menggunakan SSR (`prerender = false`) untuk halaman detail kegiatan dan blog.

**Alasan:**
- Detail pages membutuhkan parameter dinamis (slug)
- Static generation dengan prerender menyebabkan 404 di production
- SSR memungkinkan fetch data dari Sanity/CMS secara real-time
- Cloudflare Workers edge rendering meminimalkan latency

**Implementasi:**
```typescript
// src/pages/kegiatan/[slug].astro
export const prerender = false;
```

**Halaman SSR:**
- `/kegiatan/[slug].astro`
- `/blog/[slug].astro`

## Content Sources: Hybrid Approach

**Keputusan:** Menggunakan kombinasi multiple content sources.

| Source | Use Case | Status |
|--------|----------|--------|
| **Local Markdown** | Kegiatan, Blog (fallback) | ✅ Active |
| **Sanity CMS** | Programs, Site Settings, Bank Info | ✅ Active (3 kegiatan, 15 programs) |
| **Google Drive** | Gallery photos | ✅ Active (2 galleries, 17 photos) |
| **KV Storage** | Photo likes | ✅ Active |

**Fallback Strategy:**
```typescript
try {
  const data = await fetchFromSanity();
  return data;
} catch (error) {
  console.error('[Sanity] Fetch failed:', error);
  return fallbackData; // Local markdown or hardcoded
}
```

## Configuration Strategy: Root-Level Wrangler

**Keputusan:** Menggunakan root-level `wrangler.jsonc` sebagai single source of truth.

**Alasan:**
- Clean separation: `wrangler.jsonc` (runtime) vs `astro.config.mjs` (build)
- Tidak perlu file generator (`scripts/generate-wrangler-config.mjs`) - deleted
- Preview (`bun run preview`) menggunakan Wrangler secara langsung
- Deploy menggunakan file yang sama (`wrangler deploy`)

**Workflow:**
```
1. bun run build        → Astro build ke dist/
2. wrangler deploy      → Deploy @astrojs/cloudflare/entrypoints/server
```

## Error Handling Strategy: Explicit Logging

**Keputusan:** Selalu log errors dengan konteks, jangan silent catch.

**Pattern:**
```typescript
// ❌ Bad: Silent catch
try {
  await fetchData();
} catch {}

// ✅ Good: Explicit logging
try {
  await fetchData();
} catch (error) {
  console.error('[Page/Kegiatan] Failed to fetch:', error);
}
```

**Keuntungan:**
- Debugging lebih mudah di production (Cloudflare Logs)
- Sentry integration dapat capture error context
- Fallback behavior tetap bekerja tanpa mengorbankan observability

## Type Safety: Explicit Env Types

**Keputusan:** Mendefinisikan interface `Env` di `src/env.d.ts` alih-alih menggunakan `(env as any)`.

**Alasan:**
- TypeScript intellisense untuk bindings dan secrets
- Compile-time validation untuk environment variables
- Dokumentasi implisit untuk infrastructure requirements

**Definisi:**
```typescript
interface Env {
  LIKES: KVNamespace;
  SESSION: KVNamespace;
  GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY: string;
  SENTRY_DSN: string;
}
```

## Monitoring: Health Check Endpoint

**Keputusan:** Implementasi `/api/health` untuk monitoring system status.

**Checks:**
- KV connectivity (list keys)
- Google Drive (validate service account key format)
- Sanity API (query siteSettings)

**Response format:**
```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2026-06-01T...",
  "version": "abc1234",
  "checks": {
    "kv": { "status": "ok", "latency": 15 },
    "googleDrive": { "status": "ok", "latency": 2 },
    "sanity": { "status": "ok", "latency": 45 }
  }
}
```

## Testing Strategy: Integration-First

**Keputusan:** Fokus pada integration tests alih-alih unit tests.

**Alasan:**
- Astro SSR + Cloudflare Workers memerlukan runtime yang kompleks
- Integration tests lebih merepresentasikan production behavior
- Vitest dengan `@cloudflare/vitest-pool-workers` menyediakan realistic environment

**Coverage:**
- API endpoints (health, galleries, like)
- Page routes (HTTP 200 check)
- Static assets serving
- Security headers

**Run:** `bun run test`

## Environment Variables Access

**Keputusan:** Menggunakan `cloudflare:workers` module alih-alih `process.env`.

**Alasan:**
- Astro v6 dengan Cloudflare adapter merekomendasikan `import { env } from 'cloudflare:workers'`
- `process.env` tidak tersedia di workerd runtime
- Secrets dan bindings diakses secara type-safe

**Pattern:**
```typescript
import { env } from 'cloudflare:workers';
const likes = env.LIKES;
const serviceAccountKey = env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY;
```

## Version

Dokumen ini mencerminkan arsitektur sebagai Juni 2026.
Last updated: Phase 4.2 complete (all todos finished).