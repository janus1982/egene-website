import {defineField, defineType} from 'sanity'

export const ponyType = defineType({
  name: 'pony',
  title: 'Pony / hest',
  type: 'document',
  fields: [
    defineField({
      name: 'navn',
      title: 'Navn',
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
          title: 'Alt-tekst (beskrivelse for skærmlæsere)',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'beskrivelse',
      title: 'Beskrivelse',
      type: 'text',
    }),
    defineField({
      name: 'sorteringsorden',
      title: 'Sorteringsorden',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Sorteringsorden',
      name: 'sorteringsorden',
      by: [{field: 'sorteringsorden', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'navn', media: 'billede'},
  },
})
