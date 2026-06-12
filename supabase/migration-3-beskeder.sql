-- Migration 3: guardian-administration, navne og beskeder (CO trin 3-5)
-- Køres i Supabase SQL Editor.

-- Admin (Helle) kan oprette guardian-relationer direkte som godkendte
-- (bruges når hun kobler forælder og barn ved godkendelsen)
create policy guardians_admin_insert on guardians for insert to authenticated
  with check (my_role() = 'admin');

-- Godkendte medlemmer kan se andre GODKENDTE medlemmer (navn/rolle).
-- Nødvendigt for afsendernavne på opslag og modtagervalg ved beskeder.
-- Pending-medlemmer ser fortsat intet.
create policy members_select_approved on members for select to authenticated
  using (is_approved() and status = 'approved');
