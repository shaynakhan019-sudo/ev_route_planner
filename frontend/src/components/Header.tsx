
import { Moon, Sun, Palette, ChevronDown, Menu } from 'lucide-react'
import { useTheme, type ThemeName } from '@/theme'

interface HeaderProps {
  onMenuClick: () => void
}

const themes: { name: ThemeName; label: string }[] = [
  { name: 'emerald', label: 'Mint Green' },
  { name: 'ocean', label: 'Powder Blue' },
  { name: 'sunset', label: 'Soft Peach' },
  { name: 'violet', label: 'Lavender' },
  { name: 'rose', label: 'Blush Pink' },
]

function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme, mode, setMode } = useTheme()

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur-md sm:px-8">

      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card hover:bg-muted md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 className="text-lg font-bold tracking-tight">
            Welcome to EcoRoute
          </h2>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Your smarter electric mobility dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">

        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card px-2 sm:px-3 py-2">
          <Palette size={17} className="text-muted-foreground" />

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeName)}
            className="max-w-[90px] cursor-pointer bg-transparent text-xs font-medium outline-none sm:max-w-none sm:text-sm"
            aria-label="Choose color theme"
          >
            {themes.map((item) => (
              <option key={item.name} value={item.name}>
                {item.label}
              </option>
            ))}
          </select>

          <ChevronDown size={14} className="hidden text-muted-foreground sm:block" />
        </div>

        <button
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card transition-colors hover:bg-muted"
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
