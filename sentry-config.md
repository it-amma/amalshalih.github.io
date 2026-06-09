# Sentry Configuration — Why Separate Files?

## File Structure

```
sentry.client.config.js    # Client-side (browser) Sentry initialization
sentry.server.config.js    # Server-side (SSR/API) Sentry initialization
```

## Why Separate?

Sentry requires **different configurations** for client-side and server-side error tracking:

### **Client-Side (`sentry.client.config.js`)**
- Runs in the **browser**
- Captures frontend errors (React/Astro component errors, user interactions)
- Uses browser-specific APIs
- Smaller bundle size (no Node.js modules)
- Configured for browser environment

### **Server-Side (`sentry.server.config.js`)**
- Runs on **Cloudflare Workers** (server-side)
- Captures SSR errors, API route errors, server-side exceptions
- Uses Node.js-compatible modules
- Can access server environment variables
- Configured for workerd runtime

## Configuration Differences

| Aspect | Client Config | Server Config |
|--------|---------------|---------------|
| **Runtime** | Browser | Cloudflare Workers (workerd) |
| **Error Sources** | UI errors, network failures | SSR errors, API errors |
| **Environment** | Public (exposed to users) | Private (server-side only) |
| **DSN** | Same DSN, different scope | Same DSN, different scope |
| **Integrations** | Browser-specific | Node.js/Worker-specific |

## Best Practices

### ✅ DO:
- Keep configs separate for clarity
- Use different `environment` tags (e.g., `production-client`, `production-server`)
- Configure appropriate integrations for each environment
- Set different sampling rates if needed

### ❌ DON'T:
- Merge into single file (will cause runtime errors)
- Use Node.js modules in client config
- Expose server-side secrets in client config
- Share the same instance (create separate instances)

## Astro Integration

In `astro.config.mjs`, Sentry is configured as:

```js
import { sentry } from '@astrojs/sentry';

export default defineConfig({
  integrations: [
    sentry({
      project: 'amalshalih',
      org: 'yayasan-amal-shalih-insan-bant',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
});
```

Astro automatically uses:
- `sentry.client.config.js` for client-side bundles
- `sentry.server.config.js` for server-side rendering

## References

- [Sentry Astro Integration](https://docs.sentry.io/platforms/javascript/guides/astro/)
- [Sentry Configuration](https://docs.sentry.io/platforms/javascript/configuration/)
- [Sentry DSN](https://docs.sentry.io/product/sentry-basics/dsn-explainer/)

---

**Last Updated:** 9 Juni 2026  
**Location:** `sentry-config-readme.md` (root)
