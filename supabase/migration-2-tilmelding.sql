-- Migration 2: tilmeldingsformular (CO trin 2)
-- Køres i Supabase SQL Editor.

-- Fritekst ved tilmelding: forælder kan angive barnets navn, så Helle kan
-- oprette/godkende guardian-relationen ved godkendelsen.
alter table members add column if not exists signup_note text;
