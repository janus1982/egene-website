import {defineField, defineType} from 'sanity'

export const championatResultatType = defineType({
  name: 'championatResultat',
  title: 'Championat: resultat',
  type: 'document',
  fields: [
    defineField({
      name: 'saeson',
      title: 'Sæson',
      type: 'reference',
      to: [{type: 'championatSaeson'}],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'rytter', title: 'Rytter', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'hest', title: 'Hest', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'kategori',
      title: 'Kategori',
      type: 'string',
      options: {list: ['Pony spring', 'Hest spring']},
      validation: (r) => r.required(),
    }),
    defineField({name: 'staevne_navn', title: 'Stævnenavn', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'staevne_dato', title: 'Stævnedato', type: 'date', validation: (r) => r.required()}),
    defineField({
      name: 'staevne_type',
      title: 'Stævnetype',
      type: 'string',
      options: {list: ['Klub', 'Distrikt', 'Lands', 'International']},
      validation: (r) => r.required(),
    }),
    defineField({name: 'klasse_navn', title: 'Klassenavn (fx "LC25", "S**")', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'klasse_gruppe',
      title: 'Klassegruppe',
      type: 'string',
      options: {list: ['E og D-klasser', 'C-klasser', 'B-klasser', 'A-klasser (internat.)']},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'svaerhedsgrad',
      title: 'Sværhedsgrad',
      type: 'string',
      options: {list: ['LE/LD/LC', 'LB*/LB**', 'LA*/LA**', 'MB*/MB**', 'MA*/MA**', 'S*/S**', 'S***/S****']},
      validation: (r) => r.required(),
    }),
    defineField({name: 'placering', title: 'Placering (tom hvis ingen)', type: 'number'}),
    defineField({name: 'er_ovrige', title: 'Øvrige (placering over 5)', type: 'boolean', initialValue: false}),
    defineField({name: 'fejlfri_b0', title: 'Fejlfri B0', type: 'boolean', initialValue: false}),
    defineField({name: 'stilspring_karakter', title: 'Stilspringskarakter (fx 8.5)', type: 'number'}),
    defineField({name: 'beregnede_point', title: 'Beregnede point (udfyldes automatisk)', type: 'number', readOnly: true}),
    defineField({
      name: 'kilde',
      title: 'Kilde',
      type: 'string',
      options: {list: ['Equipe (automatisk)', 'Manuel indberetning']},
      initialValue: 'Manuel indberetning',
    }),
    defineField({name: 'equipe_start_id', title: 'Equipe start-ID (til deduplikering)', type: 'number'}),
    defineField({name: 'noter', title: 'Noter', type: 'text'}),
  ],
  preview: {
    select: {rytter: 'rytter', hest: 'hest', staevne: 'staevne_navn', point: 'beregnede_point'},
    prepare({rytter, hest, staevne, point}) {
      return {
        title: `${rytter} / ${hest}`,
        subtitle: `${point ?? 0} point · Stævne: ${staevne}`,
      }
    },
  },
})
