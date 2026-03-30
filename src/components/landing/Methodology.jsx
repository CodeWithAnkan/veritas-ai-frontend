import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '01 — INGEST',
    title: '8 quarters of transcripts, structured',
    desc: 'AlphaVantage provides raw earnings call transcripts for 21 S&P 500 companies. Every speaker turn is classified as management or analyst, preserving attribution through Q&A. Segments under 150 characters and operator boilerplate are filtered before analysis.',
    pill: 'AlphaVantage · PostgreSQL · FastAPI',
  },
  {
    num: '02 — EMBED',
    title: 'Financial BERT vectors per segment',
    desc: 'ProsusAI/FinBERT generates 768-dimensional embeddings tuned for financial language semantics. Sarvam AI extracts guidance, risk, and metric entities per segment and scores each speaker\'s linguistic confidence on a 0–1 scale using hedge-word analysis.',
    pill: 'FinBERT · pgvector · Sarvam AI',
  },
  {
    num: '03 — DETECT',
    title: 'Composite drift, calibrated per ticker',
    desc: 'Drift score = 60% centroid distance + 40% tail distance (p90 of individual segment distances from the prior quarter centroid). Thresholds are relative — p75 and p90 of each ticker\'s own score distribution — because FinBERT\'s financial embedding space compresses all distances into a tight 0.005–0.02 range.',
    pill: 'cosine distance · p75 · p90 thresholds',
  },
]

export default function Methodology() {
  return (
    <section id="methodology" className="px-14 py-16 border-b border-border">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-5 h-px bg-gold" />
        <span className="font-mono text-[10px] tracking-[3px] text-gold">METHODOLOGY</span>
      </div>

      {/* 3-col grid */}
      <div className="grid grid-cols-3 border border-border" style={{ background: '#252528', gap: '1px' }}>
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-bg px-8 py-9">
            <div className="font-mono text-[10px] tracking-[2px] text-text-3 mb-5">
              {step.num}
            </div>
            <h3 className="font-serif text-[26px] font-semibold text-text leading-[1.15] mb-3">
              {step.title}
            </h3>
            <p className="text-[13px] text-text-2 leading-[1.8] font-light mb-5">
              {step.desc}
            </p>
            <span className="font-mono text-[9px] tracking-[0.5px] text-gold
                             bg-gold/7 border border-gold/20 px-2.5 py-1">
              {step.pill}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}