import { clsx } from 'clsx'

export { clsx }

// ── Label helpers ──────────────────────────────────────────────────────
export const LABEL_META = {
  sharp_break: {
    text: 'SHARP BREAK',
    color: 'text-signal-break',
    bg: 'bg-signal-break/10',
    border: 'border-signal-break/25',
    bar: '#C94C4C',
  },
  drifting: {
    text: 'DRIFTING',
    color: 'text-signal-drift',
    bg: 'bg-signal-drift/10',
    border: 'border-signal-drift/20',
    bar: '#C98A4C',
  },
  stable: {
    text: 'STABLE',
    color: 'text-signal-stable',
    bg: 'bg-signal-stable/10',
    border: 'border-signal-stable/20',
    bar: '#4C9A6A',
  },
}

export function labelMeta(label) {
  return LABEL_META[label] ?? LABEL_META.stable
}

// ── Quarter ────────────────────────────────────────────────────────────
// "2024Q3" → "24Q3"
export function shortQuarter(q) {
  if (!q) return ''
  return q.replace('20', '')
}

// "2024Q3" → "Q3 2024"
export function prettyQuarter(q) {
  if (!q) return ''
  const [year, qnum] = q.split('Q')
  return `Q${qnum} ${year}`
}

// Sort quarters ascending
export function sortQuarters(quarters) {
  return [...quarters].sort((a, b) => {
    const [ay, aq] = a.split('Q').map(Number)
    const [by, bq] = b.split('Q').map(Number)
    return ay !== by ? ay - by : aq - bq
  })
}

// ── Score ──────────────────────────────────────────────────────────────
export function fmtScore(score) {
  if (score == null) return '—'
  return score.toFixed(4)
}

export function fmtDist(dist) {
  if (dist == null) return '—'
  return dist.toFixed(4)
}

// ── Confidence ─────────────────────────────────────────────────────────
export function confColor(conf) {
  if (conf == null) return 'text-text-3'
  if (conf < 0.35) return 'text-signal-break'
  if (conf < 0.55) return 'text-signal-drift'
  return 'text-signal-stable'
}

// ── Topic display ──────────────────────────────────────────────────────
export const TOPIC_LABELS = {
  overall: 'Overall',
  guidance: 'Guidance',
  risks: 'Risks',
  metrics: 'Metrics',
}

export function topicLabel(t) {
  return TOPIC_LABELS[t] ?? t
}

// ── Score bar width % (relative to p90 of typical range) ──────────────
// Scores range roughly 0.005 – 0.02 for FinBERT; we map 0→0.02 to 0→100%
export function scoreBarWidth(score) {
  return Math.min(100, Math.round((score / 0.02) * 100))
}

// ── Truncate ───────────────────────────────────────────────────────────
export function truncate(str, n = 200) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}

// ── Highlight keyword in text ──────────────────────────────────────────
export function highlight(text, query) {
  if (!query || !text) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(${escaped})`, 'gi')
  return text.replace(re, '<mark>$1</mark>')
}