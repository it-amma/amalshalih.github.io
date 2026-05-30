// This file is used during local development and Cloudflare Workers production.
// For Workers production, the @sentry/astro integration wraps the SSR handler
// with withSentry() from @sentry/cloudflare.

import * as Sentry from '@sentry/astro';

Sentry.init({
	dsn: 'https://e99692c45d83afc7713330e193ea5a9a@o4511465723396096.ingest.us.sentry.io/4511465782509568',
	environment: import.meta.env.PROD ? 'production' : 'development',
	tracesSampleRate: 1.0,
	sendDefaultPii: false,
});
