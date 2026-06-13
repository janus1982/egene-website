-- Migration 4: genskab posts_insert-policy med skema-kvalificerede funktioner.
-- Symptom: insert i posts fejlede med RLS-violation, selvom betingelsen
-- evaluerede til true standalone. Årsag: uklar funktionsbinding i policy.
-- Løsning: drop + create med public.-præfiks på funktionskaldene.

drop policy if exists posts_insert on posts;

create policy posts_insert on posts for insert to authenticated
  with check (
    author_id = public.current_member_id()
    and (
      (scope = 'all' and public.my_role() in ('admin','beridder'))
      or (scope in ('hold','direct') and public.my_role() in ('admin','beridder','underviser','guardian'))
    )
  );
