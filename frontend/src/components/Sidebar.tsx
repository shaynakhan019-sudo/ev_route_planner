
import { NavLink } from 'react-router'
import { Leaf, Zap, X } from 'lucide-react'
import { navItems } from '@/config/navConfig'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex min-h-screen w-64 shrink-0 flex-col border-r border-border/70 bg-card px-5 py-6 transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="mb-10 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/35">
            <Leaf size={24} className="text-foreground" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">EcoRoute</h1>
            <p className="text-xs text-muted-foreground">EV Route Planner</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-muted md:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Main Menu
      </p>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/35 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Icon size={19} className="shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-border/70 bg-muted/50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/35">
            <Zap size={17} className="text-foreground" />
          </div>
          <span className="text-sm font-semibold">Drive Greener</span>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Discover efficient routes and make every journey smarter.
        </p>
      </div>

      <div className="mt-5 border-t border-border/70 pt-4 text-center text-xs text-muted-foreground">
        EcoRoute · Version 1.0
      </div>
    </aside>
  )
}

export default Sidebar
