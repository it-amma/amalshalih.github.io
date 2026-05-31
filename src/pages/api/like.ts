import type { APIRoute } from 'astro';
import { getFirebaseAdminToken } from '../../lib/firebase/admin';

const isDev = process.env.NODE_ENV === 'development' || import.meta.env.DEV;

// In-memory store for dev mode: { slug: { photoId: count } }
const devPhotoLikes = new Map<string, Map<string, number>>();

export const GET: APIRoute = async ({ request }) => {
	const url = new URL(request.url);
	const slug = url.searchParams.get('slug');

	if (!slug) {
		return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
	}

	if (isDev) {
		const galleryLikes = devPhotoLikes.get(slug);
		const result: Record<string, number> = {};
		if (galleryLikes) {
			galleryLikes.forEach((count, photoId) => {
				result[photoId] = count;
			});
		}
		return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
	}

	try {
		const token = await getFirebaseAdminToken();
		const response = await fetch(`${process.env.FIREBASE_RTDB_URL}/photoLikes/${slug}.json?access_token=${token}`);

		if (!response.ok) {
			throw new Error(`Firebase error: ${response.statusText}`);
		}

		const data = await response.json();
		return new Response(JSON.stringify(data || {}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error: any) {
		console.error('[API /like GET] Error:', error);
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
};

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();
		const { slug, photoId } = body;

		if (!slug || !photoId) {
			return new Response(JSON.stringify({ error: 'Missing slug or photoId' }), { status: 400 });
		}

		if (isDev) {
			let galleryLikes = devPhotoLikes.get(slug);
			if (!galleryLikes) {
				galleryLikes = new Map();
				devPhotoLikes.set(slug, galleryLikes);
			}
			const current = galleryLikes.get(photoId) || 0;
			const updated = current + 1;
			galleryLikes.set(photoId, updated);
			return new Response(JSON.stringify({ likes: updated }), { status: 200, headers: { 'Content-Type': 'application/json' } });
		}

		const token = await getFirebaseAdminToken();
		const refUrl = `${process.env.FIREBASE_RTDB_URL}/photoLikes/${slug}/${photoId}.json?access_token=${token}`;

		const getResponse = await fetch(refUrl);
		const currentLikes = (await getResponse.json()) || 0;
		const newLikes = currentLikes + 1;

		const updateResponse = await fetch(refUrl, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newLikes),
		});

		if (!updateResponse.ok) {
			throw new Error(`Failed to update likes: ${updateResponse.statusText}`);
		}

		return new Response(JSON.stringify({ likes: newLikes }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error: any) {
		console.error('[API /like POST] Error:', error);
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
};
