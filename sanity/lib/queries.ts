import {client} from './client'

// ---- GROQ-forespørgsler ----

const PONYER_QUERY = `*[_type == "pony"] | order(sorteringsorden asc){
  _id, navn, beskrivelse, billede
}`

const UNDERVISERE_QUERY = `*[_type == "underviser"] | order(sorteringsorden asc){
  _id, navn, titel, beskrivelse, undervisningsdage, email, telefon, billede
}`

const NYHEDER_QUERY = `*[_type == "nyhed" && synlig == true] | order(dato desc)[0...$antal]{
  _id, titel, tekst, dato, billede
}`

const HOLD_QUERY = `*[_type == "hold" && aktiv == true] | order(ugedag asc, sorteringsorden asc){
  _id, ugedag, tidspunkt, holdtype, varighed, sorteringsorden
}`

// Fælles indstilling: hent friske data hvert 60. sekund
const options = {next: {revalidate: 60}}

// ---- Hjælpefunktioner ----

export async function getPonyer() {
  return client.fetch(PONYER_QUERY, {}, options)
}

export async function getUndervisere() {
  return client.fetch(UNDERVISERE_QUERY, {}, options)
}

export async function getNyheder(antal = 6) {
  return client.fetch(NYHEDER_QUERY, {antal}, options)
}

export async function getHold() {
  return client.fetch(HOLD_QUERY, {}, options)
}

// ---- Webshop ----

const PRODUKTER_QUERY = `*[_type == "produkt"] | order(sorteringsorden asc){
  _id, navn, beskrivelse, pris, stoerrelser, paaLager, billede
}`

export async function getProdukter() {
  return client.fetch(PRODUKTER_QUERY, {}, options)
}

// ---- Championat ----

const AKTIV_SAESON_QUERY = `*[_type == "championatSaeson" && aktiv == true][0]{_id, aar}`

const RESULTATER_QUERY = `*[_type == "championatResultat" && saeson._ref == $saesonId]{
  rytter, hest, kategori, beregnede_point
}`

// Opdateres maks én gang i timen
const championatOptions = {next: {revalidate: 3600}}

export async function getChampionat() {
  const saeson = await client.fetch(AKTIV_SAESON_QUERY, {}, championatOptions)
  if (!saeson) return {saeson: null, resultater: []}
  const resultater = await client.fetch(RESULTATER_QUERY, {saesonId: saeson._id}, championatOptions)
  return {saeson, resultater}
}
