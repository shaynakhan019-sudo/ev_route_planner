
import { NavLink } from 'react-router'
import { Leaf } from 'lucide-react'
import { navItems } from '@/config/navConfig'

function Sidebar() {
  return (
    <aside className="w-[76px] sm:w-60 lg:w-64 shrink-0 min-h-screen border-r border-border/70 bg-card/90 flex flex-col px-2 sm:px-4 py-6">

      {/* Logo */}
      <div className="flex items-center justify-center sm:justify-start gap-3 mb-10 px-1 sm:px-2">
        <div className="h-11 w-11 shrink-0 rounded-2xl bg-primary/35 flex items-center justify-center">
          <Leaf size={24} className="text-primary-foreground" />
        </div>

        <div className="hidden sm:block">
          <h1 className="font-bold text-lg tracking-tight">EcoRoute</h1>
          <p className="text-xs text-muted-foreground">EV Route Planner</p>
        </div>
      </div>

      <p className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-3">
        Workspace
      </p>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.title}
              className={({ isActive }) =>
                `flex items-center justify-center sm:justify-start gap-3 rounded-xl px-3 py-3.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/30 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className="hidden sm:inline">{item.title}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom information */}
      <div className="hidden sm:block rounded-2xl bg-muted/60 border border-border/60 p-4 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <Leaf size={17} className="text-primary-foreground" />
          <span className="text-sm font-semibold">Go Electric</span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Smarter routes for cleaner and greener journeys.
        </p>
      </div>

      <div className="border-t border-border/70 mt-5 pt-4 text-center text-xs text-muted-foreground">
        <span className="hidden sm:inline">EcoRoute · v1.0</span>
        <span className="sm:hidden">v1.0</span>
      </div>
    </aside>
  )
}

export default Sidebar
