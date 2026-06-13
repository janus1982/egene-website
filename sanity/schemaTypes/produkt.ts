import {defineField, defineType} from 'sanity'

export const produktType = defineType({
  name: 'produkt',
  title: 'Produkt (webshop)',
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
        }),
      ],
    }),
    defineField({
      name: 'beskrivelse',
      title: 'Beskrivelse',
      type: 'text',
    }),
    defineField({
      name: 'pris',
      title: 'Pris (kr.)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'stoerrelser',
      title: 'Størrelser',
      description: 'Klik for at vælge de størrelser produktet fås i. Lad stå tom hvis produktet ikke har størrelser (fx muleposer)',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'grid',
        list: [
          {title: 'XS', value: 'XS'},
          {title: 'S', value: 'S'},
          {title: 'M', value: 'M'},
          {title: 'L', value: 'L'},
          {title: 'XL', value: 'XL'},
          {title: 'XXL', value: 'XXL'},
          {title: 'One size', value: 'One size'},
        ],
      },
    }),
    defineField({
      name: 'paaLager',
      title: 'På lager',
      type: 'boolean',
      initialValue: true,
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
    select: {title: 'navn', subtitle: 'pris', media: 'billede'},
    prepare({title, subtitle, media}) {
      return {title, subtitle: subtitle ? `${subtitle} kr.` : '', media}
    },
  },
})
