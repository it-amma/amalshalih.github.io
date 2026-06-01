import * as Sentry from '@sentry/astro';

// Only initialize Sentry in production builds, not in dev/preview
if (import.meta.env.PROD) {
	Sentry.init({
		dsn: 'https://e99692c45d83afc7713330e193ea5a9a@o4511465723396096.ingest.us.sentry.io/4511465782509568',
		sendDefaultPii: false,
		environment: 'production',
	});
}
