import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useParticles from '../../hooks/useParticles.js'

const SEARCH_MODES = [
  { id: 'semantic', label: 'SEMANTIC',  placeholder: 'e.g. China export restrictions, AI infrastructure demand…' },
  { id: 'keyword',  label: 'KEYWORD',   placeholder: 'e.g. supply chain, interest rate sensitivity…' },
  { id: 'speaker',  label: 'SPEAKER',   placeholder: 'e.g. Jensen Huang, Tim Cook, Satya Nadella…' },
  { id: 'entity',   label: 'ENTITY',    placeholder: 'e.g. guidance, risks, metrics…' },
]

const PREVIEW_RESULTS = [
  { ticker: 'NVDA', quarter: '2024Q3', speaker: 'Colette Kress · CFO', label: 'sharp_break',
    text: '"The U.S. government\'s expanded restrictions on exports to China will impact our Q4 Data Center revenue. We are working to qualify alternative products that do not require a license…"',
    sim: '0.94' },
  { ticker: 'NVDA', quarter: '2024Q1', speaker: 'Jensen Huang · CEO', label: 'sharp_break',
    text: '"The new export control rules announced in October have created uncertainty. We expect a meaningful revenue impact in China for the foreseeable future…"',
    sim: '0.91' },
  { ticker: 'AAPL', quarter: '2024Q2', speaker: 'Tim Cook · CEO', label: 'drifting',
    text: '"Greater China revenue was down 8% year-over-year. We see continued headwinds from the macro environment and regulatory dynamics in that region…"',
    sim: '0.87' },
]

const LABEL_COLOR = {
  sharp_break: { text: 'text-signal-break', bg: 'bg-signal-break/10', border: 'border-signal-break/25', badge: 'SHARP BREAK' },
  drifting:    { text: 'text-signal-drift',  bg: 'bg-signal-drift/10',  border: 'border-signal-drift/20',  badge: 'DRIFTING'    },
}

export default function Hero() {
  const canvasRef = useRef(null)
  useParticles(canvasRef)

  const [activeMode, setActiveMode] = useState('semantic')
  const [query, setQuery] = useState('export control China reveue impact')
  const [showPreview, setShowPreview] = useState(true)
  const navigate = useNavigate()

  const currentMode = SEARCH_MODES.find(m => m.id === activeMode)

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(query)}&mode=${activeMode}`)
  }

  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center
                        px-14 py-14 overflow-hidden">
      {/* Particle canvas */}
      <canvas ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{ width: '100%', height: '100%' }} />

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 60% 50%, transparent 60%, #0A0A0B 95%)' }} />

      <div className="relative z-10 max-w-3xl">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8">
          <div className="w-6 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[3px] text-gold">
            NARRATIVE DRIFT INTELLIGENCE
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-[76px] leading-[0.95] tracking-[-1px] font-semibold mb-6">
          What management<br />
          said <em className="text-gold italic">last quarter</em><br />
          <span className="text-text-3 font-normal">versus now.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[15px] text-text-2 leading-relaxed max-w-md mb-12 font-light">
          Veritas AI tracks linguistic shifts in S&P 500 earnings calls across
          21 companies — detecting narrative drift in executive language before
          it moves markets.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4 mb-14">
          <button onClick={() => navigate('/dashboard')}
            className="font-mono text-[11px] tracking-[1.5px] bg-gold text-bg
                       px-8 py-3.5 font-medium hover:bg-gold-2 transition-colors">
            OPEN DASHBOARD
          </button>
          <button onClick={() => document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-mono text-[11px] tracking-[1px] text-text-2
                       border border-border-2 px-6 py-3.5
                       hover:border-border-2/80 hover:text-text transition-colors">
            Read the methodology
          </button>
        </motion.div>
      </div>

      {/* ── Analyst Search (Full width section) ── */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}>
          <p className="font-mono text-[10px] tracking-[2px] text-text-3 mb-3">
            ANALYST SEARCH — QUERY ACROSS ALL CALLS
          </p>

          {/* Search bar */}
          <div className="flex bg-surface border border-border-2">
            {/* Mode selector */}
            <div className="flex border-r border-border">
              {SEARCH_MODES.map(mode => (
                <button key={mode.id}
                  onClick={() => { setActiveMode(mode.id); setShowPreview(false) }}
                  className={`font-mono text-[10px] tracking-[0.5px] px-4 py-3.5
                              border-r border-border last:border-r-0 transition-colors
                              ${activeMode === mode.id
                                ? 'text-gold bg-gold/6'
                                : 'text-text-3 hover:text-text-2'}`}>
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setShowPreview(false) }}
              onFocus={() => query && setShowPreview(true)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={currentMode.placeholder}
              className="flex-1 bg-transparent border-none outline-none
                         font-sans text-[14px] text-text font-light
                         px-5 py-3.5 placeholder:text-text-3" />

            {/* Search button */}
            <button onClick={handleSearch}
              className="font-mono text-[11px] tracking-[1px] bg-gold text-bg
                         px-6 py-3.5 font-medium whitespace-nowrap
                         hover:bg-gold-2 transition-colors">
              SEARCH →
            </button>
          </div>

          {/* Preview results */}
          {showPreview && (
            <div className="bg-surface border border-border border-t-0">
              {PREVIEW_RESULTS.map((r, i) => {
                const lc = LABEL_COLOR[r.label]
                return (
                  <div key={i}
                    onClick={handleSearch}
                    className="flex items-start gap-4 px-5 py-3.5
                               border-b border-border last:border-b-0
                               cursor-pointer hover:bg-surface-2 transition-colors">
                    {/* Badge */}
                    <span className={`font-mono text-[9px] px-2 py-0.5 border
                                      flex-shrink-0 mt-0.5
                                      ${lc.text} ${lc.bg} ${lc.border}`}>
                      {lc.badge}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-3 mb-1.5">
                        <span className="font-mono text-[11px] text-gold font-medium">{r.ticker}</span>
                        <span className="font-mono text-[11px] text-text-3">{r.quarter}</span>
                        <span className="font-mono text-[11px] text-text-3">{r.speaker}</span>
                      </div>
                      <p className="text-[12px] text-text-2 leading-relaxed line-clamp-2 italic">
                        {r.text}
                      </p>
                    </div>

                    {/* Similarity */}
                    <span className="font-mono text-[10px] text-text-3 flex-shrink-0 mt-0.5">
                      sim={r.sim}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}