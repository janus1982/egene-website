-- =====================================================================
-- Egene Medlemsplatform - skema, trigger og RLS (CO 11/6-2026, Fase 1)
-- Køres i Supabase: SQL Editor -> New query -> indsæt alt -> Run
-- =====================================================================

-- ---------- Tabeller (CO §5) ----------

create table clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  branding jsonb not null,
  modules jsonb not null
);

create table members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id),
  auth_user_id uuid unique references auth.users(id),
  full_name text not null,
  email text not null,
  role text not null check (role in ('admin','beridder','underviser','medlem','guardian')),
  tags text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending','approved','archived')),
  is_minor boolean not null default false,
  created_at timestamptz default now()
);

create table guardians (
  guardian_id uuid not null references members(id),
  child_id uuid not null references members(id),
  status text not null default 'pending' check (status in ('pending','approved')),
  primary key (guardian_id, child_id)
);

create table holds (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id),
  name text not null
);

create table hold_members (
  hold_id uuid not null references holds(id),
  member_id uuid not null references members(id),
  primary key (hold_id, member_id)
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id),
  author_id uuid not null references members(id),
  scope text not null check (scope in ('all','hold','direct')),
  hold_id uuid references holds(id),
  body text not null,
  created_at timestamptz default now()
);

create table post_recipients (
  post_id uuid not null references posts(id),
  member_id uuid not null references members(id),
  primary key (post_id, member_id)
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id),
  author_id uuid not null references members(id),
  body text not null,
  created_at timestamptz default now()
);

create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id),
  subscription jsonb not null,
  created_at timestamptz default now()
);

-- ---------- Hjælpefunktioner (bruges af RLS) ----------

create or replace function current_member_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from members where auth_user_id = auth.uid()
$$;

create or replace function my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from members where auth_user_id = auth.uid() and status = 'approved'
$$;

create or replace function is_approved() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from members where auth_user_id = auth.uid() and status = 'approved')
$$;

-- Kan jeg se dette opslag? (governance-regel samlet ét sted)
create or replace function can_see_post(pid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from posts p
    where p.id = pid
      and is_approved()
      and (
        p.scope = 'all'
        or p.author_id = current_member_id()
        or (p.scope = 'direct' and exists(
              select 1 from post_recipients pr
              where pr.post_id = p.id and pr.member_id = current_member_id()))
        or (p.scope = 'hold' and exists(
              select 1 from hold_members hm
              where hm.hold_id = p.hold_id and hm.member_id = current_member_id()))
        -- guardians ser deres barns hold-opslag
        or (p.scope = 'hold' and exists(
              select 1 from hold_members hm
              join guardians g on g.child_id = hm.member_id and g.status = 'approved'
              where hm.hold_id = p.hold_id and g.guardian_id = current_member_id()))
      )
  )
$$;

-- ---------- Trigger: guardians inkluderes ALTID ved direkte besked til barn ----------
-- (CO-governance: ligger i databasen, ikke i frontend)

create or replace function inkluder_guardians() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into post_recipients (post_id, member_id)
  select new.post_id, g.guardian_id
  from members m
  join guardians g on g.child_id = m.id and g.status = 'approved'
  where m.id = new.member_id and m.is_minor = true
  on conflict do nothing;
  return new;
end;
$$;

create trigger trg_inkluder_guardians
after insert on post_recipients
for each row execute function inkluder_guardians();

-- ---------- Row Level Security ----------

alter table clubs enable row level security;
alter table members enable row level security;
alter table guardians enable row level security;
alter table holds enable row level security;
alter table hold_members enable row level security;
alter table posts enable row level security;
alter table post_recipients enable row level security;
alter table comments enable row level security;
alter table push_subscriptions enable row level security;

-- clubs: alle indloggede kan læse branding/konfiguration
create policy clubs_select on clubs for select to authenticated using (true);

-- members: egen række + admin ser alle
create policy members_select_own on members for select to authenticated
  using (auth_user_id = auth.uid() or my_role() = 'admin');
