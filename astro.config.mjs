// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://amalshalih.id',
	integrations: [
		mdx(),
		sitemap(),
		// Order matters: sentry() before spotlightjs()
		sentry({
			project: 'amalshalih',
			org: 'yayasan-amal-shalih-insan-bant',
			authToken: process.env.SENTRY_AUTH_TOKEN,
			telemetry: false,
		}),
		spotlightjs(),
		sanity({
			projectId: '9yj0dq9v',
			dataset: 'production',
			useCdn: false,
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
