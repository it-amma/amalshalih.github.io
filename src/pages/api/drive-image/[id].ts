import type { APIRoute } from 'astro';

export const prerender = false;

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';

function base64urlEncode(data: string): string {
	return btoa(data)
		.replace(/=+$/, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
}

async function getAccessToken(credentialsJson: string): Promise<string> {
	const credentials = JSON.parse(credentialsJson);
	const { private_key, client_email } = credentials;

	const pemContents = private_key
		.replace('-----BEGIN PRIVATE KEY-----', '')
		.replace('-----END PRIVATE KEY-----', '')
		.replace(/\s/g, '');

	const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

	const key = await crypto.subtle.importKey(
		'pkcs8',
		binaryDer,
		{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
		false,
		['sign'],
	);

	const header = { alg: 'RS256', typ: 'JWT' };
	const now = Math.floor(Date.now() / 1000);
	const claim = {
		iss: client_email,
		scope: 'https://www.googleapis.com/auth/drive.readonly',
		aud: GOOGLE_TOKEN_URL,
		exp: now + 3600,
		iat: now,
	};

	const message = `${base64urlEncode(JSON.stringify(header))}.${base64urlEncode(JSON.stringify(claim))}`;

	const encoder = new TextEncoder();
	const signature = await crypto.subtle.sign(
		{ name: 'RSASSA-PKCS1-v1_5' },
		key,
		encoder.encode(message),
	);

	const signatureB64 = base64urlEncode(
		String.fromCharCode(...new Uint8Array(signature)),
	);

	const jwt = `${message}.${signatureB64}`;

	const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			assertion: jwt,
		}),
	});

	if (!tokenResponse.ok) {
		const errText = await tokenResponse.text();
		throw new Error(`Token exchange failed: ${tokenResponse.status} ${errText}`);
	}

	const tokenData: { access_token: string } = await tokenResponse.json();
	return tokenData.access_token;
}

export const GET: APIRoute = async ({ params, request }) => {
	const { id } = params;
	const url = new URL(request.url);
	const size = Number(url.searchParams.get('size')) || 800;

	if (!id) {
		return new Response('Missing file ID', { status: 400 });
	}

	const credentials = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY;
	if (!credentials) {
		return new Response(null, { status: 404 });
	}

	try {
		const token = await getAccessToken(credentials);

		// Thumbnail: use Drive API thumbnailLink (a small Google CDN image)
		if (size <= 800) {
			const metaRes = await fetch(
				`${GOOGLE_DRIVE_API_URL}/${id}?fields=thumbnailLink`,
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			if (metaRes.ok) {
				const meta: { thumbnailLink?: string } = await metaRes.json();
				if (meta.thumbnailLink) {
					const thumbRes = await fetch(meta.thumbnailLink);
					if (thumbRes.ok) {
						return new Response(thumbRes.body, {
							headers: {
								'Content-Type':
									thumbRes.headers.get('Content-Type') || 'image/jpeg',
								'Cache-Control': 'public, max-age=86400',
							},
						});
					}
				}
			}
		}

		// Full image: Drive API alt=media
		const apiRes = await fetch(
			`${GOOGLE_DRIVE_API_URL}/${id}?alt=media`,
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		if (apiRes.ok) {
			return new Response(apiRes.body, {
				headers: {
					'Content-Type': apiRes.headers.get('Content-Type') || 'image/jpeg',
					'Cache-Control': 'public, max-age=86400',
				},
			});
		}
	} catch (e) {
		console.error('Drive API proxy failed:', e);
	}

	return new Response(null, { status: 404 });
};
