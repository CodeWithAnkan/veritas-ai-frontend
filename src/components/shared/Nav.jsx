import { Link, useLocation } from 'react-router-dom'
import { clsx } from '../../lib/utils.js'

export default function Nav() {
  const { pathname } = useLocation()
  const isDash = pathname.startsWith('/dashboard')
  const isSearch = pathname.startsWith('/search')

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between
                    px-14 py-5 border-b border-border
                    bg-bg/95 backdrop-blur-xl">
      {/* Logo */}
      <Link to="/" className="font-serif text-xl font-semibold tracking-wide">
        Veritas <span className="text-gold">AI</span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-9">
        {[
          { label: 'DASHBOARD', to: '/dashboard' },
          { label: 'SEARCH',    to: '/search'    },
          { label: 'METHODOLOGY', to: '/#methodology' },
          { label: 'GITHUB',    to: 'https://github.com/CodeWithAnkan/veritas-ai-frontend', external: true },
        ].map(({ label, to, external }) => (
          external
            ? <a key={label} href={to} target="_blank" rel="noreferrer"
                className="font-mono text-[10px] tracking-[2px] text-text-3
                           hover:text-text-2 transition-colors">
                {label}
              </a>
            : <Link key={label} to={to}
                className={clsx(
                  'font-mono text-[10px] tracking-[2px] transition-colors',
                  (isDash && label === 'DASHBOARD') || (isSearch && label === 'SEARCH')
                    ? 'text-gold'
                    : 'text-text-3 hover:text-text-2'
                )}>
                {label}
              </Link>
        ))}
      </div>

      {/* CTA */}
      <Link to="/dashboard"
        className="font-mono text-[11px] tracking-[1.5px] text-gold
                   border border-gold/30 px-5 py-2
                   hover:bg-gold/8 hover:border-gold/60
                   transition-all duration-200">
        OPEN DASHBOARD
      </Link>
    </nav>
  )
}