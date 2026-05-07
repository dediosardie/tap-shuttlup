-- Add settings JSONB column to profiles for persistent user settings
alter table public.profiles
  add column if not exists settings jsonb default null;
