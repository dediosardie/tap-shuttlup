-- Persist selected card mode on each NFC card row.
alter table public.nfc_cards
  add column if not exists mode_type text
  check (mode_type in ('personal','corporate','driver','fleet','investor'));

-- Backfill existing rows.
update public.nfc_cards
set mode_type = 'fleet'
where mode_type is null;

-- Enforce default and not-null for future rows.
alter table public.nfc_cards
  alter column mode_type set default 'fleet';

alter table public.nfc_cards
  alter column mode_type set not null;
