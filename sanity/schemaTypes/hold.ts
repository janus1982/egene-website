import {defineField, defineType} from 'sanity'

export const holdType = defineType({
  name: 'hold',
  title: 'Hold',
  type: 'document',
  fields: [
    defineField({
      name: 'ugedag',
      title: 'Ugedag',
      type: 'string',
      options: {
        list: [
          {title: 'Mandag', value: 'Mandag'},
          {title: 'Tirsdag', value: 'Tirsdag'},
          {title: 'Onsdag', value: 'Onsdag'},
          {title: 'Torsdag', value: 'Torsdag'},
          {title: 'Fredag', value: 'Fredag'},
          {title: 'Lørdag', value: 'Lørdag'},
          {title: 'Søndag', value: 'Søndag'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tidspunkt',
      title: 'Tidspunkt (fx "15:00")',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'holdtype',
      title: 'Holdtype',
      type: 'string',
      options: {
        list: [
          {title: 'Trækhold', value: 'Trækhold'},
          {title: 'Mor og barn', value: 'Mor og barn'},
          {title: 'Begynder', value: 'Begynder'},
          {title: 'Let øvede', value: 'Let øvede'},
          {title: 'Øvede', value: 'Øvede'},
          {title: 'Cavaletti og bom', value: 'Cavaletti og bom'},
          {title: 'Springhold', value: 'Springhold'},
          {title: 'Parthold', value: 'Parthold'},
          {title: 'Dressur', value: 'Dressur'},
          {title: 'Begynder og let øvede', value: 'Begynder og let øvede'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'varighed',
      title: 'Varighed (fx "45 min")',
      type: 'string',
    }),
    defineField({
      name: 'aktiv',
      title: 'Aktivt hold',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sorteringsorden',
      title: 'Sorteringsorden',
      type: 'number',
    }),
  ],
  preview: {
    select: {ugedag: 'ugedag', tidspunkt: 'tidspunkt', holdtype: 'holdtype'},
    prepare({ugedag, tidspunkt, holdtype}) {
      return {
        title: `${ugedag} ${tidspunkt}`,
        subtitle: holdtype,
      }
    },
  },
})
