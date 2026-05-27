import { sanityClient } from 'sanity:client'
import type { SanityKegiatan, SanityProgram, SanityBankDonasi, SanityPengurus, SanitySiteSettings } from './types'
import {
	kegiatanListQuery,
	kegiatanItemQuery,
	programListQuery,
	bankDonasiQuery,
	pengurusQuery,
	siteSettingsQuery,
} from './queries'

export async function getKegiatanList(): Promise<SanityKegiatan[]> {
	return sanityClient.fetch(kegiatanListQuery)
}

export async function getKegiatanItem(slug: string): Promise<SanityKegiatan | null> {
	return sanityClient.fetch(kegiatanItemQuery, { slug })
}

export async function getProgramList(): Promise<SanityProgram[]> {
	return sanityClient.fetch(programListQuery)
}

export async function getBankDonasi(): Promise<SanityBankDonasi[]> {
	return sanityClient.fetch(bankDonasiQuery)
}

export async function getPengurus(): Promise<SanityPengurus[]> {
	return sanityClient.fetch(pengurusQuery)
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
	return sanityClient.fetch(siteSettingsQuery)
}
