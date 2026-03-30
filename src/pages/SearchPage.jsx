import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Nav           from '../components/shared/Nav.jsx'
import SearchBar     from '../components/search/SearchBar.jsx'
import SearchResults from '../components/search/SearchResults.jsx'
import { semanticSearch, textSearch, getEntities } from '../lib/api.js'

const TICKERS = ['NVDA','AAPL','MSFT','GOOGL','AMZN','META','TSLA','JPM','V',
                 'JNJ','WMT','XOM','UNH','MA','LLY','AVGO','HD','MRK','CVX','PEP','COST']

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [query,   setQuery]   = useState(searchParams.get('q') ?? '')
  const [mode,    setMode]    = useState(searchParams.get('mode') ?? 'semantic')
  const [ticker,  setTicker]  = useState('')            // '' = all
  const [results, setResults] = useState(null)          // null = not searched yet
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  // Run search if URL has a query on mount
  useEffect(() => {
    const q = searchParams.get('q')
    const m = searchParams.get('mode') ?? 'semantic'
    if (q) runSearch(q, m)
  }, [])

  const runSearch = async (q, m) => {
    setQuery(q)
    setMode(m)
    setLoading(true)
    setError('')
    setResults(null)
    setSearchParams({ q, mode: m })

    try {
      let data = []

      if (m === 'semantic') {
        const res = await semanticSearch(q, ticker || null, 20)
        data = res.similar_segments ?? []
      }

      else if (m === 'keyword') {
        const res = await textSearch(q, 'keyword', ticker || null, 40)
        data = res.map ? res : []
      }

      else if (m === 'speaker') {
        const res = await textSearch(q, 'speaker', ticker || null, 40)
        data = res.map ? res : []
      }

      else if (m === 'entity') {
        const entityType = ['guidance','risks','metrics'].includes(q.toLowerCase())
          ? q.toLowerCase()
          : 'guidance'
        const tickers = ticker ? [ticker] : TICKERS.slice(0, 8)
        const all = await Promise.all(
          tickers.map(t =>
            getEntities(t, entityType).then(res =>
              (res.entities ?? []).map(e => ({ ...e, ticker: t, entity_type: entityType }))
            ).catch(() => [])
          )
        )
        data = all.flat().slice(0, 60)
      }

      setResults(data)
    } catch (e) {
      setError('Search failed. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Nav />

      {/* Search header */}
      <div className="border-b border-border bg-bg-2 px-14 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-5 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[3px] text-gold">
            ANALYST SEARCH
          </span>
        </div>

        <h1 className="font-serif text-[40px] font-semibold text-text leading-tight mb-8">
          Query across<br />
          <em className="text-gold italic">all 21 companies.</em>
        </h1>

        {/* Search bar */}
        <SearchBar
          initialQuery={query}
          initialMode={mode}
          onSearch={runSearch}
        />

        {/* Filters */}
        <div className="flex items-center gap-4 mt-5">
          <span className="font-mono text-[10px] text-text-3 tracking-[1px]">FILTER BY TICKER:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setTicker('')}
              className={`font-mono text-[9px] px-2.5 py-1 border transition-colors
                          ${ticker === ''
                            ? 'text-gold border-gold/30 bg-gold/6'
                            : 'text-text-3 border-border hover:border-border-2'}`}>
              ALL
            </button>
            {TICKERS.map(t => (
              <button key={t}
                onClick={() => setTicker(t === ticker ? '' : t)}
                className={`font-mono text-[9px] px-2.5 py-1 border transition-colors
                            ${ticker === t
                              ? 'text-gold border-gold/30 bg-gold/6'
                              : 'text-text-3 border-border hover:border-border-2'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results area */}
      <div className="max-w-5xl mx-auto px-14 py-0">
        <div className="bg-surface border-x border-border min-h-[60vh]">
          <SearchResults
            results={results}
            mode={mode}
            query={query}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="px-14 py-7 border-t border-border mt-16 flex items-center justify-between">
        <span className="font-serif text-[15px] font-semibold text-text">
          Veritas <span className="text-gold">AI</span>
        </span>
        <span className="font-mono text-[10px] text-text-3">
          Semantic Search · Keyword + Speaker Search
        </span>
      </footer>
    </div>
  )
}