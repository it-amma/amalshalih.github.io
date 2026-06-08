import { sanityClient } from 'sanity:client'
import { cachedFetch, sanityCacheKey } from '../kv-cache'
import {
	bankDonasiQuery,
	blogPostItemQuery,
	blogPostListQuery,
	faqListQuery,
	kegiatanItemQuery,
	kegiatanListQuery,
	pengurusQuery,
	programListQuery,
	siteSettingsQuery,
} from './queries'
import type {
	SanityBankDonasi,
	SanityBlogPost,
	SanityFaq,
	SanityKegiatan,
	SanityPengurus,
	SanityProgram,
	SanitySiteSettings,
} from './types'

export async function getKegiatanList(): Promise<SanityKegiatan[]> {
	return cachedFetch({
		key: sanityCacheKey(kegiatanListQuery),
		fetcher: () => sanityClient.fetch(kegiatanListQuery),
	})
}

export async function getKegiatanItem(slug: string): Promise<SanityKegiatan | null> {
	return cachedFetch({
		key: sanityCacheKey(kegiatanItemQuery, { slug }),
		fetcher: () => sanityClient.fetch(kegiatanItemQuery, { slug }),
	})
}

export async function getProgramList(): Promise<SanityProgram[]> {
	return cachedFetch({
		key: sanityCacheKey(programListQuery),
		fetcher: () => sanityClient.fetch(programListQuery),
	})
}

export async function getBankDonasi(): Promise<SanityBankDonasi[]> {
	return cachedFetch({
		key: sanityCacheKey(bankDonasiQuery),
		fetcher: () => sanityClient.fetch(bankDonasiQuery),
	})
}

export async function getPengurus(): Promise<SanityPengurus[]> {
	return cachedFetch({
		key: sanityCacheKey(pengurusQuery),
		fetcher: () => sanityClient.fetch(pengurusQuery),
	})
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
	return cachedFetch({
		key: sanityCacheKey(siteSettingsQuery),
		fetcher: () => sanityClient.fetch(siteSettingsQuery),
	})
}

export async function getFaqList(): Promise<SanityFaq[] | null> {
	try {
		const faqs = await sanityClient.fetch<SanityFaq[]>(faqListQuery)
		return faqs || []
	} catch (error) {
		console.error('Failed to fetch FAQ from Sanity:', error)
		return []
	}
}

export async function getBlogPostList(): Promise<SanityBlogPost[]> {
	return cachedFetch({
		key: sanityCacheKey(blogPostListQuery),
		fetcher: () => sanityClient.fetch(blogPostListQuery),
	})
}

export async function getBlogPost(slug: string): Promise<SanityBlogPost | null> {
	return cachedFetch({
		key: sanityCacheKey(blogPostItemQuery, { slug }),
		fetcher: () => sanityClient.fetch(blogPostItemQuery, { slug }),
	})
}
