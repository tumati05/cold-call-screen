# Call Screen

A screen a caller keeps open beside the phone on a cold call. It shows the current stage of the call, what that stage is for, what prospects tend to say, a tap for what happened, and a box for the prospect's words. Calls are saved; a second screen lists past calls and the stage each reached.

## Live links (fill in after deploying)
- Vercel app: https://YOUR-APP.vercel.app
- Render API health: https://YOUR-API.onrender.com/health
- LLM: Google Gemini (gemini-2.0-flash), called only from the Render backend

## What the LLM does
1. **Suggest what happened**: from the prospect's words typed at a stage, picks the best matching tap option (`POST /suggest`).
2. **One-line call summary**: written when a call is closed and stored on the call.

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

## Structure
- `supabase/schema.sql` : tables `calls`, `stage_results`
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
