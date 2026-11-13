import { LuMoon, LuSun } from 'react-icons/lu'
import { useTheme } from '../ThemeChanger/Theme'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all duration-200 hover:border-gold hover:shadow-card ${className}`}
    >
      {isDark ? <LuSun className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" /> : <LuMoon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />}
    </button>
  )
}
