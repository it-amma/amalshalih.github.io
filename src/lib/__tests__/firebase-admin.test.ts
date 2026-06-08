import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock cloudflare:workers env
vi.mock('cloudflare:workers', () => ({
	env: {
		FIREBASE_SERVICE_ACCOUNT_KEY: JSON.stringify({
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
		FIREBASE_RTDB_URL: 'https://test-project.firebaseio.com',
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
const mockAccessToken = 'mock-firebase-token-abc'
vi.stubGlobal(
	'fetch',
	vi.fn().mockResolvedValue({
		ok: true,
		json: () =>
			Promise.resolve({ access_token: mockAccessToken, token_type: 'Bearer', expires_in: 3600 }),
	}),
)

describe('firebase/admin', () => {
	let getFirebaseAdminToken: () => Promise<string>

	beforeEach(async () => {
		const module = await import('../firebase/admin')
		getFirebaseAdminToken = module.getFirebaseAdminToken
	})

	describe('getFirebaseAdminToken', () => {
		it('returns the OAuth2 access token from Google', async () => {
			const token = await getFirebaseAdminToken()

			expect(token).toBe(mockAccessToken)
			expect(typeof token).toBe('string')
			expect(token.length).toBeGreaterThan(0)
		})
	})
})
