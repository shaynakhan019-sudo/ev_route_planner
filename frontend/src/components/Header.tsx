
import { Moon, Sun, Palette, Leaf } from 'lucide-react'
import { useLocation } from 'react-router'
import { useTheme, type ThemeName } from '@/theme'

const themes: { name: ThemeName; label: string }[] = [
  { name: 'emerald', label: 'Mint Green' },
  { name: 'ocean', label: 'Powder Blue' },
  { name: 'sunset', label: 'Peach' },
  { name: 'violet', label: 'Lavender' },
  { name: 'rose', label: 'Blush Pink' },
]

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/route-planner': 'Route Planner',
  '/charging-stations': 'Charging Stations',
  '/map': 'Explore Map',
  '/settings': 'Settings',
}

function Header() {
  const { theme, setTheme, mode, setMode } = useTheme()
  const location = useLocation()
  const pageTitle = pageNames[location.pathname] || 'EcoRoute'

  return (
    <header className="sticky top-0 z-20 h-[76px] border-b border-border/70 bg-background/90 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8">

      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/30 flex items-center justify-center sm:hidden">
          <Leaf size={19} className="text-primary-foreground" />
        </div>

        <div>
          <h2 className="font-bold text-base sm:text-lg">{pageTitle}</h2>
          <p className="hidden sm:block text-xs text-muted-foreground">
            Your smarter electric mobility workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card px-2 sm:px-3 py-2">
          <Palette size={17} className="text-muted-foreground" />

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeName)}
            className="max-w-[92px] sm:max-w-none bg-transparent text-xs sm:text-sm outline-none cursor-pointer"
            aria-label="Choose color theme"
          >
            {themes.map((item) => (
              <option key={item.name} value={item.name}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          className="h-10 w-10 flex items-center justify-center rounded-xl border border-border/70 bg-card hover:bg-muted transition-colors"
          aria-label="Toggle theme mode"
          title="Toggle light and dark mode"
        >
          {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  )
}

export default Header
