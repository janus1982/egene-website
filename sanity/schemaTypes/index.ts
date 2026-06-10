import { type SchemaTypeDefinition } from 'sanity'

import {ponyType} from './pony'
import {underviserType} from './underviser'
import {nyhedType} from './nyhed'
import {holdType} from './hold'
import {championatSaesonType} from './championatSaeson'
import {championatResultatType} from './championatResultat'
import {championatHistorikType} from './championatHistorik'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    holdType,
    underviserType,
    ponyType,
    nyhedType,
    championatSaesonType,
    championatResultatType,
    championatHistorikType,
  ],
}
