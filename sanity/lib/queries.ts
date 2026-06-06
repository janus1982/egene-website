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