-- selvbetjent tilmelding: man kan kun oprette sig selv, som pending, i begrænsede roller
create policy members_insert_self on members for insert to authenticated
  with check (auth_user_id = auth.uid() and status = 'pending' and role in ('medlem','guardian'));
-- kun admin kan godkende/ændre
create policy members_update_admin on members for update to authenticated
  using (my_role() = 'admin');

-- guardians: parterne ser relationen; guardian kan ANMODE (pending); admin godkender
create policy guardians_select on guardians for select to authenticated
  using (guardian_id = current_member_id() or child_id = current_member_id() or my_role() = 'admin');
create policy guardians_request on guardians for insert to authenticated
  with check (guardian_id = current_member_id() and status = 'pending');
create policy guardians_update_admin on guardians for update to authenticated
  using (my_role() = 'admin');

-- holds: godkendte ser hold; admin administrerer
create policy holds_select on holds for select to authenticated using (is_approved());
create policy holds_admin_ins on holds for insert to authenticated with check (my_role() = 'admin');
create policy holds_admin_upd on holds for update to authenticated using (my_role() = 'admin');
create policy hold_members_select on hold_members for select to authenticated using (is_approved());
create policy hold_members_admin on hold_members for insert to authenticated with check (my_role() = 'admin');
create policy hold_members_admin_del on hold_members for delete to authenticated using (my_role() = 'admin');

-- posts: synlighed via can_see_post; skriverettigheder pr. scope (CO §3.2)
create policy posts_select on posts for select to authenticated using (can_see_post(id));
create policy posts_insert on posts for insert to authenticated
  with check (
    author_id = current_member_id()
    and (
      (scope = 'all' and my_role() in ('admin','beridder'))
      or (scope in ('hold','direct') and my_role() in ('admin','beridder','underviser','guardian'))
    )
  );

-- post_recipients: afsender tilføjer modtagere; modtager/afsender kan se
create policy pr_select on post_recipients for select to authenticated
  using (member_id = current_member_id()
         or exists(select 1 from posts p where p.id = post_id and p.author_id = current_member_id()));
create policy pr_insert on post_recipients for insert to authenticated
  with check (exists(select 1 from posts p where p.id = post_id and p.author_id = current_member_id()));

-- comments: alle godkendte kan SVARE på opslag de kan se (børn kan svare, ikke initiere)
create policy comments_select on comments for select to authenticated using (can_see_post(post_id));
create policy comments_insert on comments for insert to authenticated
  with check (is_approved() and author_id = current_member_id() and can_see_post(post_id));

-- push_subscriptions: kun egne
create policy push_own_sel on push_subscriptions for select to authenticated using (member_id = current_member_id());
create policy push_own_ins on push_subscriptions for insert to authenticated with check (member_id = current_member_id());
create policy push_own_del on push_subscriptions for delete to authenticated using (member_id = current_member_id());

-- ---------- Seed: klubkonfiguration (template-disciplin: navnet bor HER) ----------

insert into clubs (name, slug, branding, modules) values (
  'Egene Rideklub',
  'egene',
  '{"farve": "#14532d", "logo": "/logo.png"}',
  '{"communication": true, "championat": true, "webshop": true}'
);

-- =====================================================================
-- EFTER FØRSTE LOGIN (tynd skive): kør dette med din egen mail indsat.
-- Det opretter dig som godkendt admin og lægger ét testopslag på væggen.
-- =====================================================================
-- insert into members (club_id, auth_user_id, full_name, email, role, status)
-- select c.id, u.id, 'Janus Fabricius Kierkegaard', u.email, 'admin', 'approved'
-- from clubs c, auth.users u
-- where c.slug = 'egene' and u.email = 'DIN-MAIL-HER';
--
-- insert into posts (club_id, author_id, scope, body)
-- select m.club_id, m.id, 'all', 'Velkommen til Egene-væggen! Dette er det første opslag.'
-- from members m where m.role = 'admin' limit 1;
