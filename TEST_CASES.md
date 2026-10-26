# Call Screen: manual test cases and test data

Frontend: https://cold-call-screen-five.vercel.app (or http://localhost:5173). Backend: https://cold-call-screen-1its.onrender.com (or http://localhost:8080).
Render sleeps when idle, so the first request can take up to a minute. In Supabase, Table Editor, `calls` and `stage_results` show the "Stored" lines below.
Note: the Next button reads "Next: " followed by the next stage's full name.

## The eight stages and their buttons
1. Reach the right person: Right person confirmed · Front desk put me through · Wrong number or wrong person · Person has left the company · Language or bad line, call again
2. Introduce yourself and ask for time: Gave me time · Asked me to call back later · Asked who we are again · Busy, driving or in a meeting · Hung up or refused
3. Give the reason for the call: Reason heard · Asked what the report or profile is · Questioned where we got the number · Said they did not ask for it · Declined, not interested
4. Explain who you are and the offer: Understood the offer · Asked about cost · Asked what we do or who else we have worked with · Doubts our motive · Wants website or sample first
5. Ask about their growth: Answered the questions · Named a goal or an obstacle · Said they cannot share · Said everything is fine · Said it is not their area
6. Handle the push-back: Gave a name or referral · Already has consultants or an in-house team · Not the decision maker · Not interested · Door still open
7. Ask to send the report: Agreed: WhatsApp · Agreed: email · Wants company profile or sample first · Gave a different number or address · Would not share an address
8. Fix the next step and close: Day and time fixed · Meeting with the founder agreed · Will read first, no time fixed · Asked to call back later · Asked not to be called again

## Outcomes (button, stored value)
Agreed to receive report = `agreed_to_receive_report` · Next step agreed = `next_step_agreed` · Interested = `interested` · Follow up = `follow_up` · Call again = `call_again` · Not interested = `not_interested` · Do not call = `do_not_call` · Wrong person = `wrong_person` · Moved company = `moved_company`

---

## UI cases

### UI-01 Full happy path, all 8 stages, "Next step agreed"
**Preconditions:** backend running, Gemini key set.
1. Tab "Live call". Prospect or company: `Sharma Textiles`. Tap "Start call".
2. Stage 1: tap "Right person confirmed". Words: `Yes, speaking.` Tap "Next: Introduce yourself and ask for time".
3. Stage 2: tap "Gave me time". Words: `Calling from where? Okay, go ahead.` Tap next.
4. Stage 3: tap "Asked what the report or profile is". Words: `What is a growth report?` Tap next.
5. Stage 4: tap "Asked about cost". Words: `Is it paid? What are the charges?` Tap next.
6. Stage 5: type `Our biggest challenge is hiring skilled people.` Tap "Suggest what happened (AI)". Wait.
7. Check "Named a goal or an obstacle" is now selected. Tap next.
8. Stage 6: tap "Door still open". Words: `Okay, just send me an email.` Tap next.
9. Stage 7: tap "Agreed: email". Words: `Email me, use my official address.` Tap next.
10. Stage 8: tap "Day and time fixed". Words: `Call me next Tuesday after 2.` The button now reads "Finish call". Tap it.
11. "How did the call end?" shows 9 outcome buttons, each with a short meaning. Tap "Next step agreed".
**Expected:** switches to Past calls. Top row: `Sharma Textiles`, pill "Next step agreed", "Reached stage 8: Fix the next step and close", today's time, and a one-sentence summary.
**Stored:** 1 call: outcome `next_step_agreed`, last_stage 8, ended_at set, summary set (max 25 words). 8 stage rows (1 to 8), each with the chosen button as `happened` and the typed text as `prospect_words`. Stage 5 `happened` = `Named a goal or an obstacle`.

### UI-02 End call early on stage 1 as "Wrong person"
1. Prospect: `Rao Logistics`. Start call.
2. Stage 1: tap "Wrong number or wrong person". Words: `This number has been mine for ten years, I don't know any Rao.`
3. Tap "End call early". "How did the call end?" appears. Tap "Wrong person".
**Expected:** Past calls row `Rao Logistics`, pill "Wrong person", "Reached stage 1: Reach the right person".
**Stored:** outcome `wrong_person`, last_stage 1, ended_at set. 1 stage row: stage_no 1, happened `Wrong number or wrong person`, the words above. (Saved when you tapped End call early, before the outcome screen.)

### UI-03 Blank prospect name
1. Leave "Prospect or company" empty. Start call. Tap "End call early", then "Call again".
**Expected:** row reads `Unnamed prospect`, pill "Call again".
**Stored:** prospect_label `Unnamed prospect`, outcome `call_again`; one stage 1 row with empty happened and words. Also try a name of only spaces: same result.
**Also check:** no AI summary appears on this row (nothing was recorded, so none is written).

### UI-04 Back and earlier-stage tap keep what was entered
1. Start `Iyer Pharma`. Stage 1: "Right person confirmed", words `Yes, speaking.` Next.
2. Stage 2: "Busy, driving or in a meeting", words `I'm driving, call me after an hour.` Next to stage 3.
3. Tap "Back". Stage 2 still shows its button and words. Tap "Back" again: stage 1 shows its button and words.
4. Use Next twice to return to stage 3, then tap stage 1 in the strip. Its button and words are kept.
**Stored:** stage rows 1 and 2 saved when Next was tapped. Back and strip taps save nothing new.

### UI-05 Future stage cannot be opened
1. Start a call. On stage 1 tap stage 5 "Questions" in the strip.
**Expected:** nothing happens, still on stage 1. **Stored:** only the call row.

