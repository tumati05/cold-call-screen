-- Run this in the Supabase SQL editor.
create extension if not exists "pgcrypto";

create table if not exists calls (
  id uuid primary key default gen_random_uuid(),
  prospect_label text not null default 'Unnamed prospect',
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  outcome text check (outcome in ('meeting_booked','callback','interested','not_interested','no_decision','hung_up','wrong_person')),
  last_stage int not null default 1,
  summary text
);

create table if not exists stage_results (
  id uuid primary key default gen_random_uuid(),
  call_id uuid not null references calls(id) on delete cascade,
  stage_no int not null check (stage_no between 1 and 8),
  happened text,            -- the tapped option for what happened
  prospect_words text,      -- what the prospect actually said
  created_at timestamptz not null default now(),
  unique (call_id, stage_no)
);

create index if not exists stage_results_call_idx on stage_results(call_id);
create index if not exists calls_started_idx on calls(started_at desc);

-- Backend uses the service-role key, so lock the tables from the public anon key.
alter table calls enable row level security;
alter table stage_results enable row level security;
