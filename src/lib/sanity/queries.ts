// GROQ queries for fetching ASIB content from Sanity

export const kegiatanListQuery = `*[_type == "kegiatan"] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  date,
  category,
  excerpt,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt
}`

export const kegiatanItemQuery = `*[_type == "kegiatan" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  date,
  category,
  excerpt,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  body
}`

export const programListQuery = `*[_type == "program"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  category,
  icon,
  shortDesc,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt
}`

export const bankDonasiQuery = `*[_type == "bankDonasi" && isActive == true] | order(order asc) {
  _id,
  bankName,
  accountNumber,
  accountName,
  "logoUrl": logo.asset->url
}`

export const pengurusQuery = `*[_type == "pengurus"] | order(order asc) {
  _id,
  name,
  position,
  description,
  "photoUrl": photo.asset->url,
  "photoAlt": photo.alt
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  siteName,
  shortName,
  description,
  aboutContent,
  visi,
  misi,
  address,
  phone,
  email,
  "qrisImageUrl": qrisImage.asset->url,
  linktree,
  socialMedia
}`
