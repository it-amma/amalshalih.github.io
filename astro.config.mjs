// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import sentry from '@sentry/astro';
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// Load .env for build-time only (Sentry auth, etc.)
const env = loadEnv('production', process.cwd(), '');
Object.assign(process.env, env);

export default defineConfig({
	site: 'https://amalshalih.id',
	output: 'server',
	adapter: cloudflare(),
	integrations: [
		process.env.NODE_ENV !== 'development' && sentry({
			authToken: process.env.SENTRY_AUTH_TOKEN,
			org: 'yayasan-amal-shalih-insan-bant',
			project: 'amalshalih',
			telemetry: false,
		}),
		mdx(),
		sitemap(),
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
});
