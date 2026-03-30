import { motion } from 'framer-motion'
import AlertBadge from '../shared/AlertBadge.jsx'
import { confColor, truncate, prettyQuarter } from '../../lib/utils.js'

// ── Semantic result ────────────────────────────────────────────────────────
function SemanticResult({ result, query, index }) {
  const simPct = Math.round((result.similarity ?? 0) * 100)

  // Highlight query terms in text
  const highlight = (text) => {
    if (!query || !text) return text
    const words = query.split(/\s+/).filter(w => w.length > 3)
    let out = text
    words.forEach(w => {
      const re = new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
      out = out.replace(re, '<mark class="bg-gold/15 text-gold-3 not-italic">$1</mark>')
    })
    return out
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-border last:border-b-0 px-6 py-4
                 hover:bg-surface/40 transition-colors grid gap-4"
      style={{ gridTemplateColumns: 'auto 1fr auto' }}>

      {/* Similarity bar */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <span className="font-mono text-[10px] text-gold">{simPct}%</span>
        <div className="w-px flex-1 bg-border-2 relative">
          <div className="absolute bottom-0 w-full bg-gold/40 transition-all"
            style={{ height: `${simPct}%` }} />
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="font-serif text-[15px] font-semibold text-text">
            {result.ticker}
          </span>
          <span className="font-mono text-[10px] text-text-3">
            {prettyQuarter(result.quarter)}
          </span>
          <span className="font-mono text-[10px] text-text-3">
            {result.speaker}
          </span>
          <span className={`font-mono text-[9px] ${confColor(result.confidence_score)}`}>
            conf={result.confidence_score?.toFixed(2) ?? '—'}
          </span>
        </div>

        <p className="text-[13px] text-text-2 leading-[1.75] font-light italic"
          dangerouslySetInnerHTML={{ __html: `"${highlight(truncate(result.text_preview, 280))}"` }} />
      </div>

      {/* Role badge */}
      <div className="flex-shrink-0">
        <span className={`font-mono text-[9px] px-2 py-0.5 border
                          ${result.role === 'management'
                            ? 'text-gold/80 border-gold/20 bg-gold/5'
                            : 'text-text-3 border-border'}`}>
          {result.role}
        </span>
      </div>
    </motion.div>
  )
}

// ── Keyword / Speaker result ───────────────────────────────────────────────
function SegmentResult({ result, query, index }) {
  const highlight = (text) => {
    if (!query || !text) return text
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(re, '<mark class="bg-gold/15 text-gold-3 not-italic">$1</mark>')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-border last:border-b-0 px-6 py-4
                 hover:bg-surface/40 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <span className="font-serif text-[15px] font-semibold text-text">
          {result.ticker}
        </span>
        <span className="font-mono text-[10px] text-text-3">
          {prettyQuarter(result.quarter)}
        </span>
        <span className="font-mono text-[10px] text-text-3">{result.speaker}</span>
        <span className={`font-mono text-[9px] px-2 py-0.5 border
                          ${result.role === 'management'
                            ? 'text-gold/80 border-gold/20 bg-gold/5'
                            : 'text-text-3 border-border'}`}>
          {result.role}
        </span>
      </div>
      <p className="text-[13px] text-text-2 leading-[1.75] font-light italic"
        dangerouslySetInnerHTML={{ __html: `"${highlight(truncate(result.text ?? result.preview, 300))}"` }} />
    </motion.div>
  )
}

// ── Entity result ──────────────────────────────────────────────────────────
function EntityResult({ result, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="border-b border-border last:border-b-0 px-6 py-3.5
                 hover:bg-surface/40 transition-colors flex items-center gap-4">
      <div className="w-1.5 h-1.5 rounded-full bg-gold/60 flex-shrink-0" />
      <p className="flex-1 text-[13px] text-text-2 font-light leading-relaxed">
        {result.entity_value}
      </p>
      <span className="font-mono text-[9px] text-text-3 flex-shrink-0">
        seg #{result.segment_id}
      </span>
    </motion.div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export default function SearchResults({ results, mode, query, loading, error }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-mono text-[10px] text-text-3 tracking-[2px]">SEARCHING…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-mono text-[10px] text-signal-break">{error}</span>
      </div>
    )
  }

  if (results === null) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-px bg-gold/30" />
        <p className="font-mono text-[10px] text-text-3 tracking-[2px]">
          ENTER A QUERY TO SEARCH ACROSS ALL CALLS
        </p>
        <p className="font-mono text-[9px] text-text-3/60">
          21 companies · 8 quarters each · 4 search modes
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-mono text-[10px] text-text-3">No results found.</span>
      </div>
    )
  }

  return (
    <div>
      {/* Results header */}
      <div className="px-6 py-3 border-b border-border flex items-center justify-between">
        <span className="font-mono text-[10px] text-text-3 tracking-[1px]">
          {results.length} RESULT{results.length !== 1 ? 'S' : ''} — {mode.toUpperCase()} MODE
        </span>
        {query && (
          <span className="font-mono text-[10px] text-text-3">
            query: <span className="text-gold">"{query}"</span>
          </span>
        )}
      </div>

      {/* Result rows */}
      {mode === 'semantic' && results.map((r, i) => (
        <SemanticResult key={r.id ?? i} result={r} query={query} index={i} />
      ))}

      {(mode === 'keyword' || mode === 'speaker') && results.map((r, i) => (
        <SegmentResult key={r.id ?? i} result={r} query={query} index={i} />
      ))}

      {mode === 'entity' && results.map((r, i) => (
        <EntityResult key={i} result={r} index={i} />
      ))}
    </div>
  )
}