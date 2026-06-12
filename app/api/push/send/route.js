// Push ved nyt opslag. Klienten sender KUN post_id - serveren slår selv op:
//   scope 'all'    -> alle godkendte medlemmer
//   scope 'hold'   -> holdets medlemmer + godkendte guardians for mindreårige
//   scope 'direct' -> modtagerlisten (inkl. auto-tilføjede guardians fra triggeren)
// Sikkerhed: kalderen skal være opslagets forfatter (verificeret via Supabase-token).

import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

export const runtime = "nodejs";

export async function POST(request) {
  const token = (request.headers.get("authorization") || "").replace("Bearer ", "");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const { post_id } = await request.json().catch(() => ({}));
  if (!post_id) return Response.json({ ok: false, fejl: "post_id mangler" });

  // Hvem kalder?
  const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: bruger, error: authFejl } = await anon.auth.getUser(token);
  if (authFejl || !bruger?.user) return new Response("Unauthorized", { status: 401 });

  const service = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Opslaget + forfatter-tjek
  const { data: post } = await service
    .from("posts")
    .select("id, club_id, author_id, scope, hold_id, body")
    .eq("id", post_id)
    .maybeSingle();
  if (!post) return Response.json({ ok: false, fejl: "Opslag ikke fundet" });

  const { data: forfatter } = await service
    .from("members")
    .select("id, auth_user_id")
    .eq("id", post.author_id)
    .maybeSingle();
  if (!forfatter || forfatter.auth_user_id !== bruger.user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  // Beregn modtagerkredsen
  let modtagerIds = [];
  if (post.scope === "all") {
    const { data } = await service.from("members").select("id").eq("status", "approved").eq("club_id", post.club_id);
    modtagerIds = (data ?? []).map((m) => m.id);
  } else if (post.scope === "hold" && post.hold_id) {
    const { data: hm } = await service.from("hold_members").select("member_id").eq("hold_id", post.hold_id);
    const holdIds = (hm ?? []).map((x) => x.member_id);
    modtagerIds = [...holdIds];
    if (holdIds.length) {
      const { data: g } = await service
        .from("guardians")
        .select("guardian_id, child_id")
        .eq("status", "approved")
        .in("child_id", holdIds);
      modtagerIds.push(...(g ?? []).map((x) => x.guardian_id));
    }
  } else if (post.scope === "direct") {
    const { data: pr } = await service.from("post_recipients").select("member_id").eq("post_id", post.id);
    modtagerIds = (pr ?? []).map((x) => x.member_id);
  }
  // Forfatteren behøver ikke selv en notifikation
  modtagerIds = [...new Set(modtagerIds)].filter((id) => id !== post.author_id);
  if (!modtagerIds.length) return Response.json({ ok: true, sendt: 0 });

  // Klubnavn til titlen (template-disciplin)
  const { data: klub } = await service.from("clubs").select("name").eq("id", post.club_id).maybeSingle();

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:kontakt@example.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const { data: subs } = await service
    .from("push_subscriptions")
    .select("id, subscription")
    .in("member_id", modtagerIds);

  const payload = JSON.stringify({
    title: klub?.name || "Nyt opslag",
    body: String(post.body).slice(0, 120),
    url: "/platform",
  });

  let sendt = 0;
  for (const s of subs ?? []) {
    try {
      await webpush.sendNotification(s.subscription, payload);
      sendt++;
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) {
        await service.from("push_subscriptions").delete().eq("id", s.id);
      }
    }
  }

  return Response.json({ ok: true, modtagere: modtagerIds.length, sendt });
}
