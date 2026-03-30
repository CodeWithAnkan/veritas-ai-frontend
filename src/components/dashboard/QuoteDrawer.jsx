import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDriftQuotes } from '../../lib/api.js'
import { fmtDist, confColor, prettyQuarter, truncate } from '../../lib/utils.js'
import AlertBadge from '../shared/AlertBadge.jsx'

function ConfBar({ score }) {
  if (score == null) return null
  const pct = Math.round(score * 100)
  const color = score < 0.35 ? '#C94C4C' : score < 0.55 ? '#C98A4C' : '#4C9A6A'
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="w-16 h-px bg-border-2">
        <div className="h-px transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className={`font-mono text-[9px] ${confColor(score)}`}>
        conf={score.toFixed(2)}
      </span>
    </div>
  )
}

export default function QuoteDrawer({ alert }) {
  const [quotes,  setQuotes]  = useState([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!alert) return
    setLoading(true)
    setQuotes([])
    setExpanded(null)

    getDriftQuotes(
      alert.ticker,
      alert.topic,
      alert.quarter_from,
      alert.quarter_to,
      5
    )
      .then(d => setQuotes(d.drifted_quotes ?? []))
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false))
  }, [alert?.ticker, alert?.topic, alert?.quarter_from, alert?.quarter_to])

  if (!alert) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-mono text-[10px] text-text-3">
          Select an alert to surface evidence
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] tracking-[2px] text-gold">
            EVIDENCE
          </p>
          <span className="font-mono text-[10px] text-text-3">
            {alert.topic} · {prettyQuarter(alert.quarter_from)} → {prettyQuarter(alert.quarter_to)}
          </span>
        </div>
        <AlertBadge label={alert.label} size="xs" />
      </div>

      {/* Subheading */}
      <div className="px-5 py-2.5 border-b border-border flex-shrink-0">
        <p className="font-mono text-[9px] text-text-3">
          TOP DRIFTED SEGMENTS IN {alert.quarter_to} vs {alert.quarter_from} CENTROID
        </p>
      </div>

      {/* Quote list */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <span className="font-mono text-[10px] text-text-3 tracking-[2px]">
              LOADING EVIDENCE…
            </span>
          </div>
        )}

        {!loading && quotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <p className="font-mono text-[10px] text-text-3">No quotes found.</p>
            <p className="font-mono text-[9px] text-text-3/60">
              Check embeddings exist for both quarters.
            </p>
          </div>
        )}

        <AnimatePresence>
          {quotes.map((q, i) => {
            const isOpen = expanded === i
            const rankColor = i === 0 ? 'text-signal-break'
                            : i === 1 ? 'text-signal-drift'
                            : 'text-text-3'

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="border-b border-border last:border-b-0">
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className="w-full text-left px-5 py-4 hover:bg-surface/40
                             transition-colors grid gap-3"
                  style={{ gridTemplateColumns: '24px 1fr auto' }}>
                  {/* Rank */}
                  <span className={`font-mono text-[11px] font-medium mt-0.5 ${rankColor}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Body */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[10px] text-text-3">
                        {q.speaker}
                      </span>
                      <span className="font-mono text-[9px] text-text-3/60">·</span>
                      <span className="font-mono text-[9px] text-text-3">
                        {q.role}
                      </span>
                    </div>

                    <p className="text-[12px] text-text-2 leading-relaxed italic
                                  line-clamp-2 font-light">
                      "{isOpen ? q.text : truncate(q.text, 180)}"
                    </p>

                    <ConfBar score={q.confidence_score} />
                  </div>

                  {/* Distance */}
                  <div className="text-right flex-shrink-0">
                    <span className={`font-mono text-[10px] ${rankColor}`}>
                      {fmtDist(q.drift_distance)}
                    </span>
                    <p className="font-mono text-[9px] text-text-3 mt-0.5">dist</p>
                  </div>
                </button>

                {/* Expanded full text */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden">
                      <div className="px-5 pb-5 pl-14 border-t border-border/50">
                        <p className="text-[12px] text-text-2 leading-[1.8] italic font-light mt-3">
                          "{q.text}"
                        </p>
                        <div className="flex gap-6 mt-3">
                          <span className="font-mono text-[9px] text-text-3">
                            quarter: {q.quarter}
                          </span>
                          <span className="font-mono text-[9px] text-text-3">
                            segment_id: {q.segment_id}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}