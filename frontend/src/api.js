const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function req(path, method = "GET", body) {
  const r = await fetch(BASE + path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`);
  return j;
}

export const api = {
  startCall: (prospect_label) => req("/calls", "POST", { prospect_label }),
  saveStage: (id, payload) => req(`/calls/${id}/stages`, "POST", payload),
  closeCall: (id, outcome) => req(`/calls/${id}/close`, "POST", { outcome }),
  listCalls: () => req("/calls"),
  getCall: (id) => req(`/calls/${id}`),
  suggest: (payload) => req("/suggest", "POST", payload),
  health: () => req("/health"),
};
