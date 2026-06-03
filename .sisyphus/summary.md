# Yayasan Amal Shalih Insan Bantul — Sisyphus Anchored Summary

## Goal
Astro site (amalshalih.or.id) — build, deploy, maintain via Cloudflare Workers.

## Constraints & Preferences
- Build must produce valid Cloudflare Worker output (no `@@ASTRO_MANIFEST_REPLACE@@` left in chunks)
- Use `wrangler deploy` (not Pages)
- Domain utama: **`www.amalshalih.or.id`** (TLD `.or.id`)
- `amalshalih.id` expired (2023/2024) — no longer relevant

## Status
✅ **Deployed & live** at `https://www.amalshalih.or.id`

## Work Completed
- Fixed `faq.astro` type error (IconName import, FaqGroup typing)
- Rebuilt all pages (kebijakan-privasi, syarat-ketentuan, faq, footer)
- Diagnosed manifest injection failure: Rollup 4.60.x doesn't include `\0virtual:astro:manifest` in `chunk.moduleIds`
- Patched `node_modules/astro/dist/core/build/static-build.js` (extractRelevantChunks) and `plugin-manifest.js` (manifestBuildPostHook) to also check `code.includes(MANIFEST_REPLACE)` as fallback
- Rewrote plugin-manifest.js after corruption during reinstall
- **Build → Deploy → Live**: all successful

## Key Technical Details
- `astro@6.4.2` / `@astrojs/cloudflare@13.6.0` / `rollup@4.60.4` / `vite@6.4.3`
- Root cause: `extractRelevantChunks()` and `manifestBuildPostHook()` use `chunk.moduleIds.includes(SERIALIZED_MANIFEST_RESOLVED_ID)` but Rollup 4.60.x emits the virtual module chunk separately, so the worker-entry chunk's `moduleIds` doesn't contain the resolved virtual ID
- Fix: added `|| c.code.includes(MANIFEST_REPLACE)` fallback in both functions
- **Patch location**: `node_modules/` — will be overwritten on `bun install`. Need postinstall script or Astro/Cloudflare adapter upgrade for permanent fix.

## Relevant Files
- `src/pages/faq.astro`
- `astro.config.mjs`
- `wrangler.jsonc`
- `dist/server/wrangler.json` (auto-generated, used for deploy)
- `node_modules/astro/dist/core/build/plugins/plugin-manifest.js`
- `node_modules/astro/dist/core/build/static-build.js`
- `.github/workflows/deploy.yml`

## Domains
| Domain | Status |
|---|---|
| `www.amalshalih.or.id` | ✅ Live, production |
| `www.asib.workers.dev` | ✅ Worker default |
| `amalshalih.id` | ❌ Expired (2023/2024), not renewed |
