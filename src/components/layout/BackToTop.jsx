import { LuArrowUp } from 'react-icons/lu'
import useScrolled from '../../hooks/useScrolled'
import { scrollToTop } from '../../utils/scroll'

// Floating shortcut that appears after the first screen.
export default function BackToTop() {
  const visible = useScrolled(700)
  if (!visible) return null
  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="anim-fade fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 bg-primary text-on-primary shadow-lift transition hover:-translate-y-0.5"
    >
      <LuArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
