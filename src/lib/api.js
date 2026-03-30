const BASE = '/api'

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`)
  return res.json()
}

// ── Drift ──────────────────────────────────────────────────────────────
export const getDriftSummary = () =>
  get('/drift/summary')

export const getDriftAlerts = (ticker, severity = 'drifting') =>
  get(`/drift/alerts/${ticker}?severity=${severity}`)

export const getDriftTimeline = (ticker, topic = null) =>
  get(`/drift/timeline/${ticker}${topic ? `?topic=${topic}` : ''}`)

export const getDriftQuotes = (ticker, topic, quarterFrom, quarterTo, topN = 5) =>
  get(`/drift/quotes/${ticker}?topic=${topic}&quarter_from=${quarterFrom}&quarter_to=${quarterTo}&top_n=${topN}`)

export const compareQuarters = (ticker, quarterFrom, quarterTo) =>
  get(`/drift/compare/${ticker}?quarter_from=${quarterFrom}&quarter_to=${quarterTo}`)

export const calculateDrift = (ticker) =>
  fetch(`${BASE}/drift/calculate/${ticker}`, { method: 'POST' }).then(r => r.json())

// ── Intelligence / Search ───────────────────────────────────────────────
export const semanticSearch = (query, ticker = null, limit = 10) => {
  const params = new URLSearchParams({ query, limit })
  if (ticker) params.append('ticker', ticker)
  return get(`/intelligence/similar?${params}`)
}

export const getSegments = (ticker, role = null) => {
  const params = new URLSearchParams()
  if (role) params.append('role', role)
  return get(`/segments/${ticker}?${params}`)
}

export const getEntities = (ticker, entityType, quarter = null) => {
  const params = new URLSearchParams({ entity_type: entityType })
  if (quarter) params.append('quarter', quarter)
  return get(`/intelligence/entities/${ticker}?${params}`)
}

export const getConfidenceStats = (ticker) =>
  get(`/intelligence/confidence/${ticker}`)

// ── Text Search (keyword / speaker) ────────────────────────────────────
export const textSearch = (q, mode = 'keyword', ticker = null, limit = 40) => {
  const params = new URLSearchParams({ q, mode, limit })
  if (ticker) params.append('ticker', ticker)
  return get(`/search?${params}`)
}

// ── Ingest ─────────────────────────────────────────────────────────────
export const ingestTicker = (ticker) =>
  fetch(`${BASE}/ingest/${ticker}`, { method: 'POST' }).then(r => r.json())