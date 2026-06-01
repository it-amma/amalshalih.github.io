/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

// Cloudflare Workers types for bindings
interface Env {
  LIKES: KVNamespace;
  SESSION: KVNamespace;
}

declare module "cloudflare:workers" {
  export const env: Env;
}

// Gallery like data globals (shared between MasonryGrid and cover update)
declare global {
  interface Window {
    __galleryLikeData?: Record<string, number>;
    __galleryLikeDataReady?: boolean;
  }
}
