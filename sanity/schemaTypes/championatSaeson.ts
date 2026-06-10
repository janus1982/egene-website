import {defineField, defineType} from 'sanity'

export const championatSaesonType = defineType({
  name: 'championatSaeson',
  title: 'Championat: sæson',
  type: 'document',
  fields: [
    defineField({
      name: 'aar',
      title: 'År (fx 2026)',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'aktiv',
      title: 'Aktiv sæson',
      type: 'boolean',
      initialValue: false,
      description: 'Kun ÉN sæson må være aktiv ad gangen.',
    }),
    defineField({
      name: 'kategori_pony_vinder',
      title: 'Vinder, Pony spring',
      type: 'string',
    }),
    defineField({
      name: 'kategori_hest_vinder',
      title: 'Vinder, Hest spring',
      type: 'string',
    }),
    defineField({
      name: 'afsluttet',
      title: 'Afsluttet',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'noter',
      title: 'Interne noter',
      type: 'text',
    }),
  ],
  preview: {
    select: {aar: 'aar', aktiv: 'aktiv'},
    prepare({aar, aktiv}) {
      return {title: `Sæson ${aar}`, subtitle: aktiv ? 'Aktiv' : ''}
    },
  },
})
