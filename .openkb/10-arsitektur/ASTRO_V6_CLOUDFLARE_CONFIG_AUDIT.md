# Astro v6 + Cloudflare Workers Configuration Audit

## 🔴 Issues Found

### 1. `wrangler preview` Error 10015 - NOT a Config Issue!

**Error:** `You do not have access to use Worker Previews [code: 10015]`

**Root Cause:**
- `wrangler preview` is a **NEW feature in private beta** (introduced March 2026)
- Requires special Cloudflare account permissions (Worker Previews entitlement)
- Your account doesn't have beta access

**Solution:** Use `wrangler dev` instead (the standard local development workflow)

```bash
# ❌ DON'T USE (requires beta access)
wrangler preview

# ✅ USE THIS INSTEAD
wrangler dev
```

Reference: [Cloudflare PR #12983](https://github.com/cloudflare/workers-sdk/pull/12983)

---

### 2. Missing `main` Entry Point in wrangler.jsonc

**Astro v6 REQUIRES** the new unified entrypoint:

```jsonc
{
  "main": "@astrojs/cloudflare/entrypoints/server"
}
```

**Previous config was MISSING the `main` field entirely!**

This caused:
- No proper Worker runtime initialization
- `wrangler dev` not working correctly
- Assets not properly served

---

### 3. Missing `assets` Binding

**Astro v6 + SSR requires** assets binding:

```jsonc
{
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist"
  }
}
```

---

## ✅ Fixes Applied

### Fix 1: Updated `wrangler.jsonc`

```jsonc
{
  "name": "www",
  "main": "@astrojs/cloudflare/entrypoints/server",
  "compatibility_date": "2026-05-30",
  "compatibility_flags": ["nodejs_compat"],
  "vars": {
    "NODE_ENV": "production"
  },
  "kv_namespaces": [
    { "binding": "SESSION", "id": "1fcf5a834af8489790a5e55793205d2a" },
    { "binding": "LIKES", "id": "0525d17bcb8b43098ec8415b976e2dca" }
  ],
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist"
  },
  "observability": {
    "enabled": true
  }
}
```

### Fix 2: Updated `scripts/generate-wrangler-config.mjs`

- Changed `main` to `@astrojs/cloudflare/entrypoints/server`
- Added `LIKES` KV namespace (was missing!)
- Updated assets directory to `./dist`
- Added observability config

### Fix 3: Updated `package.json`

Added proper wrangler scripts:
```json
{
  "wrangler:dev": "cd dist/server && wrangler dev",
  "wrangler:deploy": "wrangler deploy"
}
```

---

## 🚀 Correct Development Workflow

### Local Development (with hot reload)

```bash
# Option 1: Astro dev (Node.js runtime, no Wrangler bindings)
bun run dev

# Option 2: Wrangler dev (Full Worker simulation with KV, etc.)
bun run wrangler:dev
```

### Build & Deploy

```bash
# Build
bun run build

# Deploy to production
bun run wrangler:deploy
# or
wrangler deploy
```

---

## 📚 Key Differences: Astro v5 vs v6

| Feature | Astro v5 | Astro v6 |
|---------|----------|----------|
| **Entry Point** | `dist/_worker.js/index.js` | `@astrojs/cloudflare/entrypoints/server` |
| **Wrangler Config** | Required | Optional (if no bindings) |
| **Development** | `astro dev` only | `astro dev` OR `wrangler dev` |
| **Preview** | `astro preview` | `wrangler dev` (preview is beta) |
| **Hybrid Mode** | `output: 'hybrid'` | **REMOVED** - use `static` or `server` |

---

## 🔍 References

- [Astro Cloudflare Adapter Docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Astro v6 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v6/)
- [Cloudflare Workers Astro Guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)
- [Astro v6 Changelog](https://github.com/withastro/astro/releases/tag/@astrojs/cloudflare@13.0.0)
- [orbital-orbit project](../orbital-orbit/) - Reference implementation

---

## ⚠️ Important Notes

1. **`wrangler preview` ≠ `wrangler dev`**
   - `preview` creates temporary preview deployments (beta feature)
   - `dev` runs local Worker simulation (general availability)

2. **Astro v6 Breaking Changes**
   - Hybrid mode removed
   - New entrypoint convention
   - Wrangler config now optional for simple projects

3. **Error 10015**
   - This is an **account entitlement issue**, not code
   - Contact Cloudflare support if you need preview access
   - Or wait for GA (general availability)

---

**Status:** Configuration issues FIXED ✅  
**Next Step:** Test with `wrangler dev` (NOT preview)
