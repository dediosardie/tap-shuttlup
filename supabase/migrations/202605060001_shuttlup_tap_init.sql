-- ShuttlUp Tap initial schema

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  username text not null unique,
  full_name text not null,
  position text,
  company text,
  bio text,
  avatar_url text,
  verified boolean not null default false,
  theme text not null default 'obsidian',
  created_at timestamptz not null default now()
);

create table if not exists public.tap_modes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  mode_name text not null,
  mode_type text not null check (mode_type in ('personal','corporate','driver','fleet','investor')),
  is_default boolean not null default false
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null,
  url text not null,
  icon text,
  unique(profile_id, platform)
);

create table if not exists public.nfc_cards (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  uid text not null,
  shortcode text not null unique,
  is_active boolean not null default true,
  tap_count bigint not null default 0,
  created_at timestamptz not null default now(),
  unique(uid)
);

create table if not exists public.tap_analytics (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.nfc_cards(id) on delete cascade,
  ip_address inet,
  device text,
  browser text,
  os text,
  country text,
  city text,
  referrer text,
  created_at timestamptz not null default now()
);

create table if not exists public.fleet_info (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_type text,
  plate_number text,
  operator_id text,
  verified boolean not null default false,
  unique(profile_id)
);

alter table public.profiles enable row level security;
alter table public.tap_modes enable row level security;
alter table public.social_links enable row level security;
alter table public.nfc_cards enable row level security;
alter table public.tap_analytics enable row level security;
alter table public.fleet_info enable row level security;

create policy "profiles_select_public_or_owner" on public.profiles
for select using (verified = true or auth.uid() = user_id);

create policy "profiles_owner_write" on public.profiles
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "tap_modes_owner_rw" on public.tap_modes
for all using (
  exists(select 1 from public.profiles p where p.id = tap_modes.profile_id and p.user_id = auth.uid())
)
with check (
  exists(select 1 from public.profiles p where p.id = tap_modes.profile_id and p.user_id = auth.uid())
);

create policy "social_links_owner_rw" on public.social_links
for all using (
  exists(select 1 from public.profiles p where p.id = social_links.profile_id and p.user_id = auth.uid())
)
with check (
  exists(select 1 from public.profiles p where p.id = social_links.profile_id and p.user_id = auth.uid())
);

create policy "nfc_cards_owner_rw" on public.nfc_cards
for all using (
  exists(select 1 from public.profiles p where p.id = nfc_cards.profile_id and p.user_id = auth.uid())
)
with check (
  exists(select 1 from public.profiles p where p.id = nfc_cards.profile_id and p.user_id = auth.uid())
);

create policy "tap_analytics_owner_read" on public.tap_analytics
for select using (
  exists(
    select 1 from public.nfc_cards c
    join public.profiles p on p.id = c.profile_id
    where c.id = tap_analytics.card_id and p.user_id = auth.uid()
  )
);

create policy "tap_analytics_insert_service" on public.tap_analytics
for insert with check (true);

create policy "fleet_info_owner_rw" on public.fleet_info
for all using (
  exists(select 1 from public.profiles p where p.id = fleet_info.profile_id and p.user_id = auth.uid())
)
with check (
  exists(select 1 from public.profiles p where p.id = fleet_info.profile_id and p.user_id = auth.uid())
);

create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_nfc_cards_shortcode on public.nfc_cards(shortcode);
create index if not exists idx_tap_analytics_card_created on public.tap_analytics(card_id, created_at desc);
