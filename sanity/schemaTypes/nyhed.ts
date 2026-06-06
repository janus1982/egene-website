import {defineArrayMember, defineField, defineType} from 'sanity'

export const nyhedType = defineType({
  name: 'nyhed',
  title: 'Nyhed',
  type: 'document',
  fields: [
    defineField({
      name: 'titel',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'billede',
      title: 'Billede',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tekst',
      title: 'Tekst',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'dato',
      title: 'Dato',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'synlig',
      title: 'Synlig på hjemmesiden',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Nyeste først',
      name: 'datoDesc',
      by: [{field: 'dato', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'titel', subtitle: 'dato', media: 'billede'},
  },
})
