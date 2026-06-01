import type { APIRoute } from 'astro';
import { fetchAllGalleries, filterPublishedGalleries } from '../../data/galleries';

export const GET: APIRoute = async () => {
	try {
		const allGalleries = await fetchAllGalleries();
		const galleries = filterPublishedGalleries(allGalleries);
		
		return new Response(JSON.stringify(galleries), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=300',
			},
		});
	} catch (error: any) {
		console.error('Error fetching galleries:', error);
		return new Response(
			JSON.stringify({ error: error.message || 'Failed to fetch galleries' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};
