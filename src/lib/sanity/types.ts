export interface SanityKegiatan {
  _id: string
  title: string
  slug: string
  date: string
  category: 'pendidikan' | 'keagamaan' | 'sosial' | 'berita'
  excerpt?: string
  imageUrl?: string
  imageAlt?: string
  body?: unknown
}

export interface SanityProgram {
  _id: string
  title: string
  slug?: string
  category: 'pendidikan' | 'keagamaan' | 'sosial'
  icon?: string
  shortDesc?: string
  imageUrl?: string
  imageAlt?: string
}

export interface SanityBankDonasi {
  _id: string
  bankName: string
  accountNumber: string
  accountName: string
  logoUrl?: string
}

export interface SanityPengurus {
  _id: string
  name: string
  position: string
  description?: string
  photoUrl?: string
  photoAlt?: string
}

export interface SanitySiteSettings {
  siteName?: string
  shortName?: string
  description?: string
  aboutContent?: unknown
  visi?: string
  misi?: string[]
  address?: {
    street?: string
    village?: string
    district?: string
    city?: string
    province?: string
    postalCode?: string
  }
  phone?: string
  email?: string
  qrisImageUrl?: string
  mapsUrl?: string
  linktree?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    youtube?: string
    tiktok?: string
  }
  stats?: {
    number: string
    label: string
  }[]
}
