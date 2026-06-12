// Genererer et login-link UDEN at sende mail (omgår Supabases mail-kvote).
// Bruger service role-nøglen fra .env.local - kør den KUN lokalt.
//
// Kør med:  node scripts/lav-login-link.mjs mail@eksempel.dk
// Kopiér linket der printes, og åbn det i browseren -> logget ind.
// Findes brugeren ikke, oprettes den automatisk (praktisk til testbrugere).

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Læs .env.local robust: håndtér både UTF-8 og UTF-16 (Windows) og citationstegn
function laesEnv() {
  const buf = readFileSync(".env.local");
  let tekst;
  if (buf[0] === 0xff && buf[1] === 0xfe) tekst = buf.toString("utf16le");
  else if (buf[0] === 0xfe && buf[1] === 0xff) tekst = buf.swap16().toString("utf16le");
  else tekst = buf.toString("utf8");
  tekst = tekst.replace(/^﻿/, "");
  const env = {};
  for (const linje of tekst.split(/\r?\n/)) {
    const l = linje.trim();
    if (!l || l.startsWith("#") || !l.includes("=")) continue;
    const i = l.indexOf("=");
    const noegle = l.slice(0, i).trim();
    let vaerdi = l.slice(i + 1).trim();
    if ((vaerdi.startsWith('"') && vaerdi.endsWith('"')) || (vaerdi.startsWith("'") && vaerdi.endsWith("'"))) {
      vaerdi = vaerdi.slice(1, -1);
    }
    env[noegle] = vaerdi;
  }
  return env;
}

const env = laesEnv();

const email = process.argv[2];
if (!email) {
  console.error("Brug: node scripts/lav-login-link.mjs mail@eksempel.dk");
  process.exit(1);
}

if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Kunne ikke finde de noedvendige noegler i .env.local.");
  console.error("Fundne noegler:", Object.keys(env).join(", ") || "(ingen)");
  console.error("Forventede: NEXT_PUBLIC_SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Send brugeren direkte til /platform efter login (skal stå i Supabase' Redirect URLs)
const REDIRECT = "https://egene-website.vercel.app/platform";

let { data, error } = await supabase.auth.admin.generateLink({
  type: "magiclink",
  email,
  options: { redirectTo: REDIRECT },
});

if (error && /not.*found|does not exist/i.test(error.message)) {
  console.log(`Brugeren findes ikke - opretter ${email}...`);
  const { error: opretFejl } = await supabase.auth.admin.createUser({ email, email_confirm: true });
  if (opretFejl) {
    console.error("FEJL ved oprettelse:", opretFejl.message);
    process.exit(1);
  }
  ({ data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: REDIRECT },
  }));
}

if (error) {
  console.error("FEJL:", error.message);
  process.exit(1);
}

console.log("\nLogin-link (aabn i browseren, virker kun een gang):\n");
console.log(data.properties?.action_link ?? data.action_link);
