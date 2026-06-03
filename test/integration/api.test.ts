import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:8787';

describe('Health Check API', () => {
	it('should return healthy status when all services are up', async () => {
		const response = await fetch(`${BASE_URL}/api/health`);
		const data = await response.json();
		
		expect(response.status).toBe(200);
		expect(data.status).toMatch(/healthy|degraded/);
		expect(data.timestamp).toBeDefined();
		expect(data.version).toBeDefined();
		expect(data.checks).toBeDefined();
		expect(data.checks.kv).toBeDefined();
		expect(data.checks.googleDrive).toBeDefined();
		expect(data.checks.sanity).toBeDefined();
	});
	
	it('should return no-cache headers', async () => {
		const response = await fetch(`${BASE_URL}/api/health`);
		
		expect(response.headers.get('Cache-Control')).toContain('no-cache');
		expect(response.headers.get('Content-Type')).toBe('application/json');
	});
});

describe('Gallery API', () => {
	it('should return galleries with correct structure', async () => {
		const response = await fetch(`${BASE_URL}/api/galleries`);
		
		expect(response.status).toBe(200);
		
		const data = await response.json();
		expect(Array.isArray(data)).toBe(true);
		
		if (data.length > 0) {
			const gallery = data[0];
			expect(gallery.id).toBeDefined();
			expect(gallery.name).toBeDefined();
			expect(gallery.photos).toBeDefined();
			expect(Array.isArray(gallery.photos)).toBe(true);
		}
	});
	
	it('should have cache headers', async () => {
		const response = await fetch(`${BASE_URL}/api/galleries`);
		
		expect(response.headers.get('Cache-Control')).toContain('max-age');
	});
});

describe('Like API', () => {
	const TEST_SLUG = 'test-gallery';
	const TEST_PHOTO_ID = 'test-photo-123';
	
	it('should return likes for a gallery', async () => {
		const response = await fetch(`${BASE_URL}/api/like?slug=${TEST_SLUG}`);
		
		expect(response.status).toBe(200);
		
		const data = await response.json();
		expect(typeof data).toBe('object');
	});
	
	it('should return 400 for missing slug', async () => {
		const response = await fetch(`${BASE_URL}/api/like`);
		
		expect(response.status).toBe(400);
		
		const data = await response.json();
		expect(data.error).toBeDefined();
	});
	
	it('should increment likes on POST', async () => {
		const postResponse = await fetch(`${BASE_URL}/api/like`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ slug: TEST_SLUG, photoId: TEST_PHOTO_ID }),
		});
		
		expect(postResponse.status).toBe(200);
		
		const data = await postResponse.json();
		expect(typeof data.likes).toBe('number');
		expect(data.likes).toBeGreaterThanOrEqual(1);
	});
	
	it('should return 400 for missing body parameters', async () => {
		const response = await fetch(`${BASE_URL}/api/like`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({}),
		});
		
		expect(response.status).toBe(400);
	});
});

describe('Page Routes', () => {
	const pages = [
		{ path: '/', name: 'home' },
		{ path: '/tentang', name: 'tentang' },
		{ path: '/program', name: 'program' },
		{ path: '/kegiatan', name: 'kegiatan' },
		{ path: '/blog', name: 'blog' },
		{ path: '/galeri', name: 'galeri' },
		{ path: '/donasi', name: 'donasi' },
		{ path: '/kontak', name: 'kontak' },
	];
	
	for (const page of pages) {
		it(`should return 200 for ${page.name} page`, async () => {
			const response = await fetch(`${BASE_URL}${page.path}`);
			expect(response.status).toBe(200);
		});
	}
});

describe('Static Assets', () => {
	it('should serve favicon', async () => {
		const response = await fetch(`${BASE_URL}/favicon.ico`);
		expect(response.status).toBe(200);
	});
	
	it('should serve logo', async () => {
		const response = await fetch(`${BASE_URL}/logo-yayasan.webp`);
		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toContain('image');
	});
});

describe('Security Headers', () => {
	it('should have security headers on API responses', async () => {
		const response = await fetch(`${BASE_URL}/api/health`);
		
		expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
	});
});