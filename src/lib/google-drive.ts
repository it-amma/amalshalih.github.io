import { env } from 'cloudflare:workers'

export interface DriveImage {
	id: string
	name: string
	mimeType: string
	thumbnailUrl?: string
	webContentLink?: string
	createdTime?: string
	width?: number
	height?: number
}

export interface DriveFolder {
	id: string
	name: string
	createdTime?: string
	modifiedTime?: string
}

interface GoogleDriveFile {
	id: string
	name: string
	mimeType: string
	webContentLink?: string
	createdTime?: string
	modifiedTime?: string
	imageMediaMetadata?: {
		width?: number
		height?: number
	}
}

interface GoogleDriveResponse {
	files?: GoogleDriveFile[]
}

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3'

function getCredentials(): string {
	const creds = env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY
	if (!creds) {
		throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY env var is not set')
	}
	return creds
}

export async function getAccessToken(): Promise<string> {
	const credentials = getCredentials()
	const creds = JSON.parse(credentials)
	const now = Math.floor(Date.now() / 1000)
	const expiry = now + 3600

	const header = { alg: 'RS256', typ: 'JWT' }
	const claim = {
		iss: creds.client_email,
		scope: SCOPES.join(' '),
		aud: 'https://oauth2.googleapis.com/token',
		exp: expiry,
		iat: now,
	}

	const encodeBase64 = (obj: object) =>
		btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

	const encodedHeader = encodeBase64(header)
	const encodedClaim = encodeBase64(claim)
	const signatureInput = `${encodedHeader}.${encodedClaim}`

	const keyData = creds.private_key
		.replace('-----BEGIN PRIVATE KEY-----', '')
		.replace('-----END PRIVATE KEY-----', '')
		.replace(/\n/g, '')

	const keyBuffer = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0))

	const cryptoKey = await crypto.subtle.importKey(
		'pkcs8',
		keyBuffer,
		{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
		false,
		['sign'],
	)

	const signatureBuffer = await crypto.subtle.sign(
		'RSASSA-PKCS1-v1_5',
		cryptoKey,
		new TextEncoder().encode(signatureInput),
	)

	const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '')

	const jwt = `${signatureInput}.${signature}`

	const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			assertion: jwt,
		}),
	})

	if (!tokenResponse.ok) {
		const error = await tokenResponse.text()
		throw new Error(`Failed to get access token: ${error}`)
	}

	const tokenData = await tokenResponse.json()
	return tokenData.access_token
}

export async function listImagesInFolder(folderId: string): Promise<DriveImage[]> {
	const accessToken = await getAccessToken()

	const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`
	const fields = 'files(id, name, mimeType, webContentLink, createdTime, imageMediaMetadata)'

	const url = `${DRIVE_API_BASE}/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&orderBy=name`

	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
	})

	if (!response.ok) {
		throw new Error(`Google Drive API error: ${response.status} ${response.statusText}`)
	}

	const data = (await response.json()) as GoogleDriveResponse

	return (data.files || []).map((f) => ({
		id: f.id ?? '',
		name: f.name ?? 'unknown',
		mimeType: f.mimeType ?? 'image/jpeg',
		webContentLink: f.webContentLink,
		createdTime: f.createdTime,
		width: f.imageMediaMetadata?.width,
		height: f.imageMediaMetadata?.height,
	}))
}

export async function listSubfolders(parentFolderId: string): Promise<DriveFolder[]> {
	const accessToken = await getAccessToken()

	const query = `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
	const fields = 'files(id, name, createdTime, modifiedTime)'

	const url = `${DRIVE_API_BASE}/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&orderBy=name`

	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
	})

	if (!response.ok) {
		throw new Error(`Google Drive API error: ${response.status} ${response.statusText}`)
	}

	const data = (await response.json()) as GoogleDriveResponse

	return (data.files || []).map((f) => ({
		id: f.id ?? '',
		name: f.name ?? 'Untitled',
		createdTime: f.createdTime,
		modifiedTime: f.modifiedTime,
	}))
}

export function getThumbnailUrl(fileId: string, width = 400) {
	return `/api/drive-image/${fileId}?size=${width}`
}

export function getFullImageUrl(fileId: string, width = 1600) {
	return `/api/drive-image/${fileId}?size=${width}`
}

interface ShortcutItem {
	id: string
	name: string
	targetId: string
}

