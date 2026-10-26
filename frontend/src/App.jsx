import React, { useEffect, useState } from "react";
import { api } from "./api.js";
import { STAGES, OUTCOMES } from "./stages.js";

const outcomeLabel = (v) => (OUTCOMES.find(o => o[0] === v) || [, "In progress"])[1];

export default function App() {
  const [tab, setTab] = useState("call");
  const [awake, setAwake] = useState(false);

  // Render free tier sleeps: ping health on load so it wakes up.
  useEffect(() => { api.health().then(() => setAwake(true)).catch(() => {}); }, []);

  return (
    <div className="app">
      <header>
        <h1>Call Screen</h1>
        <nav>
          <button className={tab === "call" ? "on" : ""} onClick={() => setTab("call")}>Live call</button>
          <button className={tab === "history" ? "on" : ""} onClick={() => setTab("history")}>Past calls</button>
        </nav>
        <span className={"dot " + (awake ? "up" : "wait")} title={awake ? "Backend ready" : "Backend waking up..."} />
      </header>
      {tab === "call" ? <LiveCall onDone={() => setTab("history")} /> : <History />}
    </div>
  );
}

function LiveCall({ onDone }) {
  const [call, setCall] = useState(null);
  const [label, setLabel] = useState("");
  const [idx, setIdx] = useState(0);
  const [happened, setHappened] = useState({});
  const [words, setWords] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [ending, setEnding] = useState(false);

  const stage = STAGES[idx];

  async function start() {
    setBusy(true); setErr("");
    try { setCall(await api.startCall(label.trim())); } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  async function persist() {
    await api.saveStage(call.id, {
      stage_no: stage.no, happened: happened[stage.no] || null, prospect_words: words[stage.no] || "",
    });
  }

  async function next() {
    setBusy(true); setErr("");
    try { await persist(); if (idx < STAGES.length - 1) setIdx(idx + 1); else setEnding(true); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  }

  async function endEarly() {
    setBusy(true); setErr("");
    try { await persist(); setEnding(true); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  }

  async function finish(outcome) {
    setBusy(true); setErr("");
    try {
      await api.closeCall(call.id, outcome);
      onDone();
    } catch (e) { setErr(e.message); setBusy(false); }
  }

  async function suggest() {
    setSuggesting(true); setErr("");
    try {
      const r = await api.suggest({ stage_no: stage.no, prospect_words: words[stage.no], options: stage.options });
      if (r.suggestion) setHappened(h => ({ ...h, [stage.no]: r.suggestion }));
      else setErr("No clear match. Pick one yourself.");
    } catch (e) { setErr(e.message); }
    setSuggesting(false);
  }

  if (!call) {
    return (
      <main className="card">
        <h2>Start a call</h2>
        <p className="muted">Add who you are calling (optional), then start. Keep this beside your phone.</p>
        <input placeholder="Prospect or company" value={label} onChange={e => setLabel(e.target.value)} />
        <button className="primary" disabled={busy} onClick={start}>{busy ? "Starting..." : "Start call"}</button>
        {err && <p className="err">{err}</p>}
      </main>
    );
  }

  if (ending) {
    return (
      <main className="card">
        <h2>How did the call end?</h2>
        <p className="muted">Pick the one that matches how the prospect actually left it.</p>
        <div className="grid">
          {OUTCOMES.map(([v, l, hint]) => (
            <button key={v} className="outcome" disabled={busy} onClick={() => finish(v)}>
              <strong>{l}</strong><small>{hint}</small>
            </button>
          ))}
        </div>
        {err && <p className="err">{err}</p>}
      </main>
    );
  }

  return (
    <main>
      <ol className="steps">
        {STAGES.map((s, i) => (
          <li key={s.no} className={i === idx ? "now" : i < idx ? "done" : ""} onClick={() => i <= idx && setIdx(i)}>
            <span>{s.no}</span><em>{s.short}</em>
          </li>
        ))}
      </ol>

      <section className="card">
        <p className="tag">Stage {stage.no} of 8</p>
        <h2>{stage.name}</h2>
        <p className="purpose">{stage.purpose}</p>
        <p className="evidence"><b>In the 100 calls:</b> {stage.evidence}</p>

        <h3>Prospects often say</h3>
        <ul className="says">{stage.prospectSays.map(s => <li key={s}>"{s}"</li>)}</ul>

        <h3>What happened?</h3>
        <div className="grid">
          {stage.options.map(o => (
            <button key={o} className={happened[stage.no] === o ? "sel" : ""}
              onClick={() => setHappened(h => ({ ...h, [stage.no]: o }))}>{o}</button>
          ))}
        </div>

        <h3>Their words</h3>
        <textarea rows={3} placeholder="Type what the prospect said..."
          value={words[stage.no] || ""} onChange={e => setWords(w => ({ ...w, [stage.no]: e.target.value }))} />
        <button className="ghost" disabled={!words[stage.no] || suggesting} onClick={suggest}>
          {suggesting ? "Thinking..." : "Suggest what happened (AI)"}
        </button>

        {err && <p className="err">{err}</p>}
        <div className="row">
          <button disabled={idx === 0 || busy} onClick={() => setIdx(idx - 1)}>Back</button>
          <button className="primary" disabled={busy} onClick={next}>
            {idx === STAGES.length - 1 ? "Finish call" : `Next: ${STAGES[idx + 1].name}`}
          </button>
          <button className="danger" disabled={busy} onClick={endEarly}>End call early</button>
        </div>
      </section>
    </main>
  );
}

function History() {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => { api.listCalls().then(setRows).catch(e => setErr(e.message)); }, []);

  async function toggle(id) {
    if (open?.id === id) return setOpen(null);
    try { setOpen(await api.getCall(id)); } catch (e) { setErr(e.message); }
  }

  if (err) return <main className="card"><p className="err">{err}</p></main>;
  if (!rows) return <main className="card"><p className="muted">Loading calls (the server may take ~30s to wake)...</p></main>;
  if (!rows.length) return <main className="card"><p className="muted">No calls yet.</p></main>;

  return (
    <main>
      {rows.map(c => (
        <div className="card call" key={c.id} onClick={() => toggle(c.id)}>
          <div className="row between">
            <strong>{c.prospect_label}</strong>
            <span className="pill">{outcomeLabel(c.outcome)}</span>
          </div>
          <p className="muted">
            Reached stage {c.last_stage}: {STAGES[c.last_stage - 1]?.name} · {new Date(c.started_at).toLocaleString()}
          </p>
          {c.summary && <p>{c.summary}</p>}
          {open?.id === c.id && (
            <ul className="detail">
              {open.stages.map(s => (
                <li key={s.id}><b>{s.stage_no}. {STAGES[s.stage_no - 1].name}</b> {s.happened || "-"}
                  {s.prospect_words && <div className="muted">"{s.prospect_words}"</div>}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </main>
  );
}
