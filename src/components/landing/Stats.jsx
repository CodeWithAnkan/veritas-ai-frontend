import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const STATS = [
  { num: '21',    suffix: '',        label: 'S&P 500 companies tracked, 8 quarters each' },
  { num: '800',   suffix: '+',       label: 'Transcript segments embedded with FinBERT' },
  { num: '4',     suffix: ' layers', label: 'Guidance · Risks · Metrics · Overall per pair' },
  { num: 'p',     suffix: '90',      label: 'Relative threshold calibration — never arbitrary' },
]

export function StatsStrip() {
  return (
    <section className="px-14 py-20 border-b border-border">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-5 h-px bg-gold" />
        <span className="font-mono text-[10px] tracking-[3px] text-gold">BY THE NUMBERS</span>
      </div>

      <div className="grid grid-cols-4 border border-border divide-x divide-border">
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="px-8 py-10">
            <div className="font-serif text-[52px] font-semibold text-text leading-none mb-2">
              {s.num}<span className="text-gold text-[28px]">{s.suffix}</span>
            </div>
            <p className="text-[13px] text-text-2 leading-relaxed font-light">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function CTASection() {
  const navigate = useNavigate()
  return (
    <section className="px-14 py-32 text-center relative overflow-hidden">
      {/* Large decorative V */}
      <div className="absolute inset-x-0 top-4 flex justify-center pointer-events-none select-none">
        <span className="font-serif text-[200px] font-semibold text-border/60 leading-none">V</span>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="w-5 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[3px] text-gold">ACCESS</span>
          <div className="w-5 h-px bg-gold" />
        </div>

        <h2 className="font-serif text-[60px] font-semibold text-text leading-[1.05] mb-5">
          Built for analysts who read<br />
          between <em className="text-gold italic">the lines.</em>
        </h2>
        <p className="text-[15px] text-text-2 font-light mb-10">
          Open-source · FastAPI + pgvector + FinBERT · 21 companies and growing
        </p>

        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/dashboard')}
            className="font-mono text-[11px] tracking-[1.5px] bg-gold text-bg
                       px-10 py-4 font-medium hover:bg-gold-2 transition-colors">
            OPEN DASHBOARD
          </button>
          <a href="https://github.com" target="_blank" rel="noreferrer"
            className="font-mono text-[11px] tracking-[1px] text-text-2
                       border border-border-2 px-8 py-4
                       hover:border-border-2/80 hover:text-text transition-colors">
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}