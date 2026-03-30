import Nav          from '../components/shared/Nav.jsx'
import TickerTape   from '../components/shared/TickerTape.jsx'
import Hero         from '../components/landing/Hero.jsx'
import Methodology  from '../components/landing/Methodology.jsx'
import { StatsStrip, CTASection } from '../components/landing/Stats.jsx'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <Hero />
      <TickerTape />
      <Methodology />
      <StatsStrip />
      <CTASection />

      {/* Footer */}
      <footer className="px-14 py-7 border-t border-border flex items-center justify-between">
        <span className="font-serif text-[15px] font-semibold text-text">
          Veritas <span className="text-gold">AI</span>
        </span>
        <span className="font-mono text-[10px] text-text-3 tracking-[0.5px]">
          FinBERT · pgvector · FastAPI · Sarvam AI · React
        </span>
      </footer>
    </div>
  )
}