### UI-06 Suggest with words that match no button
1. Start a call. Go to stage 2. Type `The weather is lovely today and I like mangoes.` Tap "Suggest what happened (AI)".
**Expected:** "No clear match. Pick one yourself." No button selected. **Stored:** nothing.
**Also:** with the words box empty, "Suggest what happened (AI)" is disabled.

### UI-07 AI is down: caller can still work and close
**Preconditions:** remove or break `GEMINI_API_KEY` in Render and let it redeploy.
1. Start `Khan Foods`. Stage 1: type `Sorry, he left the company last year.` Tap "Suggest what happened (AI)". An error shows and nothing is selected.
2. Tap "Person has left the company" yourself. Tap "End call early", then "Moved company".
**Expected:** call closes; Past calls shows `Khan Foods`, "Moved company", no summary line.
**Stored:** outcome `moved_company`, summary empty, stage 1 row with `Person has left the company`.

### UI-08 Past calls: list, pill, stage reached, expand, collapse, empty state
- Empty database: open Past calls. Expected: "No calls yet."
- After UI-01 to UI-03: newest first. Each row shows label, outcome pill, "Reached stage N: <stage name>", start time, summary if any.
- Click the `Sharma Textiles` row: 8 stages listed with number, name, the button chosen and the words. Click again: it collapses.
**Stored:** nothing new.

### UI-09 Saving the same stage again updates the row
1. Start `Nair Steel`. Stage 1: "Right person confirmed". Next.
2. Back. Change stage 1 to "Language or bad line, call again", words `Hindi mein baat kijiye please.` Next.
**Stored:** exactly 1 row for stage_no 1 with the new button and words. Not two rows.

### UI-10 Outcome screen shows the meaning of each word
1. Start a call, tap "End call early".
**Expected:** 9 buttons, in this order: Agreed to receive report, Next step agreed, Interested, Follow up, Call again, Not interested, Do not call, Wrong person, Moved company. "Do not call" says "Only if they asked not to be called".

---

## API cases (Postman, curl, or the browser console)
`BASE` = https://cold-call-screen-1its.onrender.com. `ID` = a call id from `POST /calls`.

| ID | Request | Expected |
|---|---|---|
| API-01 | `GET BASE/health` | 200, `{"ok":true,"time":"..."}` |
| API-02 | `POST BASE/calls` `{"prospect_label":""}` | 201, label `Unnamed prospect` |
| API-03 | `POST BASE/calls` with a 150-character label | 201, label cut to 120 characters |
| API-04 | `POST BASE/calls/ID/stages` `{"stage_no":0,"happened":"x","prospect_words":"x"}` | 400 `stage_no must be 1-8`. Nothing stored |
| API-05 | same with `stage_no` 9 | 400, same error |
| API-06 | same with `stage_no` 2.5, or `"3"` as a string | 400 |
| API-07 | `POST BASE/calls/ID/stages` `{"stage_no":3,"happened":"Reason heard","prospect_words":"Okay."}` then `GET BASE/calls/ID` | last_stage 3, one stage row |
| API-08 | `POST` stage 2 after API-07 | saved, last_stage stays 3 |
| API-09 | stage with 2500 characters in prospect_words | saved, stored as 2000 characters |
| API-10 | `POST BASE/calls/ID/close` `{"outcome":"meeting_booked"}` (an old word) | 400, error lists the nine allowed outcomes. Call stays open |
| API-11 | `POST BASE/calls/ID/close` `{}` | 400, same error |
| API-12 | `POST BASE/calls/ID/close` `{"outcome":"follow_up"}` | 200, outcome `follow_up`, ended_at set, summary set (null if no stage was recorded or AI is down) |
| API-13 | `POST BASE/suggest` `{"stage_no":1,"options":["A","B"]}` | 400 `prospect_words and options required` |
| API-14 | `POST BASE/suggest` with `"options":[]` | 400, same error |
| API-15 | `POST BASE/suggest` `{"stage_no":4,"prospect_words":"Is it paid? What are your charges?","options":["Understood the offer","Asked about cost","Asked what we do or who else we have worked with","Doubts our motive","Wants website or sample first"]}` | 200, `{"suggestion":"Asked about cost"}` |
| API-16 | same options, words `I like mangoes` | 200, `{"suggestion":null}` |
| API-17 | `GET BASE/calls` | newest first, at most 200 |
| API-18 | `GET BASE/calls/00000000-0000-0000-0000-000000000000` | error (404) |

---

## Ready-made prospect words by stage (type into "Their words")
The AI is a language model, so the suggestion can vary slightly. These are clear enough that it should match.

| Stage | Words | Should select |
|---|---|---|
| 1 | `Sorry, he left the company last year.` | Person has left the company |
| 1 | `Hindi mein baat kijiye, I can't follow English.` | Language or bad line, call again |
| 2 | `Who is this? Calling from where?` | Asked who we are again |
| 2 | `I'm driving, call me after an hour.` | Busy, driving or in a meeting |
| 3 | `How did you get my number?` | Questioned where we got the number |
| 3 | `I never asked for any report.` | Said they did not ask for it |
| 4 | `Is it paid? What are your charges?` | Asked about cost |
| 4 | `Do you have a sample or a website I can see?` | Wants website or sample first |
| 5 | `That's not my area, I handle another department.` | Said it is not their area |
| 5 | `I can't share our plans.` | Said they cannot share |
| 6 | `We already work with global consultants.` | Already has consultants or an in-house team |
| 6 | `I do not have time for this.` | Not interested |
| 7 | `WhatsApp is fine, same number.` | Agreed: WhatsApp |
| 7 | `Send me your company profile first.` | Wants company profile or sample first |
| 8 | `Call me next Tuesday after 2.` | Day and time fixed |
| 8 | `Please don't call me again.` | Asked not to be called again |
