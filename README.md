# Call Screen

A screen a caller keeps open beside the phone on a cold call. It shows the current stage of the call, what that stage is for, what prospects tend to say, a tap for what happened, and a box for the prospect's words. Calls are saved; a second screen lists past calls and the stage each reached.

## Live links
- Vercel app: https://YOUR-APP.vercel.app
- Render API health: https://YOUR-API.onrender.com/health (the free tier sleeps when idle, so the first request can take up to a minute)
- LLM: Google Gemini (gemini-2.0-flash), called only from the Render backend

## What the LLM does
1. **Suggest what happened**: from the prospect's words typed at a stage, picks the best matching tap option (`POST /suggest`).
2. **One-line call summary**: written when a call is closed and stored on the call. It is skipped when nothing was recorded, so the model never writes a summary of nothing.

Why: the caller is mid-conversation and cannot spend attention on tapping; typing a few words and letting the model pre-select is faster. The summary makes the history list scannable. Both fail safe: if the LLM is down, the caller taps manually and the call still closes.

## Keys and settings you need
Only one AI key is needed, and it is free. There is no Anthropic key.

| Name | Where it goes | Where to get it |
|---|---|---|
| `GEMINI_API_KEY` | Render (backend) | Google AI Studio, "Get API key" (free) |
| `SUPABASE_URL` | Render (backend) | Supabase, Project Settings, API, Project URL |
| `SUPABASE_SERVICE_KEY` | Render (backend) | Supabase, Project Settings, API, `service_role` key. Keep it secret. |
| `FRONTEND_ORIGIN` | Render (backend) | Your Vercel URL, once it exists |
| `VITE_API_URL` | Vercel (frontend) | Your Render URL |

Never commit a real `.env` file. The `.gitignore` already blocks it.

## Where the stage content comes from
I read all 100 provided cold-call transcripts (one Hyderabad growth-consulting company calling owners, directors and senior managers) and built the eight stages from how those calls actually run, in order:

1. Reach the right person
2. Introduce yourself and ask for time
3. Give the reason for the call
4. Explain who you are and the offer
5. Ask about their growth
6. Handle the push-back
7. Ask to send the report
8. Fix the next step and close

Each stage shows its purpose, what prospects tend to say at that point, tap options for what happened, and a line on what the 100 calls showed (my own counts, so approximate). Everything is in one file, `frontend/src/stages.js`.

What the calls showed, in short: the median call is about 90 seconds and 68 of 100 are under two minutes. A third end well (report agreed, next step agreed or interested); about a quarter are declined; 13 end because it is the wrong person or they have moved company; 4 because of language or a bad line. Many prospects end the call politely with "send me the details", so stage 7 asks the caller to note which one they got. The outcome words are the callers' own (agreed to receive report, next step agreed, interested, follow up, call again, not interested, do not call, wrong person, moved company), each shown with its meaning, because in the data the logged word often did not match the call: polite declines, and even an agreed call, were logged as "do not call", and 13 calls were logged as nothing.

The transcripts are for this task only, so they are not in this repository and the stage text paraphrases them instead of quoting.

## Structure
- `supabase/schema.sql` : tables `calls`, `stage_results`
- `supabase/migration_01_outcomes.sql` : only for a database made from the first version of the schema
- `backend/` : Express API (Render)
- `frontend/` : React + Vite (Vercel)
- `frontend/src/stages.js` : the eight stages, in one file

## API
| Method | Path | Purpose |
|---|---|---|
| GET | /health | liveness |
| POST | /calls | start a call |
| POST | /calls/:id/stages | save a stage result |
| POST | /calls/:id/close | close with outcome + summary |
| GET | /calls | list calls |
| GET | /calls/:id | one call with stages |
| POST | /suggest | LLM suggestion |

## Deploy
1. **Supabase**: new project, SQL editor, run `supabase/schema.sql`. Copy Project URL and the `service_role` key (Settings, API).
2. **Render**: New Web Service from this repo. Root directory `backend`, build `npm install`, start `npm start`, free plan. Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `GEMINI_API_KEY`, `FRONTEND_ORIGIN` (the Vercel URL, set after step 3).
3. **Vercel**: Import repo, root directory `frontend`, framework Vite. Env var `VITE_API_URL` = Render URL.
4. Go back to Render and set `FRONTEND_ORIGIN` to the Vercel URL, redeploy.

## Run locally
```
cd backend && cp .env.example .env && npm install && npm start
cd frontend && cp .env.example .env && npm install && npm run dev
```
