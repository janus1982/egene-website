// Sender en test-push til ALLE gemte abonnementer (også dig selv).
// Kør med:  node scripts/test-push.mjs
// Læser CRON_SECRET fra .env.local og kalder det live endpoint.

import { readFileSync } from "fs";

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
    let v = l.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    env[l.slice(0, i).trim()] = v;
  }
  return env;
}

const env = laesEnv();
const res = await fetch("https://egene-website.vercel.app/api/push/send-test", {
  headers: { Authorization: `Bearer ${env.CRON_SECRET}` },
});
console.log(await res.json());
