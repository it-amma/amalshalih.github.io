import { createPrivateKey, createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

let cachedServiceAccount: ServiceAccount | null = null;

function getServiceAccount(): ServiceAccount {
	if (cachedServiceAccount) return cachedServiceAccount;
	
	const path = resolve(process.cwd(), 'amalshalih-fd1bd-firebase-adminsdk-fbsvc-624be20267.json');
	const content = readFileSync(path, 'utf-8');
	cachedServiceAccount = JSON.parse(content);
	return cachedServiceAccount!;
}

function base64UrlEncode(str: string): string {
	return Buffer.from(str)
		.toString('base64')
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
	};

	const encodedHeader = base64UrlEncode(JSON.stringify(header));
	const encodedPayload = base64UrlEncode(JSON.stringify(payload));
	const signingInput = `${encodedHeader}.${encodedPayload}`;

	const key = createPrivateKey(privateKey);
	const signer = createSign('RSA-SHA256');
	signer.update(signingInput);
	const signature = signer.sign(key, 'base64');
	const encodedSignature = signature
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');

	const jwt = `${signingInput}.${encodedSignature}`;

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
