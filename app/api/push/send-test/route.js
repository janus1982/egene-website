// Sender en test-push til ALLE gemte subscriptions.
// Bruges til acceptkriteriet: opslag -> push på fysisk iPhone inden 30 sek.
// Lokalt: åben i browser. Live: kræver Bearer CRON_SECRET (genbruger eksisterende mønster).

import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

export const runtime = "nodejs";

export async function GET(request) {
  const erProduktion = process.env.NODE_ENV === "production";
  if (erProduktion && request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:kontakt@egene.dk",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  // Service role-klient (kun server-side!) - læser alle subscriptions udenom RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: subs, error } = await supabase.from("push_subscriptions").select("id, subscription");
  if (error) return Response.json({ ok: false, fejl: error.message });

  const payload = JSON.stringify({
    title: "Egene-væggen",
    body: "Test: push-notifikationer virker!",
    url: "/platform",
  });

  let sendt = 0;
  let fejlede = 0;
  for (const s of subs ?? []) {
    try {
      await webpush.sendNotification(s.subscription, payload);
      sendt++;
    } catch (e) {
      fejlede++;
      // 404/410 = subscription er død (bruger har slået fra) -> ryd op
      if (e.statusCode === 404 || e.statusCode === 410) {
        await supabase.from("push_subscriptions").delete().eq("id", s.id);
      }
    }
  }

  return Response.json({ ok: true, subscriptions: subs?.length ?? 0, sendt, fejlede });
}
