-- Migration 6: endelig fix for posts-synlighed uden rekursion.
-- Problem: posts_select slog op i post_recipients/hold_members, hvis egne
-- policies slår op i posts -> uendelig rekursion. Desuden fejlede den
-- oprindelige can_see_post(id) ved INSERT ... RETURNING, fordi den re-spurgte
-- posts efter den nye rækkes id (synligheds-timing).
--
-- Løsning: én SECURITY DEFINER-funktion der får rækkens egne felter som
-- parametre (re-spørger IKKE posts) og laver de øvrige opslag som definer
-- (bypasser RLS på post_recipients/hold_members -> ingen rekursion).

create or replace function public.kan_se_opslag(p_scope text, p_author uuid, p_hold uuid, p_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_approved() and (
    p_scope = 'all'
    or p_author = public.current_member_id()
    or (p_scope = 'direct' and exists(
          select 1 from post_recipients pr
          where pr.post_id = p_id and pr.member_id = public.current_member_id()))
    or (p_scope = 'hold' and exists(
          select 1 from hold_members hm
          where hm.hold_id = p_hold and hm.member_id = public.current_member_id()))
    or (p_scope = 'hold' and exists(
          select 1 from hold_members hm
          join guardians g on g.child_id = hm.member_id and g.status = 'approved'
          where hm.hold_id = p_hold and g.guardian_id = public.current_member_id()))
  )
$$;

drop policy if exists posts_select on posts;

create policy posts_select on posts for select to authenticated using (
  public.kan_se_opslag(scope, author_id, hold_id, id)
);
