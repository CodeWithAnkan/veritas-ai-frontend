import { useState } from 'react'
import { compareQuarters } from '../../lib/api.js'
import { labelMeta, scoreBarWidth, fmtScore } from '../../lib/utils.js'

const QUARTERS = ['2023Q4','2024Q1','2024Q2','2024Q3','2024Q4','2025Q1','2025Q2','2025Q3']
const TOPICS   = ['overall','guidance','risks','metrics']

export default function ComparePanel({ ticker }) {
  const [from, setFrom] = useState('2024Q2')
  const [to,   setTo]   = useState('2024Q3')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const run = async () => {
    if (!ticker) return
    setLoading(true)
    setError('')
    try {
      const d = await compareQuarters(ticker, from, to)
      setResult(d.comparison ?? {})
    } catch (e) {
      setError('Could not fetch comparison.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <p className="font-mono text-[10px] tracking-[2px] text-gold mb-5">
        AD-HOC QUARTER COMPARISON
      </p>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[9px] text-text-3">FROM</label>
          <select value={from} onChange={e => setFrom(e.target.value)}
            className="font-mono text-[11px] text-text bg-surface border border-border
                       px-3 py-2 outline-none hover:border-border-2">
            {QUARTERS.map(q => <option key={q}>{q}</option>)}
          </select>
        </div>

        <span className="font-mono text-[12px] text-text-3 mt-5">→</span>

        <div className="flex flex-col gap-1">
          <label className="font-mono text-[9px] text-text-3">TO</label>
          <select value={to} onChange={e => setTo(e.target.value)}
            className="font-mono text-[11px] text-text bg-surface border border-border
                       px-3 py-2 outline-none hover:border-border-2">
            {QUARTERS.map(q => <option key={q}>{q}</option>)}
          </select>
        </div>

        <button onClick={run}
          className="font-mono text-[10px] tracking-[1px] bg-gold text-bg
                     px-5 py-2 mt-5 hover:bg-gold-2 transition-colors">
          {loading ? 'RUNNING…' : 'COMPARE →'}
        </button>
      </div>

      {error && (
        <p className="font-mono text-[10px] text-signal-break mb-4">{error}</p>
      )}

      {/* Results table */}
      {result && (
        <div className="border border-border">
          {/* Header */}
          <div className="grid border-b border-border bg-surface"
            style={{ gridTemplateColumns: '100px 1fr 1fr 1fr 80px' }}>
            {['TOPIC','COMPOSITE','CENTROID','TAIL','LABEL'].map(h => (
              <div key={h} className="px-4 py-2.5 font-mono text-[9px] text-text-3 tracking-[1px]">
                {h}
              </div>
            ))}
          </div>

          {TOPICS.map(topic => {
            const info = result[topic]
            if (!info?.available) {
              return (
                <div key={topic}
                  className="grid border-b border-border last:border-b-0"
                  style={{ gridTemplateColumns: '100px 1fr 1fr 1fr 80px' }}>
                  <div className="px-4 py-3 font-mono text-[11px] text-text-2">{topic}</div>
                  <div className="px-4 py-3 font-mono text-[10px] text-text-3 col-span-4">
                    no data
                  </div>
                </div>
              )
            }

            // Dynamically label based on compare scores
            const allScores = TOPICS.map(t => result[t]?.drift_score).filter(Boolean)
            const p75 = allScores.sort((a,b)=>a-b)[Math.floor(allScores.length * 0.75)] ?? 0.01
            const p90 = allScores[Math.floor(allScores.length * 0.90)] ?? 0.015
            const label = info.drift_score >= p90 ? 'sharp_break'
                        : info.drift_score >= p75 ? 'drifting'
                        : 'stable'
            const meta = labelMeta(label)
            const barW = scoreBarWidth(info.drift_score)

            return (
              <div key={topic}
                className="grid border-b border-border last:border-b-0 hover:bg-surface/30"
                style={{ gridTemplateColumns: '100px 1fr 1fr 1fr 80px' }}>
                <div className="px-4 py-3 font-mono text-[11px] text-text-2">{topic}</div>

                {/* Composite with bar */}
                <div className="px-4 py-3">
                  <div className="font-mono text-[11px] text-text mb-1">
                    {fmtScore(info.drift_score)}
                  </div>
                  <div className="w-full h-px bg-border-2">
                    <div className="h-px" style={{ width: `${barW}%`, background: meta.bar }} />
                  </div>
                </div>

                <div className="px-4 py-3 font-mono text-[11px] text-text-2">
                  {fmtScore(info.centroid_dist)}
                </div>
                <div className="px-4 py-3 font-mono text-[11px] text-text-2">
                  {fmtScore(info.tail_dist)}
                </div>
                <div className={`px-4 py-3 font-mono text-[9px] ${meta.color}`}>
                  {meta.text}
                </div>
              </div>
            )
          })}

          {/* Segment counts */}
          <div className="px-4 py-2.5 bg-surface border-t border-border">
            <span className="font-mono text-[9px] text-text-3">
              overall: {result.overall?.segment_count_from ?? '?'} segs from &rarr; {result.overall?.segment_count_to ?? '?'} segs to
            </span>
          </div>
        </div>
      )}
    </div>
  )
}