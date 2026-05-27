import {defineField, defineType} from 'sanity'

export const kegiatanType = defineType({
  name: 'kegiatan',
  title: 'Kegiatan',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Kegiatan',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Tanggal',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          {title: 'Pendidikan', value: 'pendidikan'},
          {title: 'Keagamaan', value: 'keagamaan'},
          {title: 'Sosial', value: 'sosial'},
          {title: 'Berita', value: 'berita'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Ringkasan',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Gambar',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Teks Alternatif',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Konten',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'category',
    },
  },
})
