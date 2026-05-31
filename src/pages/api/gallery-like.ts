import type { APIRoute } from 'astro';
import { getFirebaseAdminToken } from '../../lib/firebase/admin';

const isDev = process.env.NODE_ENV === 'development' || import.meta.env.DEV;
const RTDB_URL = process.env.FIREBASE_RTDB_URL || 'https://amalshalih-fd1bd-default-rtdb.firebaseio.com';

interface LikeData {
	count: number;
	users: Record<string, number>;
}

// In-memory store for dev mode
const devLikes = new Map<string, LikeData>();

function getDevLikes(slug: string): LikeData {
	if (!devLikes.has(slug)) {
		devLikes.set(slug, { count: 0, users: {} });
	}
	return devLikes.get(slug)!;
}

export const GET: APIRoute = async ({ request }) => {
	const url = new URL(request.url);
	const slug = url.searchParams.get('slug');
	const userId = url.searchParams.get('userId') || 'anonymous';

	if (!slug) {
		return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
	}

	if (isDev) {
		const data = getDevLikes(slug);
		return new Response(JSON.stringify({
			count: data.count,
			liked: !!data.users[userId]
		}), { status: 200, headers: { 'Content-Type': 'application/json' } });
	}

	try {
		const token = await getFirebaseAdminToken();
		const response = await fetch(`${RTDB_URL}/likes/${slug}.json?access_token=${token}`);
		
		if (!response.ok) {
			throw new Error(`Firebase error: ${response.statusText}`);
		}
		
		const data: LikeData | null = await response.json();
		return new Response(JSON.stringify({
			count: data?.count || 0,
			liked: !!data?.users?.[userId]
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
};

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();
		const { slug, userId = 'anonymous', action } = body;

		if (!slug) {
			return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
		}

		if (isDev) {
			const data = getDevLikes(slug);
			const currentlyLiked = !!data.users[userId];
			
			// Toggle logic
			if (action === 'unlike' || currentlyLiked) {
				// Unlike
				delete data.users[userId];
				data.count = Math.max(0, data.count - 1);
			} else {
				// Like
				data.users[userId] = Date.now();
				data.count = data.count + 1;
			}
			
			return new Response(JSON.stringify({
				count: data.count,
				liked: !!data.users[userId]
			}), { status: 200, headers: { 'Content-Type': 'application/json' } });
		}

		const token = await getFirebaseAdminToken();
		const refUrl = `${RTDB_URL}/likes/${slug}.json?access_token=${token}`;

		const getResponse = await fetch(refUrl);
		const data: LikeData = (await getResponse.json()) || { count: 0, users: {} };
		
		const currentlyLiked = !!data.users?.[userId];
		
		// Toggle logic
		if (action === 'unlike' || currentlyLiked) {
			// Unlike
			delete data.users[userId];
			data.count = Math.max(0, (data.count || 0) - 1);
		} else {
			// Like
			data.users[userId] = Date.now();
			data.count = (data.count || 0) + 1;
		}

		const updateResponse = await fetch(refUrl, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});

		if (!updateResponse.ok) {
			throw new Error(`Failed to update likes: ${updateResponse.statusText}`);
		}

		return new Response(JSON.stringify({
			count: data.count,
			liked: !!data.users[userId]
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
};
