import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

function getPhotoLikeKey(slug: string, photoId: string): string {
	return `photo:${slug}:${photoId}`;
}

export const GET: APIRoute = async ({ request }) => {
	const url = new URL(request.url);
	const slug = url.searchParams.get('slug');

	if (!slug) {
		return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
	}

	try {
		const likes = env.LIKES;

		const prefix = `photo:${slug}:`;
		const keys = await likes.list({ prefix });
		
		const result: Record<string, number> = {};
		for (const key of keys.keys) {
			const photoId = key.name.replace(prefix, '');
			const count = await likes.get(key.name);
			result[photoId] = parseInt(count || '0');
		}

		return new Response(JSON.stringify(result), {
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

		const likes = env.LIKES;
		const key = getPhotoLikeKey(slug, photoId);
		const current = await likes.get(key);
		const newLikes = parseInt(current || '0') + 1;
		
		await likes.put(key, newLikes.toString());

		return new Response(JSON.stringify({ likes: newLikes }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error: any) {
		console.error('[API /like POST] Error:', error);
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
};
