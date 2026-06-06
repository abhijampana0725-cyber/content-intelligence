import { NavLink } from 'react-router-dom'

type Props = { onLogout: () => void }

export default function Navbar({ onLogout }: Props) {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors'
  const active = 'bg-white/10 text-white'
  const inactive = 'text-gray-400 hover:text-white'

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#69C9D0] to-[#EE1D52] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            CI
          </div>
          <div>
            <p className="font-semibold text-white text-sm leading-tight">Content Intelligence</p>
            <p className="text-xs text-gray-500">TikTok analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <NavLink to="/profile" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Profile</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Dashboard</NavLink>
          <NavLink to="/top-performers" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Top Performers</NavLink>
          <NavLink to="/strategist" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>Strategist</NavLink>
        </div>

        <button
          onClick={onLogout}
          className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded border border-border hover:border-gray-500"
        >
          Disconnect
        </button>
      </div>
    </nav>
  )
}
