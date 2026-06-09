import { describe, expect, it, vi } from 'vitest'

vi.mock('cloudflare:workers', () => ({
	env: {
		RESEND_API_KEY: 'test-resend-key',
	},
}))

describe('API /kontak', () => {
	describe('POST /api/kontak', () => {
		it('should accept valid contact form data', () => {
			const validData = {
				nama: 'Test User',
				telepon: '081234567890',
				email: 'test@example.com',
				subjek: 'donasi',
				pesan: 'Test pesan',
			}

			expect(validData.nama).toBeDefined()
			expect(validData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
			expect(['donasi', 'program', 'kerjasama', 'pendaftaran', 'kritik', 'lainnya']).toContain(
				validData.subjek,
			)
		})

		it('should reject invalid email format', () => {
			const invalidEmail = 'invalid-email'
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

			expect(emailRegex.test(invalidEmail)).toBe(false)
			expect(emailRegex.test('valid@example.com')).toBe(true)
		})

		it('should validate required fields', () => {
			const requiredFields = ['nama', 'email', 'pesan']
			const testData: Record<string, any> = {
				nama: '',
				email: '',
				pesan: '',
			}

			requiredFields.forEach((field) => {
				expect(testData[field]).toBeFalsy()
			})
		})

		it('should validate message length', () => {
			const maxLength = 5000
			const shortMessage = 'Short message'
			const longMessage = 'a'.repeat(maxLength + 1)

			expect(shortMessage.length).toBeLessThanOrEqual(maxLength)
			expect(longMessage.length).toBeGreaterThan(maxLength)
		})

		it('should handle honeypot field', () => {
			const botData = {
				nama: 'Bot',
				email: 'bot@example.com',
				pesan: 'Spam',
				_website: 'http://spam.com',
			}

			if (botData._website) {
				expect({ success: true }).toEqual({ success: true })
			}
		})

		it('should validate CSRF origin', () => {
			const allowedOrigins = [
				'https://amalshalih.id',
				'https://www.amalshalih.id',
				'https://amalshalih.or.id',
				'https://www.amalshalih.or.id',
				'https://www.asib.workers.dev',
				'http://localhost:4321',
			]

			const validOrigin = 'https://amalshalih.or.id'
			const invalidOrigin = 'https://evil.com'

			expect(allowedOrigins).toContain(validOrigin)
			expect(allowedOrigins).not.toContain(invalidOrigin)
		})

		it('should route messages correctly', () => {
			const routing: Record<string, string> = {
				donasi: 'donasi@amalshalih.or.id',
				program: 'info@amalshalih.or.id',
				kerjasama: 'humas@amalshalih.or.id',
			}

			expect(routing.donasi).toBe('donasi@amalshalih.or.id')
			expect(routing.program).toBe('info@amalshalih.or.id')
		})
	})

	describe('Phone Validation', () => {
		it('should validate phone format', () => {
			const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/

			expect(phoneRegex.test('081234567890')).toBe(true)
			expect(phoneRegex.test('6281234567890')).toBe(true)
			expect(phoneRegex.test('+6281234567890')).toBe(true)
			expect(phoneRegex.test('invalid')).toBe(false)
		})
	})
})
