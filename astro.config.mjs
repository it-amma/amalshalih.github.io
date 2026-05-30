// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// Load .env file for Node.js process (npx astro build doesn't auto-load like Bun)
const env = loadEnv('production', process.cwd(), '');
Object.assign(process.env, env);

// https://astro.build/config
export default defineConfig({
	site: 'https://amalshalih.id',
	output: 'server',
	adapter: cloudflare({
		prerenderEnvironment: 'node',
		configPath: 'wrangler.build.jsonc',
	}),
	integrations: [
		mdx(),
		sitemap(),
		spotlightjs(),
		sentry({
			authToken: process.env.SENTRY_AUTH_TOKEN,
			org: 'yayasan-amal-shalih-insan-bant',
			project: 'amalshalih',
			telemetry: false,
			enabled: {
				server: false,
				client: true,
			},
		}),
		sanity({
			projectId: '9yj0dq9v',
			dataset: 'production',
			useCdn: false,
		}),
	],
	vite: {
		build: {
			sourcemap: true,
		},
		plugins: [tailwindcss()],
		ssr: {
			// Externalize Node.js builtins for Cloudflare Workers compatibility
			// @sentry/node-core imports many Node builtins that trigger Vite warnings
			external: [
				'node:fs', 'node:http', 'node:https', 'node:path', 'node:os',
				'node:stream', 'node:util', 'node:events', 'node:net',
				'node:readline', 'node:zlib', 'node:tls', 'node:inspector',
				'node:worker_threads', 'node:child_process', 'node:diagnostics_channel',
				'node:module',
				'fs', 'http', 'https', 'path', 'os', 'stream', 'util',
				'events', 'net', 'readline', 'zlib', 'tls', 'inspector',
				'worker_threads', 'child_process', 'diagnostics_channel',
				'module', 'url', 'tty', 'crypto', 'process',
			],
		},
	},
});
