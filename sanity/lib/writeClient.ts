import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '../env'

// Skrive-klient til server-side (cron, admin). Kræver en write-token i miljøet.
// Bruges ALDRIG i browseren - kun i API-routes på serveren.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})
