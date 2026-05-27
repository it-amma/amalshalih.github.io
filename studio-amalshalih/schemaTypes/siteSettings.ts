import {defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Pengaturan Website',
  type: 'document',
  groups: [
    {name: 'umum', title: 'Umum'},
    {name: 'profil', title: 'Profil'},
    {name: 'kontak', title: 'Kontak'},
    {name: 'sosmed', title: 'Sosial Media'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nama Yayasan',
      type: 'string',
      group: 'umum',
    }),
    defineField({
      name: 'shortName',
      title: 'Nama Singkat',
      type: 'string',
      group: 'umum',
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Website',
      type: 'text',
      rows: 3,
      group: 'umum',
    }),
    defineField({
      name: 'visi',
      title: 'Visi',
      type: 'text',
      rows: 3,
      group: 'profil',
    }),
    defineField({
      name: 'misi',
      title: 'Misi',
      type: 'array',
      of: [{type: 'string'}],
      group: 'profil',
    }),
    defineField({
      name: 'aboutContent',
      title: 'Konten Halaman Tentang',
      type: 'blockContent',
      group: 'profil',
    }),
    defineField({
      name: 'address',
      title: 'Alamat',
      type: 'object',
      group: 'kontak',
      fields: [
        {name: 'street', title: 'Jalan', type: 'string'},
        {name: 'village', title: 'Desa/Kelurahan', type: 'string'},
        {name: 'district', title: 'Kecamatan', type: 'string'},
        {name: 'city', title: 'Kota/Kabupaten', type: 'string'},
        {name: 'province', title: 'Provinsi', type: 'string'},
        {name: 'postalCode', title: 'Kode Pos', type: 'string'},
      ],
    }),
    defineField({
      name: 'phone',
      title: 'Telepon / WA',
      type: 'string',
      group: 'kontak',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'kontak',
    }),
    defineField({
      name: 'qrisImage',
      title: 'Gambar QRIS',
      type: 'image',
      group: 'kontak',
    }),
    defineField({
      name: 'linktree',
      title: 'Linktree URL',
      type: 'url',
      group: 'sosmed',
    }),
    defineField({
      name: 'socialMedia',
      title: 'Sosial Media',
      type: 'object',
      group: 'sosmed',
      fields: [
        {name: 'facebook', title: 'Facebook', type: 'url'},
        {name: 'instagram', title: 'Instagram', type: 'url'},
        {name: 'youtube', title: 'YouTube', type: 'url'},
        {name: 'tiktok', title: 'TikTok', type: 'url'},
      ],
    }),
  ],
})
