import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock cloudflare:workers env
vi.mock('cloudflare:workers', () => ({
	env: {
		GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY: JSON.stringify({
			type: 'service_account',
			project_id: 'test-project',
			private_key_id: 'test-key-id',
			private_key:
				'-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\n-----END PRIVATE KEY-----',
			client_email: 'test@test-project.iam.gserviceaccount.com',
			client_id: '123456',
			auth_uri: 'https://accounts.google.com/o/oauth2/auth',
			token_uri: 'https://oauth2.googleapis.com/token',
		}),
	},
}))

// Mock crypto.subtle for JWT signing
const mockSign = vi.fn().mockResolvedValue(new ArrayBuffer(32))
vi.stubGlobal('crypto', {
	subtle: {
		importKey: vi.fn().mockResolvedValue({}),
		sign: mockSign,
	},
})

// Mock fetch to intercept Google OAuth2 token exchange
const mockAccessToken = 'mock-access-token-12345'
vi.stubGlobal(
	'fetch',
	vi.fn().mockResolvedValue({
		ok: true,
		json: () =>
			Promise.resolve({ access_token: mockAccessToken, token_type: 'Bearer', expires_in: 3600 }),
	}),
)

describe('google-drive', () => {
	let getAccessToken: () => Promise<string>
	let getFullImageUrl: (fileId: string, width?: number) => string
	let getThumbnailUrl: (fileId: string, width?: number) => string

	beforeEach(async () => {
		const module = await import('../google-drive')
		getAccessToken = module.getAccessToken
		getFullImageUrl = module.getFullImageUrl
		getThumbnailUrl = module.getThumbnailUrl
	})

	describe('getAccessToken', () => {
		it('returns a valid access token', async () => {
			const token = await getAccessToken()

			expect(token).toBeDefined()
			expect(typeof token).toBe('string')
			expect(token.length).toBeGreaterThan(0)
			expect(token).toBe(mockAccessToken)
		})
	})

	describe('getFullImageUrl', () => {
		it('returns proxied URL with default width', () => {
			const fileId = 'abc123'
			const url = getFullImageUrl(fileId)

			expect(url).toContain('/api/drive-image/abc123')
			expect(url).toContain('size=1600')
		})

		it('includes custom width when provided', () => {
			const fileId = 'xyz789'
			const url = getFullImageUrl(fileId, 800)

			expect(url).toContain('/api/drive-image/xyz789')
			expect(url).toContain('size=800')
		})
	})

	describe('getThumbnailUrl', () => {
		it('returns proxied thumbnail URL with default width', () => {
			const fileId = 'thumb123'
			const url = getThumbnailUrl(fileId)

			expect(url).toContain('/api/drive-image/thumb123')
			expect(url).toContain('size=400')
		})

		it('includes custom width for thumbnail', () => {
			const url = getThumbnailUrl('test', 400)
			expect(url).toContain('/api/drive-image/test')
			expect(url).toContain('size=400')
		})
	})
})
