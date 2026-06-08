#!/usr/bin/env bun
/**
 * Seed pengurus data to Sanity CMS
 * Run: bun run scripts/seed-pengurus.ts
 * Requires: SANITY_API_WRITE_TOKEN in .env or .dev.vars
 */

const SANITY_PROJECT_ID = '9yj0dq9v'
const SANITY_DATASET = 'production'

const pengurusData = [
	{
		name: 'Haryadi',
		position: 'Ketua Pembina',
		description: 'Merumuskan arah kebijakan strategis yayasan.',
		order: 1,
	},
	{
		name: 'Fury Artanto',
		position: 'Ketua Pengawas & Kepala PKBM',
		description: 'Mengawasi pelaksanaan operasional dan memimpin unit pendidikan kesetaraan.',
		order: 2,
	},
	{
		name: 'Fat-han Kurnia Mubina',
		position: 'Ketua Umum Pengurus',
		description: 'Mengoordinasikan seluruh program kerja harian dan operasional yayasan.',
		order: 3,
	},
	{
		name: 'Muhammad Ilham Syaifudin',
		position: 'Bendahara Umum',
		description: 'Mengelola administrasi keuangan dan pelaporan amanah donatur.',
		order: 4,
	},
]

export {} // Make this a module so we can use top-level await

console.log('🌱 Seeding pengurus data to Sanity CMS...\n')

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
	console.error('❌ Missing SANITY_API_WRITE_TOKEN')
	console.log('Set it in .dev.vars or run: export SANITY_API_WRITE_TOKEN=your_token')
	process.exit(1)
}

for (const data of pengurusData) {
	console.log(`Creating: ${data.name} - ${data.position}`)

	const document = {
		_type: 'pengurus',
		...data,
	}

	try {
		const response = await fetch(
			`https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}?returnIds=true`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					mutations: [{ create: document }],
				}),
			},
		)

		const result = await response.json()

		if (response.ok && result.mutationResults) {
			const id = result.mutationResults[0].id
			console.log(`✓ Created: ${id}\n`)
		} else {
			console.error('✗ Failed:', result)
		}
	} catch (error: any) {
		console.error('✗ Error:', error.message)
	}
}

console.log('\n✅ Seeding complete!')
console.log('Check Sanity Studio: https://9yj0dq9v.sanity.studio')
