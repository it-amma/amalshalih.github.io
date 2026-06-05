import { env } from 'cloudflare:workers'
import type { DriveImage } from '../lib/google-drive'
import {
	getAccessToken,
	getFullImageUrl,
	getThumbnailUrl,
	listItemsWithShortcuts,
} from '../lib/google-drive'

export interface HeroPhoto {
	id: string
	name: string
	width?: number
	height?: number
	thumbnailUrl: string
	fullUrl: string
}

const HERO_FOLDER_ID = '1JIfmdgR-ye4v9DMony1tktEUxzpWTVFe'

export async function fetchHeroPhotos(): Promise<HeroPhoto[]> {
	const creds = env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY
	if (!creds) {
		console.log('⏭️ GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY not set — returning empty hero photos')
		return []
	}

	try {
		console.log('🔍 Fetching hero photos from Google Drive...')
		const images = await listItemsWithShortcuts(HERO_FOLDER_ID)

		console.log(`🖼️ Found ${images.length} hero photos`)
		return images.map((img: DriveImage) => ({
			id: img.id,
			name: img.name,
			width: img.width,
			height: img.height,
			thumbnailUrl: getThumbnailUrl(img.id, 800),
			fullUrl: getFullImageUrl(img.id, 1920),
		}))
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error)
		console.error('❌ Failed to fetch hero photos:', message)
		return []
	}
}
