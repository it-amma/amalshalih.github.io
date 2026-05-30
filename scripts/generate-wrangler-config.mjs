/**
 * Post-build: Generate dist/wrangler.json for wrangler deploy --config
 *
 * @astrojs/cloudflare v13 generates Workers-compatible output in dist/server/.
 * The adapter does NOT auto-generate wrangler.json — we need this for deploy.
 *
 * Run after `bun run build`:
 *   bun run scripts/generate-wrangler-config.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

// Check that the build output exists
const serverEntry = resolve(distDir, 'server', 'entry.mjs');
if (!existsSync(serverEntry)) {
	console.error('ERROR: Build output not found at', serverEntry);
	console.error('Run `bun run build` first.');
	process.exit(1);
}

// Read package.json for the project name
const pkg = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf-8'));
const name = 'amalshalih';

const config = {
	name,
	main: './server/entry.mjs',
	compatibility_date: new Date().toISOString().slice(0, 10),
	compatibility_flags: ['nodejs_compat'],
	assets: {
		binding: 'ASSETS',
		directory: 'client',
	},
};

const outPath = resolve(distDir, 'wrangler.json');
writeFileSync(outPath, JSON.stringify(config, null, '\t') + '\n');
console.log(`✓ Generated ${outPath}`);
