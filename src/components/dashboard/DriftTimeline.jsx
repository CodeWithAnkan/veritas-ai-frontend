import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { getDriftTimeline } from '../../lib/api.js'
import { shortQuarter, labelMeta, sortQuarters } from '../../lib/utils.js'

const TOPIC_COLORS = {
  overall:  '#C9A84C',
  guidance: '#4C7AC9',
  risks:    '#C94C4C',
  metrics:  '#4C9A6A',
}

const TOPICS = ['overall', 'guidance', 'risks', 'metrics']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border-2 px-4 py-3 shadow-xl">
      <p className="font-mono text-[10px] text-text-3 mb-2">{label}</p>
      {payload.map(p => {
        const meta = labelMeta(p.payload[`${p.dataKey}_label`])
        return (
          <div key={p.dataKey} className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="font-mono text-[10px] text-text-2 w-16">{p.dataKey}</span>
            <span className="font-mono text-[11px] text-text">{p.value?.toFixed(6)}</span>
            {meta && (
              <span className={`font-mono text-[9px] ${meta.color}`}>{meta.text}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function DriftTimeline({ ticker, selectedAlert, onSelectTransition }) {
  const [data, setData]         = useState([])
  const [visibleTopics, setVisibleTopics] = useState(new Set(TOPICS))
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (!ticker) return
    setLoading(true)
    getDriftTimeline(ticker)
      .then(d => {
        const rows = d.drift_timeline ?? []

        // Pivot: { quarterLabel, overall, risks, guidance, metrics, *_label }
        const quarterSet = new Set()
        const byQuarter  = {}

        rows.forEach(r => {
          const key = `${shortQuarter(r.quarter_from)}→${shortQuarter(r.quarter_to)}`
          quarterSet.add(key)
          if (!byQuarter[key]) byQuarter[key] = { quarter: key }
          byQuarter[key][r.topic]              = r.drift_score
          byQuarter[key][`${r.topic}_label`]   = r.label
          byQuarter[key][`${r.topic}_from`]    = r.quarter_from
          byQuarter[key][`${r.topic}_to`]      = r.quarter_to
        })

        setData(Object.values(byQuarter))
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [ticker])

  const toggleTopic = (topic) => {
    setVisibleTopics(prev => {
      const next = new Set(prev)
      next.has(topic) ? next.delete(topic) : next.add(topic)
      return next
    })
  }

  // Find the selected alert's quarter label for the reference line
  const selectedKey = selectedAlert
    ? `${shortQuarter(selectedAlert.quarter_from)}→${shortQuarter(selectedAlert.quarter_to)}`
    : null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <span className="font-mono text-[10px] text-text-3 tracking-[2px]">LOADING TIMELINE…</span>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <span className="font-mono text-[10px] text-text-3">
          No drift data. Run POST /drift/calculate/{ticker} first.
        </span>
      </div>
    )
  }

  return (
    <div>
      {/* Topic toggles */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] tracking-[2px] text-text-3">
          DRIFT TIMELINE — ALL TOPICS
        </p>
        <div className="flex gap-1">
          {TOPICS.map(topic => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`font-mono text-[9px] px-2.5 py-1 border transition-all
                          ${visibleTopics.has(topic)
                            ? 'border-transparent'
                            : 'border-border text-text-3 opacity-40'}`}
              style={visibleTopics.has(topic)
                ? { color: TOPIC_COLORS[topic], borderColor: TOPIC_COLORS[topic] + '40',
                    background: TOPIC_COLORS[topic] + '10' }
                : {}}>
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#252528" strokeWidth={0.5} vertical={false} />
          <XAxis
            dataKey="quarter"
            tick={{ fontFamily: 'DM Mono', fontSize: 9, fill: '#4A4845' }}
            axisLine={{ stroke: '#252528' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: 'DM Mono', fontSize: 9, fill: '#4A4845' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v.toFixed(3)}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Highlight selected transition */}
          {selectedKey && (
            <ReferenceLine
              x={selectedKey}
              stroke="#C9A84C"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
          )}

          {TOPICS.filter(t => visibleTopics.has(t)).map(topic => (
            <Line
              key={topic}
              type="monotone"
              dataKey={topic}
              stroke={TOPIC_COLORS[topic]}
              strokeWidth={1.5}
              dot={({ cx, cy, payload }) => {
                const label = payload[`${topic}_label`]
                if (!label || label === 'stable') return <g key={cx} />
                const r = label === 'sharp_break' ? 4 : 3
                return (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r}
                    fill={TOPIC_COLORS[topic]} stroke="#0A0A0B" strokeWidth={1.5}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectTransition?.({
                      ticker, topic,
                      quarter_from: payload[`${topic}_from`],
                      quarter_to:   payload[`${topic}_to`],
                      label,
                    })}
                  />
                )
              }}
              activeDot={{ r: 4, fill: TOPIC_COLORS[topic], stroke: '#0A0A0B', strokeWidth: 2 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-5 mt-3 justify-end">
        {TOPICS.map(t => (
          <div key={t} className="flex items-center gap-1.5">
            <div className="w-4 h-px" style={{ background: TOPIC_COLORS[t] }} />
            <span className="font-mono text-[9px] text-text-3">{t}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-4 pl-4 border-l border-border">
          <div className="w-2 h-2 rounded-full bg-signal-break" />
          <span className="font-mono text-[9px] text-text-3">sharp_break dot</span>
        </div>
      </div>
    </div>
  )
}