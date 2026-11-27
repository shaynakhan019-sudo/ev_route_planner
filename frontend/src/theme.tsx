
import React, { createContext, useContext, useEffect, useState } from 'react'

export type ThemeName = 'emerald' | 'ocean' | 'sunset' | 'violet' | 'rose'
export type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  theme: ThemeName
  mode: ThemeMode
  setTheme: (theme: ThemeName) => void
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() =>
    (localStorage.getItem('app-theme') as ThemeName) || 'emerald'
  )

  const [mode, setMode] = useState<ThemeMode>(() =>
    (localStorage.getItem('app-mode') as ThemeMode) || 'light'
  )

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.classList.toggle('dark', mode === 'dark')

    localStorage.setItem('app-theme', theme)
    localStorage.setItem('app-mode', mode)
  }, [theme, mode])

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return context
}