export async function listItemsWithShortcuts(folderId: string): Promise<DriveImage[]> {
	const accessToken = await getAccessToken()

	// First pass: get all items (including shortcuts)
	const q1 = encodeURIComponent(`'${folderId}' in parents and trashed = false`)
	const f1 = encodeURIComponent('files(id, name, mimeType, shortcutDetails)')
	const listUrl = `${DRIVE_API_BASE}/files?q=${q1}&fields=${f1}&orderBy=name`

	const listRes = await fetch(listUrl, {
		headers: { Authorization: `Bearer ${accessToken}` },
	})

	if (!listRes.ok) {
		throw new Error(`Google Drive API error: ${listRes.status} ${listRes.statusText}`)
	}

	const listData = (await listRes.json()) as { files?: any[] }
	const items = listData.files || []

	const results: DriveImage[] = []

	for (const item of items) {
		if (item.mimeType === 'application/vnd.google-apps.shortcut') {
			const targetId = item.shortcutDetails?.targetId
			if (!targetId) continue

			const tRes = await fetch(
				`${DRIVE_API_BASE}/files/${targetId}?fields=id,name,mimeType,webContentLink,createdTime,imageMediaMetadata`,
				{ headers: { Authorization: `Bearer ${accessToken}` } },
			)

			if (tRes.ok) {
				const tData = await tRes.json()
				if (tData.mimeType && tData.mimeType.includes('image/')) {
					results.push({
						id: tData.id,
						name: tData.name,
						mimeType: tData.mimeType,
						webContentLink: tData.webContentLink,
						createdTime: tData.createdTime,
						width: tData.imageMediaMetadata?.width,
						height: tData.imageMediaMetadata?.height,
					})
				}
			}
		} else if (item.mimeType && item.mimeType.includes('image/')) {
			results.push({
				id: item.id,
				name: item.name,
				mimeType: item.mimeType,
				webContentLink: item.webContentLink,
				createdTime: item.createdTime,
				width: item.imageMediaMetadata?.width,
				height: item.imageMediaMetadata?.height,
			})
		}
	}

	return results
}

export function parseFolderName(folderName: string): {
	category: string
	title: string
	date: string
	slug: string
} | null {
	const patterns = [
		/^([^—-]+?)\s*[—-]\s*(.+?)\s*[—-]\s*(\d{1,2}\s+\w+\s+\d{4})\s*$/,
		/^([^—-]+?)\s*[—-]\s*(.+?)\s*[—-]\s*(\d{4}-\d{2}-\d{2})\s*$/,
		/^(.+?)\s*[—-]\s*(\d{1,2}\s+\w+\s+\d{4})\s*$/,
	]

	for (const pattern of patterns) {
		const match = folderName.match(pattern)
		if (match) {
			if (match.length >= 4) {
				const category = match[1].trim()
				const title = match[2].trim()
				const dateStr = match[3].trim()
				const parsedDate = parseDate(dateStr)
				return {
					category: category,
					title: title,
					date: parsedDate,
					slug: generateSlug(category, title, parsedDate),
				}
			} else if (match.length === 3) {
				const title = match[1].trim()
				const dateStr = match[2].trim()
				const parsedDate = parseDate(dateStr)
				return {
					category: 'Umum',
					title: title,
					date: parsedDate,
					slug: generateSlug('Umum', title, parsedDate),
				}
			}
		}
	}

	const cleanName = folderName.replace(/^Galeri\s+/i, '').trim()
	return {
		category: 'Umum',
		title: cleanName,
		date: new Date().toISOString().split('T')[0],
		slug: generateSlug('Umum', cleanName, ''),
	}
}

function parseDate(dateStr: string): string {
	const months: Record<string, string> = {
		januari: '01',
		februari: '02',
		maret: '03',
		april: '04',
		mei: '05',
		juni: '06',
		juli: '07',
		agustus: '08',
		september: '09',
		oktober: '10',
		november: '11',
		desember: '12',
		january: '01',
		february: '02',
		march: '03',
		may: '05',
		june: '06',
		july: '07',
		august: '08',
		october: '10',
		december: '12',
	}

	const parts = dateStr.toLowerCase().split(/\s+/)
	if (parts.length === 3) {
		const day = parts[0].padStart(2, '0')
		const month = months[parts[1]] || '01'
		const year = parts[2]
		return `${year}-${month}-${day}`
	}

	if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
		return dateStr
	}

	return new Date().toISOString().split('T')[0]
}

function generateSlug(category: string, title: string, date: string): string {
	const categoryMap: Record<string, string> = {
		keagamaan: 'keagamaan',
		sosial: 'sosial',
		pendidikan: 'pendidikan',
		umum: 'umum',
	}

	const catKey = category.toLowerCase()
	const catSlug = categoryMap[catKey] || 'umum'

	const titleSlug = title
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.substring(0, 50)

	const year = date.split('-')[0] || String(new Date().getFullYear())

	return `${catSlug}-${titleSlug}-${year}`
}
