/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

// Gallery like data globals (shared between MasonryGrid and cover update)
declare global {
  interface Window {
    __galleryLikeData?: Record<string, number>;
    __galleryLikeDataReady?: boolean;
  }
}
