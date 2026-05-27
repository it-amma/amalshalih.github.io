import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const kegiatan = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/kegiatan' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		image: z.string().optional(),
		kategori: z.enum(['pendidikan', 'keagamaan', 'sosial', 'umum']),
	}),
});

export const collections = { kegiatan };
