// @ts-check

import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import sanity from '@sanity/astro'
import sentry from '@sentry/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

// Load .env for build-time only (Sentry auth, etc.)
const env = loadEnv('production', process.cwd(), '')
Object.assign(process.env, env)

export default defineConfig({
	site: 'https://amalshalih.or.id',
	output: 'server',
	adapter: cloudflare(),
	integrations: [
		process.env.NODE_ENV !== 'development' &&
			sentry({
				authToken: process.env.SENTRY_AUTH_TOKEN,
				org: 'yayasan-amal-shalih-insan-bant',
				project: 'amalshalih',
				telemetry: false,
			}),
		mdx(),
		sitemap({
			serialize(item) {
				if (/404/.test(item.url)) {
					return undefined
				}
				if (item.url === 'https://amalshalih.or.id/') {
					// @ts-expect-error
					item.changefreq = 'daily'
					item.priority = 1.0
				} else if (/kegiatan/.test(item.url) || /blog/.test(item.url)) {
					// @ts-expect-error
					item.changefreq = 'weekly'
					item.priority = 0.8
				} else {
					// @ts-expect-error
					item.changefreq = 'monthly'
					item.priority = 0.5
				}
				return item
			},
		}),
		sanity({
			projectId: '9yj0dq9v',
			dataset: 'production',
			useCdn: false,
		}),
	].filter(Boolean),
	vite: {
		build: {
			sourcemap: true,
		},
		// @ts-expect-error — Vite version mismatch between Astro bundled & project dep
		plugins: [tailwindcss()],
	},
})
