# Wrangler Configuration Guide

## File Structure

```
.dev.vars              # Local development environment variables (Wrangler convention)
wrangler.jsonc         # Production configuration
wrangler.staging.jsonc # Staging configuration (optional)
wrangler.build.jsonc   # Build-time configuration (from @astrojs/cloudflare adapter)
```

---

## Configuration Files Explained

### 1. `wrangler.jsonc` — Production

**Purpose:** Deploy to production (`amalshalih.or.id`)

**Key Settings:**
```jsonc
{
  "name": "www",
  "vars": { "NODE_ENV": "production" },
  "kv_namespaces": [
    { "binding": "SESSION", "id": "1fcf5a834af8489790a5e55793205d2a" },
    { "binding": "LIKES", "id": "0525d17bcb8b43098ec8415b976e2dca" }
  ]
}
```

**Deploy Command:**
```bash
wrangler deploy
```

---

### 2. `wrangler.staging.jsonc` — Staging (Optional)

**Purpose:** Deploy to staging environment for testing before production

**Key Settings:**
```jsonc
{
  "name": "www-staging",
  "vars": { "NODE_ENV": "staging" },
  "kv_namespaces": [
    // Same or different KV namespaces
  ]
}
```

**Deploy Command:**
```bash
wrangler deploy --config wrangler.staging.jsonc
```

**When to Keep:**
- ✅ You have a separate staging deployment
- ✅ You test changes before production
- ✅ You have different KV namespaces for staging

**When to Remove:**
- ❌ You only deploy to production
- ❌ Staging config is identical to production
- ❌ You use preview deployments instead

---

### 3. `wrangler.build.jsonc` — Build-Time (Auto-Generated)

**Purpose:** Build-time configuration for `@astrojs/cloudflare` adapter

**Important:** 
- ❌ **DO NOT USE FOR DEPLOYMENT**
- ✅ Used internally by Astro during `astro build`
- ✅ Referenced by adapter in `astro.config.mjs`

**Content:**
```jsonc
{
  "compatibility_date": "2026-05-28",
  "compatibility_flags": ["nodejs_compat"]
}
```

**Note:** This file is minimal and only contains build-specific settings. Deployment uses `wrangler.jsonc`.

---

### 4. `.dev.vars` — Local Development

**Purpose:** Environment variables for local development with Wrangler

**Convention:** This is **standard Wrangler convention** - keep in root!

**Contents:**
```
# Local development variables
# These are loaded when running `wrangler dev`
MY_LOCAL_VAR=value
```

**Important:**
- ✅ Keep in root directory (Wrangler convention)
- ✅ Already gitignored (check `.gitignore`)
- ✅ Not committed to version control

---

## Deployment Workflow

### Production Deployment
```bash
# 1. Build the project
bun run build

# 2. Deploy to production
wrangler deploy --config wrangler.jsonc
```

### Staging Deployment (if needed)
```bash
# 1. Build the project
bun run build

# 2. Deploy to staging
wrangler deploy --config wrangler.staging.jsonc
```

### Local Development
```bash
# Run development server with Wrangler
wrangler dev
```

---

## Best Practices

### ✅ DO:
- Keep `wrangler.build.jsonc` (required by Astro adapter)
- Use separate configs for production/staging if you have both environments
- Keep `.dev.vars` in root (Wrangler convention)
- Document which config is for what purpose

### ❌ DON'T:
- Use `wrangler.build.jsonc` for deployment
- Move `.dev.vars` to another directory (breaks Wrangler convention)
- Create too many config files (confusing)
- Hardcode secrets in config files (use environment variables)

---

## Alternative: Single Config with Environments

Instead of multiple config files, you can use Wrangler environments:

```jsonc
// wrangler.jsonc
{
  "name": "www",
  "vars": { "NODE_ENV": "production" },
  
  "env": {
    "staging": {
      "name": "www-staging",
      "vars": { "NODE_ENV": "staging" }
    }
  }
}
```

**Deploy:**
```bash
# Production
wrangler deploy

# Staging
wrangler deploy --env staging
```

**Benefits:**
- Single source of truth
- Less file duplication
- Clearer structure

**Consider migrating to this approach if:**
- Staging and production configs are similar
- You want simpler configuration management

---

## Troubleshooting

### "Which config file should I use?"
- **Production deploy:** `wrangler.jsonc`
- **Staging deploy:** `wrangler.staging.jsonc` (or `--env staging`)
- **Build process:** `wrangler.build.jsonc` (automatic)
- **Local dev:** `.dev.vars` (automatic with `wrangler dev`)

### "Can I delete wrangler.staging.jsonc?"
Yes, if:
- You don't have a staging environment
- You use preview deployments instead
- You migrate to `--env staging` approach

### "Why can't I merge wrangler.build.jsonc?"
Because `@astrojs/cloudflare` adapter expects this file at build time. It's referenced in `astro.config.mjs` via `configPath`.

---

**Last Updated:** 9 Juni 2026  
**Location:** `docs/wrangler-configs.md`  
**Related:** `.dev.vars`, `astro.config.mjs`, `wrangler.jsonc`