-- Add geolocation columns to tap_analytics for client-side location capture
alter table public.tap_analytics
  add column if not exists latitude  double precision,
  add column if not exists longitude double precision;
