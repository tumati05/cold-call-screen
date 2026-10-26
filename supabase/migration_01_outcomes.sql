-- ONLY for a database that was created with the first version of schema.sql
-- (outcomes meeting_booked, callback, hung_up, ...). Fresh databases do not need it.
-- Run this in the Supabase SQL editor.

-- 1. Remove the old test calls. Their outcome words no longer exist.
--    (stage_results rows go with them, by cascade.)
delete from calls;

-- 2. Swap the outcome rule for the nine words callers actually used.
alter table calls drop constraint if exists calls_outcome_check;
alter table calls add constraint calls_outcome_check check (outcome in (
  'agreed_to_receive_report','next_step_agreed','interested','follow_up',
  'call_again','not_interested','do_not_call','wrong_person','moved_company'));
