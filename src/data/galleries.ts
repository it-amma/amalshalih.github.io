import { env } from 'cloudflare:workers'
import {
	type DriveFolder,
	type DriveImage,
	getFullImageUrl,
	getThumbnailUrl,
	listImagesInFolder,
	listSubfolders,
	parseFolderName,
} from '../lib/google-drive'
import { cachedFetch, driveCacheKey } from '../lib/kv-cache'

function getGoogleDriveCredentials(): string | undefined {
	return env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY
}

export interface GalleryImage {
	id: string
	name: string
	thumbnailUrl: string
	fullUrl: string
	width?: number
	height?: number
	createdTime?: string
}

export interface GalleryEntry {
	slug: string
	title: string
	description: string
	folderId: string
	category: 'pendidikan' | 'keagamaan' | 'sosial' | 'umum'
	eventDate: string
	coverPhotoId?: string
	published: boolean
	totalImages: number
	images: GalleryImage[]
}

const PARENT_FOLDER_ID = '1g2ISaHQI3lRU1fh8N5U2coFVYt4sktDm'

// Transform DriveImage to GalleryImage
function transformDriveImage(img: DriveImage): GalleryImage {
	return {
		id: img.id,
		name: img.name,
		thumbnailUrl: getThumbnailUrl(img.id, 400),
		fullUrl: getFullImageUrl(img.id, 1600),
		width: img.width,
		height: img.height,
		createdTime: img.createdTime,
	}
}

// Transform DriveFolder to GalleryEntry
async function transformDriveFolder(folder: DriveFolder): Promise<GalleryEntry | null> {
	const metadata = parseFolderName(folder.name)

	if (!metadata) {
		console.warn(`⚠️ Skipping folder "${folder.name}" — unable to parse name`)
		return null
	}

	const validCategories = ['pendidikan', 'keagamaan', 'sosial', 'umum'] as const
	const category = validCategories.find((c) => c === metadata.category.toLowerCase()) || 'umum'

	try {
		const driveImages = await listImagesInFolder(folder.id)
		const images = driveImages.map(transformDriveImage)

		return {
			slug: metadata.slug,
			title: metadata.title,
			description: `Dokumentasi kegiatan ${metadata.title} yang diadakan oleh Yayasan Amal Shalih Insan Bantul.`,
			folderId: folder.id,
			category: category,
			eventDate: metadata.date,
			coverPhotoId: images.length > 0 ? images[0].id : undefined,
			published: true,
			totalImages: images.length,
			images,
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error)
		console.error(`❌ Failed to fetch images for "${folder.name}":`, message)
		return null
	}
}

// Fetch all galleries from Google Drive with KV caching
export async function fetchAllGalleries(): Promise<GalleryEntry[]> {
	// Return empty array if Google Drive credentials not configured
	if (!getGoogleDriveCredentials()) {
		console.log('⏭️ GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY not set — returning empty galleries')
		return []
	}

	try {
		console.log('🔍 Fetching galleries from Google Drive...')

		return cachedFetch({
			key: driveCacheKey('galleries'),
			fetcher: async () => {
				const subfolders = await listSubfolders(PARENT_FOLDER_ID)

				if (subfolders.length === 0) {
					console.log('⚠️ No subfolders found in parent folder')
					return []
				}

				console.log(`📁 Found ${subfolders.length} subfolders`)

				// Fetch all galleries in parallel
				const galleries = await Promise.all(subfolders.map(transformDriveFolder))

				// Filter out null entries (failed to parse/transform)
				const validGalleries = galleries.filter((g): g is GalleryEntry => g !== null)

				console.log(`✅ Successfully fetched ${validGalleries.length} galleries`)
				return validGalleries
			},
		})
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error)
		console.error('❌ Failed to fetch galleries:', message)
		return []
	}
}

// Fetch single gallery by slug (REAL-TIME)
export async function fetchGalleryBySlug(slug: string): Promise<GalleryEntry | null> {
	if (!getGoogleDriveCredentials()) {
		return null
	}

	try {
		const subfolders = await listSubfolders(PARENT_FOLDER_ID)

		// Find folder that matches the slug
		for (const folder of subfolders) {
			const metadata = parseFolderName(folder.name)
			if (metadata && metadata.slug === slug) {
				return await transformDriveFolder(folder)
			}
		}

		return null
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error)
		console.error(`❌ Failed to fetch gallery "${slug}":`, message)
		return null
	}
}

// Get published galleries (filter only)
export function filterPublishedGalleries(galleries: GalleryEntry[]): GalleryEntry[] {
	return galleries.filter((g) => g.published)
}

// Get galleries by category (filter only)
export function filterGalleriesByCategory(
	galleries: GalleryEntry[],
	category: GalleryEntry['category'],
): GalleryEntry[] {
	return galleries.filter((g) => g.category === category && g.published)
}

// For backward compatibility during migration
// These will be removed after full migration to SSR
let cachedGalleries: GalleryEntry[] | null = null

export function setCachedGalleries(galleries: GalleryEntry[]) {
	cachedGalleries = galleries
}

export function getGalleryBySlug(slug: string): GalleryEntry | undefined {
	if (cachedGalleries) {
		return cachedGalleries.find((g) => g.slug === slug)
	}
	return undefined
}

export function getPublishedGalleries(): GalleryEntry[] {
	if (cachedGalleries) {
		return cachedGalleries.filter((g) => g.published)
	}
	return []
}

export function getGalleriesByCategory(category: GalleryEntry['category']): GalleryEntry[] {
	if (cachedGalleries) {
		return cachedGalleries.filter((g) => g.category === category && g.published)
	}
	return []
}
