import {defineField, defineType} from 'sanity'

export const programType = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nama Program',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
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
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Ikon',
      type: 'string',
      description: 'Nama ikon (book, heart, mosque)',
    }),
    defineField({
      name: 'shortDesc',
      title: 'Deskripsi Singkat',
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
      name: 'description',
      title: 'Deskripsi Lengkap',
      type: 'blockContent',
    }),
    defineField({
      name: 'order',
      title: 'Urutan',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
})
