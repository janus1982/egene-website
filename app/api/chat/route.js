import Anthropic from "@anthropic-ai/sdk";
import { EGENE_VIDEN } from "./viden";

export const runtime = "nodejs";

const client = new Anthropic(); // læser ANTHROPIC_API_KEY fra miljøet

const SYSTEM_PROMPT = `Du er en hjælpsom assistent for Egene Rideklub i Holte, Nordsjælland.
Du svarer kun på spørgsmål om Egene ud fra den viden du har nedenfor.
Svar altid på dansk. Vær venlig, kort og præcis.

Skriv i ren tekst uden formatering. Brug ALDRIG markdown — ingen stjerner (**), ingen
firkanter (#), ingen punktopstilling med bindestreger. Hvis du vil fremhæve noget, så skriv
det bare som almindelig tekst.

Henvis til den rigtige person:
- Spørgsmål om rideskolen (undervisning, hold, holdpriser, tilmelding, prøvetime): henvis til
  Martine Sandberg på rideskolen@egene.dk eller 2288 0707.
- Spørgsmål om opstaldning og Egene Ridecenter: henvis til Sigurd Nielsen på 27 14 01 33.
- Generelle spørgsmål: kontakt@egene.dk.
Hvis du ikke kender svaret, så henvis til den rigtige af ovenstående afhængigt af emnet.

VIDEN OM EGENE RIDEKLUB:
${EGENE_VIDEN}`;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Ugyldig forespørgsel", { status: 400 });
  }

  // Behold kun gyldige bruger/assistent-beskeder med tekstindhold
  const messages = Array.isArray(body?.messages)
    ? body.messages
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string" &&
            m.content.trim().length > 0
        )
        .map((m) => ({ role: m.role, content: m.content }))
    : [];

  if (messages.length === 0) {
    return new Response("Ingen beskeder", { status: 400 });
  }

  const stream = client.messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" }, // prompt caching af den faste viden
      },
    ],
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            "\n\nBeklager, der opstod en fejl. Skriv til kontakt@egene.dk eller ring til Sigurd på 27 14 01 33."
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
