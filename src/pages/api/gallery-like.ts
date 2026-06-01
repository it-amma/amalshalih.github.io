import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

interface LikeData {
	count: number;
	users: Record<string, number>;
}

function getGalleryKey(slug: string): string {
	return `gallery:${slug}`;
}

async function getLikesFromKV(slug: string): Promise<LikeData> {
	const key = getGalleryKey(slug);
	const data = await env.LIKES.get(key);
	if (data) {
		return JSON.parse(data);
	}
	return { count: 0, users: {} };
}

async function saveLikesToKV(slug: string, data: LikeData): Promise<void> {
	const key = getGalleryKey(slug);
	await env.LIKES.put(key, JSON.stringify(data));
}

export const GET: APIRoute = async ({ request }) => {
	const url = new URL(request.url);
	const slug = url.searchParams.get('slug');
	const userId = url.searchParams.get('userId') || 'anonymous';

	if (!slug) {
		return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
	}

	try {
		const data = await getLikesFromKV(slug);
		return new Response(JSON.stringify({
			count: data.count,
			liked: !!data.users[userId]
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error: any) {
		console.error('[API /gallery-like GET] Error:', error);
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

		const data = await getLikesFromKV(slug);
		const currentlyLiked = !!data.users[userId];
		
		if (action === 'unlike' || currentlyLiked) {
			delete data.users[userId];
			data.count = Math.max(0, data.count - 1);
		} else {
			data.users[userId] = Date.now();
			data.count = data.count + 1;
		}
		
		await saveLikesToKV(slug, data);

		return new Response(JSON.stringify({
			count: data.count,
			liked: !!data.users[userId]
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error: any) {
		console.error('[API /gallery-like POST] Error:', error);
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
};
