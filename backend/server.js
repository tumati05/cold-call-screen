import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json({ limit: "100kb" }));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN?.split(",") || "*" }));

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const OUTCOMES = ["agreed_to_receive_report","next_step_agreed","interested","follow_up","call_again","not_interested","do_not_call","wrong_person","moved_company"];
const STAGE_NAMES = ["Reach the right person","Introduce and ask for time","Give the reason for the call","Explain who you are and the offer","Ask about their growth","Handle the push-back","Ask to send the report","Fix the next step and close"];

const fail = (res, error, code = 500) => res.status(code).json({ error: error?.message || String(error) });

// ---- Gemini (key stays on the server) ----
async function gemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2 } }),
    }
  );
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const brief = String(j.error?.message || "").split(". ")[0];
    throw new Error(brief ? `Gemini ${r.status}: ${brief}` : `Gemini ${r.status}`);
  }
  return j.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

// ---- Health ----
app.get("/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// ---- Start a call ----
app.post("/calls", async (req, res) => {
  const label = (req.body?.prospect_label || "").toString().slice(0, 120) || "Unnamed prospect";
  const { data, error } = await db.from("calls").insert({ prospect_label: label }).select().single();
  if (error) return fail(res, error);
  res.status(201).json(data);
});

// ---- Save a stage result (upsert per call+stage) ----
app.post("/calls/:id/stages", async (req, res) => {
  const { stage_no, happened, prospect_words } = req.body || {};
  if (!Number.isInteger(stage_no) || stage_no < 1 || stage_no > 8) return fail(res, "stage_no must be 1-8", 400);
  const { data, error } = await db.from("stage_results")
    .upsert({ call_id: req.params.id, stage_no, happened: happened || null, prospect_words: (prospect_words || "").slice(0, 2000) },
            { onConflict: "call_id,stage_no" })
    .select().single();
  if (error) return fail(res, error);
  await db.from("calls").update({ last_stage: stage_no }).eq("id", req.params.id).lt("last_stage", stage_no);
  res.json(data);
});

// ---- Close a call (outcome + LLM one-line summary) ----
app.post("/calls/:id/close", async (req, res) => {
  const { outcome } = req.body || {};
  if (!OUTCOMES.includes(outcome)) return fail(res, `outcome must be one of ${OUTCOMES.join(", ")}`, 400);

  const { data: stages } = await db.from("stage_results").select("*").eq("call_id", req.params.id).order("stage_no");
  let summary = null;
  const hasContent = (stages || []).some(s => s.happened || (s.prospect_words || "").trim());
  try {
    if (!hasContent) throw new Error("nothing to summarise");
    const log = (stages || []).map(s => `Stage ${s.stage_no} (${STAGE_NAMES[s.stage_no - 1]}): ${s.happened || "-"}; prospect said: "${s.prospect_words || ""}"`).join("\n");
    summary = await gemini(`Write ONE plain sentence (max 25 words) summarising this cold call for a sales log. Outcome: ${outcome}.\n${log}`);
  } catch { /* summary is optional; never block closing a call */ }

  const { data, error } = await db.from("calls")
    .update({ outcome, ended_at: new Date().toISOString(), summary })
    .eq("id", req.params.id).select().single();
  if (error) return fail(res, error);
  res.json(data);
});

// ---- List calls with the stage each reached ----
app.get("/calls", async (_req, res) => {
  const { data, error } = await db.from("calls").select("*").order("started_at", { ascending: false }).limit(200);
  if (error) return fail(res, error);
  res.json(data);
});

// ---- One call with its stage results ----
app.get("/calls/:id", async (req, res) => {
  const { data: call, error } = await db.from("calls").select("*").eq("id", req.params.id).single();
  if (error) return fail(res, error, 404);
  const { data: stages } = await db.from("stage_results").select("*").eq("call_id", req.params.id).order("stage_no");
  res.json({ ...call, stages: stages || [] });
});

// ---- LLM: turn the prospect's words into a suggested "what happened" tap ----
app.post("/suggest", async (req, res) => {
  const { stage_no, prospect_words, options } = req.body || {};
  if (!prospect_words || !Array.isArray(options) || !options.length) return fail(res, "prospect_words and options required", 400);
  try {
    const out = await gemini(
      `A cold caller is at stage "${STAGE_NAMES[(stage_no || 1) - 1]}". The prospect said: "${String(prospect_words).slice(0, 500)}".\n` +
      `Pick the single best matching option from this list and reply with ONLY that option text, exactly as written:\n- ${options.join("\n- ")}`
    );
    const pick = options.find(o => out.toLowerCase().includes(o.toLowerCase())) || null;
    res.json({ suggestion: pick });
  } catch (e) { fail(res, e, 502); }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API on :${port}`));
