import {defineField, defineType} from 'sanity'

export const underviserType = defineType({
  name: 'underviser',
  title: 'Underviser',
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
      title: 'Billede (valgfrit)',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'titel',
      title: 'Titel (fx "Springtræner")',
      type: 'string',
    }),
    defineField({
      name: 'beskrivelse',
      title: 'Beskrivelse',
      type: 'text',
    }),
    defineField({
      name: 'undervisningsdage',
      title: 'Undervisningsdage',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'telefon',
      title: 'Telefon',
      type: 'string',
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
    select: {title: 'navn', subtitle: 'titel', media: 'billede'},
  },
})
