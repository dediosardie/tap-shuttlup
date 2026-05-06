-- Shutt'L Up Tap: QR codes, profile views tracking, and helper views
-- Migration: 202605060002_shuttlup_tap_qr_views.sql

-- ── QR Codes table ──────────────────────────────────────────────────────────
create table if not exists public.tap_qr_codes (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  label       text,
  size        int not null default 320,
  color       text not null default 'F97316',
  bg_color    text not null default '121212',
  scan_count  bigint not null default 0,
  created_at  timestamptz not null default now(),
  unique(profile_id, label)
);

-- ── Profile view events ─────────────────────────────────────────────────────
create table if not exists public.tap_profile_views (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  ip_hash     text,           -- store a salted hash, never raw IP
  device      text,
  browser     text,
  os          text,
  country     text,
  referrer    text,
  source      text check (source in ('nfc', 'qr', 'direct', 'shared_link')),
  created_at  timestamptz not null default now()
);

-- ── Contact saves ───────────────────────────────────────────────────────────
create table if not exists public.tap_saves (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.tap_qr_codes      enable row level security;
alter table public.tap_profile_views enable row level security;
alter table public.tap_saves         enable row level security;

create policy "qr_codes_owner_rw" on public.tap_qr_codes
for all using (
  exists(select 1 from public.profiles p where p.id = tap_qr_codes.profile_id and p.user_id = auth.uid())
)
with check (
  exists(select 1 from public.profiles p where p.id = tap_qr_codes.profile_id and p.user_id = auth.uid())
);

create policy "profile_views_owner_read" on public.tap_profile_views
for select using (
  exists(select 1 from public.profiles p where p.id = tap_profile_views.profile_id and p.user_id = auth.uid())
);

create policy "profile_views_insert_public" on public.tap_profile_views
for insert with check (true);

create policy "saves_owner_read" on public.tap_saves
for select using (
  exists(select 1 from public.profiles p where p.id = tap_saves.profile_id and p.user_id = auth.uid())
);

create policy "saves_insert_public" on public.tap_saves
for insert with check (true);

-- ── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists idx_tap_qr_profile     on public.tap_qr_codes(profile_id);
create index if not exists idx_profile_views_pid  on public.tap_profile_views(profile_id, created_at desc);
create index if not exists idx_saves_profile      on public.tap_saves(profile_id, created_at desc);

-- ── Aggregated metrics view ───────────────────────────────────────────────
create or replace view public.tap_profile_metrics as
select
  p.id        as profile_id,
  p.username,
  p.full_name,
  coalesce(tap_totals.total_taps, 0)   as total_taps,
  coalesce(view_totals.total_views, 0) as total_views,
  coalesce(save_totals.total_saves, 0) as total_saves,
  coalesce(qr_totals.qr_scans, 0)      as qr_scans
from public.profiles p
left join (
  select c.profile_id, sum(c.tap_count) as total_taps
  from public.nfc_cards c
  group by c.profile_id
) tap_totals on tap_totals.profile_id = p.id
left join (
  select v.profile_id, count(*) as total_views
  from public.tap_profile_views v
  group by v.profile_id
) view_totals on view_totals.profile_id = p.id
left join (
  select s.profile_id, count(*) as total_saves
  from public.tap_saves s
  group by s.profile_id
) save_totals on save_totals.profile_id = p.id
left join (
  select q.profile_id, sum(q.scan_count) as qr_scans
  from public.tap_qr_codes q
  group by q.profile_id
) qr_totals on qr_totals.profile_id = p.id;

-- ── 7-day tap activity function ───────────────────────────────────────────
create or replace function public.tap_weekly_activity(p_profile_id uuid)
returns table (
  day         date,
  taps        bigint,
  views       bigint
)
language sql
stable
as $$
  with days as (
    select generate_series(
      (current_date - interval '6 days')::date,
      current_date,
      interval '1 day'
    )::date as day
  )
  select
    d.day,
    coalesce(tap_day.taps, 0) as taps,
    coalesce(view_day.views, 0) as views
  from days d
  left join (
    select date(a.created_at) as day, count(*) as taps
    from public.tap_analytics a
    join public.nfc_cards c on c.id = a.card_id
    where c.profile_id = p_profile_id
    group by date(a.created_at)
  ) tap_day on tap_day.day = d.day
  left join (
    select date(v.created_at) as day, count(*) as views
    from public.tap_profile_views v
    where v.profile_id = p_profile_id
    group by date(v.created_at)
  ) view_day on view_day.day = d.day
  order by d.day;
$$;
