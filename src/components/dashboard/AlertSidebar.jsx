import { useEffect, useState } from 'react'
import { getDriftSummary, getDriftAlerts } from '../../lib/api.js'
import { labelMeta, shortQuarter, scoreBarWidth, fmtScore } from '../../lib/utils.js'
import AlertBadge from '../shared/AlertBadge.jsx'

const ALL_TICKERS = ['NVDA','AAPL','MSFT','GOOGL','AMZN','META','TSLA','JPM','V',
                     'JNJ','WMT','XOM','UNH','MA','LLY','AVGO','HD','MRK','CVX','PEP','COST']

export default function AlertSidebar({ selectedAlert, onSelectAlert }) {
  const [ticker, setTicker]   = useState('NVDA')
  const [alerts, setAlerts]   = useState([])
  const [summary, setSummary] = useState({})
  const [loading, setLoading] = useState(false)

  // Load summary counts for all tickers
  useEffect(() => {
    getDriftSummary()
      .then(d => setSummary(d.summary ?? {}))
      .catch(() => {})
  }, [])

  // Load alerts for selected ticker
  useEffect(() => {
    setLoading(true)
    getDriftAlerts(ticker, 'drifting')
      .then(d => {
        setAlerts(d.alerts ?? [])
        // Auto-select first alert
        if (d.alerts?.length > 0 && !selectedAlert) {
          onSelectAlert({ ...d.alerts[0], ticker })
        }
      })
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false))
  }, [ticker])

  const totalAlerts = Object.values(summary).reduce((acc, s) =>
    acc + (s.drifting ?? 0) + (s.sharp_break ?? 0), 0)

  return (
    <div className="flex flex-col border-r border-border bg-bg h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <div>
          <p className="font-mono text-[10px] tracking-[2px] text-text-3">ACTIVE ALERTS</p>
          <p className="font-mono text-[11px] text-gold mt-0.5">{totalAlerts} total signals</p>
        </div>

        {/* Ticker selector */}
        <select
          value={ticker}
          onChange={e => setTicker(e.target.value)}
          className="font-mono text-[11px] text-text bg-surface border border-border
                     px-3 py-1.5 outline-none cursor-pointer hover:border-border-2">
          {ALL_TICKERS.filter(t => summary[t]).map(t => (
            <option key={t} value={t}>
              {t} {summary[t] ? `(${(summary[t].sharp_break ?? 0) + (summary[t].drifting ?? 0)})` : ''}
            </option>
          ))}
          {ALL_TICKERS.filter(t => !summary[t]).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="px-5 py-8 font-mono text-[10px] text-text-3 text-center">
            LOADING...
          </div>
        )}

        {!loading && alerts.length === 0 && (
          <div className="px-5 py-8 font-mono text-[10px] text-text-3 text-center">
            No alerts for {ticker}.<br />
            <span className="text-text-3/60">Run drift calculation first.</span>
          </div>
        )}

        {alerts.map((alert, i) => {
          const meta  = labelMeta(alert.label)
          const isSelected = selectedAlert?.topic === alert.topic &&
                             selectedAlert?.quarter_from === alert.quarter_from &&
                             selectedAlert?.quarter_to === alert.quarter_to
          const barW = scoreBarWidth(alert.drift_score)

          return (
            <button
              key={i}
              onClick={() => onSelectAlert({ ...alert, ticker })}
              className={`w-full text-left px-5 py-4 border-b border-border
                          relative transition-colors
                          ${isSelected ? 'bg-surface' : 'hover:bg-surface/50'}`}>
              {/* Left accent bar */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gold" />
              )}

              {/* Row top */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-[16px] font-semibold text-text">{ticker}</span>
                <AlertBadge label={alert.label} size="xs" />
              </div>

              {/* Topic + quarters */}
              <div className="flex gap-2 mb-3">
                <span className="font-mono text-[10px] text-text-3">{alert.topic}</span>
                <span className="font-mono text-[10px] text-text-3">
                  {shortQuarter(alert.quarter_from)} → {shortQuarter(alert.quarter_to)}
                </span>
              </div>

              {/* Score bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[2px] bg-border-2">
                  <div className="h-[2px] transition-all" style={{ width: `${barW}%`, background: meta.bar }} />
                </div>
                <span className="font-mono text-[9px] text-text-3">{fmtScore(alert.drift_score)}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Summary footer */}
      {summary[ticker] && (
        <div className="px-5 py-3 border-t border-border flex gap-4 flex-shrink-0">
          <span className="font-mono text-[9px] text-signal-break">
            ● {summary[ticker].sharp_break ?? 0} break
          </span>
          <span className="font-mono text-[9px] text-signal-drift">
            ● {summary[ticker].drifting ?? 0} drift
          </span>
          <span className="font-mono text-[9px] text-signal-stable">
            ● {summary[ticker].stable ?? 0} stable
          </span>
        </div>
      )}
    </div>
  )
}