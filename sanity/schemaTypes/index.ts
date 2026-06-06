import { type SchemaTypeDefinition } from 'sanity'

import {ponyType} from './pony'
import {underviserType} from './underviser'
import {nyhedType} from './nyhed'
import {holdType} from './hold'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [holdType, underviserType, ponyType, nyhedType],
}
