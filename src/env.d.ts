/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface Env {
	LIKES: KVNamespace
	SESSION: KVNamespace
	GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY: string
	FIREBASE_SERVICE_ACCOUNT_KEY: string
	FIREBASE_RTDB_URL: string
	SENTRY_AUTH_TOKEN: string
	SANITY_API_READ_TOKEN: string
	RESEND_API_KEY: string
	ASSETS: Fetcher
	IMAGES: ImagesBinding
}

declare module 'cloudflare:workers' {
	export const env: Env
}

// Gallery like data globals (shared between MasonryGrid and cover update)
declare global {
	interface Window {
		__galleryLikeData?: Record<string, number>
		__galleryLikeDataReady?: boolean
	}
}
