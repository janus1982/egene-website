import {defineArrayMember, defineField, defineType} from 'sanity'

export const championatHistorikType = defineType({
  name: 'championatHistorik',
  title: 'Championat: historik',
  type: 'document',
  fields: [
    defineField({name: 'aar', title: 'År', type: 'number', validation: (r) => r.required()}),
    defineField({
      name: 'kategori',
      title: 'Kategori',
      type: 'string',
      options: {list: ['Pony spring', 'Hest spring']},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'rangliste',
      title: 'Rangliste',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'placering', title: 'Placering', type: 'number'}),
            defineField({name: 'rytter', title: 'Rytter', type: 'string'}),
            defineField({name: 'hest', title: 'Hest', type: 'string'}),
            defineField({name: 'total_point', title: 'Total point', type: 'number'}),
            defineField({name: 'antal_resultater', title: 'Antal resultater', type: 'number'}),
          ],
          preview: {
            select: {placering: 'placering', rytter: 'rytter', hest: 'hest', point: 'total_point'},
            prepare({placering, rytter, hest, point}) {
              return {title: `${placering}. ${rytter} / ${hest}`, subtitle: `${point} point`}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'oprettet',
      title: 'Oprettet',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {aar: 'aar', kategori: 'kategori'},
    prepare({aar, kategori}) {
      return {title: `${aar} - ${kategori}`}
    },
  },
})
