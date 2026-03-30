import { useState } from 'react'
import Nav           from '../components/shared/Nav.jsx'
import AlertSidebar  from '../components/dashboard/AlertSidebar.jsx'
import DriftTimeline from '../components/dashboard/DriftTimeline.jsx'
import QuoteDrawer   from '../components/dashboard/QuoteDrawer.jsx'
import ComparePanel  from '../components/dashboard/ComparePanel.jsx'

const TABS = ['ALERTS', 'TIMELINE', 'COMPARE']

export default function DashboardPage() {
  const [activeTab, setActiveTab]         = useState('ALERTS')
  const [selectedAlert, setSelectedAlert] = useState(null)

  const handleTimelineSelect = (transition) => {
    setSelectedAlert(transition)
    setActiveTab('ALERTS')
  }

  const ticker = selectedAlert?.ticker ?? 'NVDA'

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Nav />

      {/* Tab bar — lean, no redundant title */}
      <div className="flex items-center justify-between px-6 border-b border-border bg-bg flex-shrink-0">
        <div className="flex">
          {TABS.map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-mono text-[10px] tracking-[0.5px] px-6 py-3.5 border-b-2 transition-colors ${
                activeTab === tab
                  ? 'text-gold border-gold'
                  : 'text-text-3 border-transparent hover:text-text-2'
              }`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-stable animate-pulse-dot" />
          <span className="font-mono text-[10px] text-signal-stable tracking-[1px]">LIVE</span>
        </div>
      </div>

      {/* ALERTS TAB */}
      {activeTab === 'ALERTS' && (
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar */}
          <div className="w-72 flex-shrink-0 overflow-hidden border-r border-border">
            <AlertSidebar
              selectedAlert={selectedAlert}
              onSelectAlert={setSelectedAlert}
            />
          </div>

          {/* Main panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedAlert ? (
              <>
                {/* Alert info bar */}
                <div className="px-6 py-4 border-b border-border flex-shrink-0 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-serif text-[22px] font-semibold text-text">
                        {selectedAlert.ticker}
                      </span>
                      <span className="font-mono text-[11px] text-text-3">
                        {selectedAlert.topic} · {selectedAlert.quarter_from} → {selectedAlert.quarter_to}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-text-3">
                      score: <span className="text-text-2">{selectedAlert.drift_score?.toFixed(6)}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('TIMELINE')}
                    className="font-mono text-[10px] text-text-3 border border-border px-3 py-1.5 hover:text-gold hover:border-gold/30 transition-colors">
                    VIEW TIMELINE →
                  </button>
                </div>

                {/* Timeline strip — fixed, never grows */}
                <div className="px-6 py-5 border-b border-border flex-shrink-0">
                  <DriftTimeline
                    ticker={selectedAlert.ticker}
                    selectedAlert={selectedAlert}
                    onSelectTransition={handleTimelineSelect}
                  />
                </div>

                {/* Quote drawer — fills all remaining space, scrolls fully */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <QuoteDrawer alert={selectedAlert} />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-serif text-[64px] text-border/40 leading-none mb-4">V</div>
                  <p className="font-mono text-[10px] text-text-3 tracking-[2px]">SELECT AN ALERT TO BEGIN</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TIMELINE TAB */}
      {activeTab === 'TIMELINE' && (
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-5 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[2px] text-gold">FULL DRIFT TIMELINE — {ticker}</span>
          </div>
          <div className="bg-surface border border-border p-6">
            <DriftTimeline
              ticker={ticker}
              selectedAlert={selectedAlert}
              onSelectTransition={handleTimelineSelect}
            />
          </div>
          <p className="font-mono text-[9px] text-text-3 mt-4">
            Click a highlighted dot to load that transition's evidence in the Alerts tab. Toggle topics using the buttons above the chart.
          </p>
        </div>
      )}

      {/* COMPARE TAB */}
      {activeTab === 'COMPARE' && (
        <div className="flex-1 overflow-y-auto">
          <ComparePanel ticker={ticker} />
        </div>
      )}
    </div>
  )
}