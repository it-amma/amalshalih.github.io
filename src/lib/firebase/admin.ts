import { env } from 'cloudflare:workers';

interface ServiceAccount {
	type: string;
	project_id: string;
	private_key_id: string;
	private_key: string;
	client_email: string;
	client_id: string;
	auth_uri: string;
	token_uri: string;
	auth_provider_x509_cert_url: string;
	client_x509_cert_url: string;
}

function getServiceAccount(): ServiceAccount {
	const credentials = (env as any).FIREBASE_SERVICE_ACCOUNT_KEY;
	if (!credentials) {
		throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY env var is not set');
	}
	return JSON.parse(credentials);
}

function base64UrlEncode(str: string): string {
	return btoa(str)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}

export async function getFirebaseAdminToken(): Promise<string> {
	const serviceAccount = getServiceAccount();

	if (!serviceAccount.private_key || !serviceAccount.client_email) {
		throw new Error('Missing Firebase Service Account credentials');
	}

	const privateKey = serviceAccount.private_key;
	const clientEmail = serviceAccount.client_email;

	const now = Math.floor(Date.now() / 1000);
	const exp = now + 3600;

	const header = { alg: 'RS256', typ: 'JWT' };
	const payload = {
		iss: clientEmail,
		sub: clientEmail,
		aud: 'https://oauth2.googleapis.com/token',
		iat: now,
		exp: exp,
		scope: 'https://www.googleapis.com/auth/cloud-platform',
	};

	const encodedHeader = base64UrlEncode(JSON.stringify(header));
	const encodedPayload = base64UrlEncode(JSON.stringify(payload));
	const signingInput = `${encodedHeader}.${encodedPayload}`;

	const pemContents = privateKey
		.replace('-----BEGIN PRIVATE KEY-----', '')
		.replace('-----END PRIVATE KEY-----', '')
		.replace(/\n/g, '');

	const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

	const key = await crypto.subtle.importKey(
		'pkcs8',
		binaryDer,
		{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
		false,
		['sign'],
	);

	const signatureBuffer = await crypto.subtle.sign(
		{ name: 'RSASSA-PKCS1-v1_5' },
		key,
		new TextEncoder().encode(signingInput),
	);

	const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

	const jwt = `${signingInput}.${signature}`;

	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			assertion: jwt,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to get access token: ${error}`);
	}

	const data = await response.json();
	return data.access_token;
}
