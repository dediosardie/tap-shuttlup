-- Align tap_profile_metrics counters with event source rules
-- total_taps: NFC only
-- qr_scans: QR source events
-- total_saves: tap_saves inserts

create or replace view public.tap_profile_metrics as
select
  p.id as profile_id,
  p.username,
  p.full_name,
  coalesce(tap_totals.total_taps, 0) as total_taps,
  coalesce(view_totals.total_views, 0) as total_views,
  coalesce(save_totals.total_saves, 0) as total_saves,
  coalesce(qr_totals.qr_scans, 0) as qr_scans
from public.profiles p
left join (
  select c.profile_id, sum(c.tap_count) as total_taps
  from public.nfc_cards c
  group by c.profile_id
) tap_totals on tap_totals.profile_id = p.id
left join (
  select c.profile_id, count(*) as total_views
  from public.tap_analytics a
  join public.nfc_cards c on c.id = a.card_id
  group by c.profile_id
) view_totals on view_totals.profile_id = p.id
left join (
  select s.profile_id, count(*) as total_saves
  from public.tap_saves s
  group by s.profile_id
) save_totals on save_totals.profile_id = p.id
left join (
  select c.profile_id, count(*)::numeric as qr_scans
  from public.tap_analytics a
  join public.nfc_cards c on c.id = a.card_id
  where lower(coalesce(a.referrer, '')) = 'qr'
  group by c.profile_id
) qr_totals on qr_totals.profile_id = p.id;

create or replace function public.tap_weekly_activity(p_profile_id uuid)
returns table (
  day date,
  taps bigint,
  views bigint
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
      and lower(coalesce(a.referrer, '')) in ('tap', 'nfc')
    group by date(a.created_at)
  ) tap_day on tap_day.day = d.day
  left join (
    select date(a.created_at) as day, count(*) as views
    from public.tap_analytics a
    join public.nfc_cards c on c.id = a.card_id
    where c.profile_id = p_profile_id
    group by date(a.created_at)
  ) view_day on view_day.day = d.day
  order by d.day;
$$;
