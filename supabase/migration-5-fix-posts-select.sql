-- Migration 5: ROOT CAUSE-fix for "new row violates RLS for posts".
-- posts_select brugte can_see_post(id), som selv laver "select ... from posts"
-- -> selv-rekursion på posts-tabellen. Det fejlede ved INSERT ... RETURNING
-- (appens .select() efter insert). Reads så ofte ud til at virke, men det
-- var skrøbeligt. Fix: inline synligheds-logikken på rækkens EGNE kolonner,
-- så reglen ikke kalder en funktion der re-spørger posts.
-- can_see_post beholdes uændret til comments_select (den spørger posts, ikke comments).

drop policy if exists posts_select on posts;

create policy posts_select on posts for select to authenticated using (
  public.is_approved() and (
    posts.scope = 'all'
    or posts.author_id = public.current_member_id()
    or (posts.scope = 'direct' and exists(
          select 1 from post_recipients pr
          where pr.post_id = posts.id and pr.member_id = public.current_member_id()))
    or (posts.scope = 'hold' and exists(
          select 1 from hold_members hm
          where hm.hold_id = posts.hold_id and hm.member_id = public.current_member_id()))
    or (posts.scope = 'hold' and exists(
          select 1 from hold_members hm
          join guardians g on g.child_id = hm.member_id and g.status = 'approved'
          where hm.hold_id = posts.hold_id and g.guardian_id = public.current_member_id()))
  )
);
