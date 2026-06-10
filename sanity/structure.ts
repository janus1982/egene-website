import type {StructureResolver} from 'sanity/structure'

// Menustruktur i Sanity Studio
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Egene Rideklub')
    .items([
      S.documentTypeListItem('hold').title('Holdoversigt'),
      S.documentTypeListItem('underviser').title('Undervisere'),
      S.documentTypeListItem('pony').title('Ponyer & heste'),
      S.documentTypeListItem('nyhed').title('Nyheder'),
      S.divider(),
      S.listItem()
        .title('Championat')
        .child(
          S.list()
            .title('Championat')
            .items([
              S.documentTypeListItem('championatSaeson').title('Sæsoner'),
              S.documentTypeListItem('championatResultat').title('Resultater'),
              S.documentTypeListItem('championatHistorik').title('Historik (tidligere år)'),
            ])
        ),
    ])
