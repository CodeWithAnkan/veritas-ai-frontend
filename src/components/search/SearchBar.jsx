import { useState } from 'react'

const MODES = [
  { id: 'semantic', label: 'SEMANTIC',  placeholder: 'e.g. China export restrictions, AI infrastructure demand…' },
  { id: 'keyword',  label: 'KEYWORD',   placeholder: 'e.g. supply chain, interest rate headwinds…' },
  { id: 'speaker',  label: 'SPEAKER',   placeholder: 'e.g. Jensen Huang, Tim Cook, Satya Nadella…' },
  { id: 'entity',   label: 'ENTITY',    placeholder: 'Choose: guidance · risks · metrics' },
]

export default function SearchBar({ onSearch, initialQuery = '', initialMode = 'semantic', compact = false }) {
  const [mode,  setMode]  = useState(initialMode)
  const [query, setQuery] = useState(initialQuery)

  const current = MODES.find(m => m.id === mode)

  const submit = () => {
    if (query.trim()) onSearch(query.trim(), mode)
  }

  return (
    <div>
      <div className={`flex bg-surface border border-border-2 ${compact ? '' : 'shadow-lg'}`}>
        {/* Mode tabs */}
        <div className="flex border-r border-border flex-shrink-0">
          {MODES.map(m => (
            <button key={m.id}
              onClick={() => setMode(m.id)}
              className={`font-mono tracking-[0.5px] border-r border-border last:border-r-0
                          transition-colors
                          ${compact ? 'text-[9px] px-3 py-3' : 'text-[10px] px-4 py-4'}
                          ${mode === m.id
                            ? 'text-gold bg-gold/6'
                            : 'text-text-3 hover:text-text-2'}`}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder={current.placeholder}
          className={`flex-1 bg-transparent border-none outline-none
                      font-sans text-text font-light placeholder:text-text-3
                      ${compact ? 'text-[13px] px-4 py-3' : 'text-[14px] px-5 py-4'}`}
        />

        {/* Search button */}
        <button onClick={submit}
          className={`font-mono tracking-[1px] bg-gold text-bg font-medium
                      whitespace-nowrap hover:bg-gold-2 transition-colors
                      ${compact ? 'text-[10px] px-5 py-3' : 'text-[11px] px-7 py-4'}`}>
          SEARCH →
        </button>
      </div>

      {/* Entity mode hint */}
      {mode === 'entity' && (
        <div className="flex gap-2 mt-2">
          {['guidance', 'risks', 'metrics'].map(e => (
            <button key={e}
              onClick={() => { setQuery(e); onSearch(e, 'entity') }}
              className="font-mono text-[9px] px-2.5 py-1 border border-border
                         text-text-3 hover:text-gold hover:border-gold/30 transition-colors">
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}