-- Allow anonymous/public reads for NFC tap resolution and public profile pages.
-- Without these policies, unauthenticated mobile NFC scans receive no data
-- because the initial schema only has owner-write RLS policies.

-- Public profiles: any user can read any profile (profile page is public)
drop policy if exists "profiles_select_public_or_owner" on public.profiles;
create policy "profiles_select_public" on public.profiles
  for select using (true);

-- Active NFC cards: anonymous users need to resolve shortcodes
create policy "nfc_cards_select_public" on public.nfc_cards
  for select using (is_active = true);

-- Social links: public profile pages show social links
create policy "social_links_select_public" on public.social_links
  for select using (true);

-- Fleet info: public profile pages show fleet info
create policy "fleet_info_select_public" on public.fleet_info
  for select using (true);

-- Tap modes: public profile pages may show active mode info
create policy "tap_modes_select_public" on public.tap_modes
  for select using (true);
