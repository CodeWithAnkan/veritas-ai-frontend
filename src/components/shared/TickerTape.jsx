import { useEffect, useState } from 'react'
import { getDriftSummary, getDriftAlerts } from '../../lib/api.js'

// Static fallback while data loads
const FALLBACK = [
  { ticker: 'NVDA' },
  { ticker: 'AMZN' },
  { ticker: 'TSLA' },
  { ticker: 'MSFT' },
  { ticker: 'META' },
  { ticker: 'AAPL' },
  { ticker: 'JPM' },
  { ticker: 'V' },
  { ticker: 'WMT' },
  { ticker: 'XOM' },
  { ticker: 'UNH' },
  { ticker: 'MA' },
  { ticker: 'LLY' },
  { ticker: 'AVGO' },
  { ticker: 'HD' },
  { ticker: 'MRK' },
  { ticker: 'CVX' },
  { ticker: 'PEP' },
  { ticker: 'COST' },
]

function TickerItem({ item }) {
  return (
    <span className="font-serif text-sm font-semibold tracking-[0.18em] text-gold">
      {item.ticker}
    </span>
  )
}

export default function TickerTape() {
  const [items, setItems] = useState(FALLBACK)

  useEffect(() => {
    // Load non-stable alerts from all tickers in summary
    getDriftSummary()
      .then(async (data) => {
        const tickers = Object.keys(data.summary ?? {})
        const alerts = await Promise.all(
          tickers.map((ticker) =>
            getDriftAlerts(ticker, 'drifting').catch(() => ({ alerts: [] }))
          )
        )
        const all = alerts.flatMap((entry) => entry.alerts ?? [])

        if (all.length > 0) {
          const uniqueTickers = Array.from(
            new Set(all.map((item) => item.ticker).filter(Boolean))
          ).map((ticker) => ({ ticker }))

          if (uniqueTickers.length > 0) setItems(uniqueTickers)
        }
      })
      .catch(() => {}) // silently use fallback
  }, [])

  const repeatedGroups = Array.from({ length: 4 }, (_, index) => index)

  return (
    <div className="ticker-wrap border-t border-b border-border bg-bg-2 py-2.5 overflow-hidden">
      <div
        className="ticker-inner flex w-max animate-ticker"
        style={{ animationDuration: '60s' }}
      >
        {repeatedGroups.map((groupIndex) => (
          <div
            key={groupIndex}
            className="flex shrink-0 items-center gap-6 px-3"
          >
            {items.map((item, itemIndex) => (
              <div key={`${groupIndex}-${item.ticker}-${itemIndex}`} className="flex items-center gap-6">
                <TickerItem item={item} />
                <span aria-hidden="true" className="text-border-2 text-sm">
                  &bull;
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
