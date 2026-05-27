import {defineField, defineType} from 'sanity'

export const bankDonasiType = defineType({
  name: 'bankDonasi',
  title: 'Bank Donasi',
  type: 'document',
  fields: [
    defineField({
      name: 'bankName',
      title: 'Nama Bank',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'accountNumber',
      title: 'Nomor Rekening',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'accountName',
      title: 'Atas Nama',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo Bank',
      type: 'image',
    }),
    defineField({
      name: 'isActive',
      title: 'Aktif',
      type: 'boolean',
      initialValue: true,
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
      title: 'bankName',
      subtitle: 'accountNumber',
    },
  },
})
