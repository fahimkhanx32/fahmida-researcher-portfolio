import { useCallback, useEffect, useRef, useState } from 'react'
import { LuMenu, LuX } from 'react-icons/lu'
import Container from '../Container/Container'
import CvButton from '../common/CvButton'
import ThemeToggle from '../common/ThemeToggle'
import useScrolled from '../../hooks/useScrolled'
import { navigation, profile } from '../../data/siteConfig'
import { scrollToSection } from '../../utils/scroll'

export default function PortfolioNavbar({ activeId }) {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(8)
  const toggleRef = useRef(null)
  const panelRef = useRef(null)

  const close = useCallback((returnFocus = false) => {
    setOpen(false)
    if (returnFocus) toggleRef.current?.focus()
  }, [])

  // Mobile menu behaviour: Esc closes, scroll lock, Tab stays inside the menu, closes when widened to desktop.
  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector('a, button')?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close(true)
      if (e.key !== 'Tab') return
      const nodes = [toggleRef.current, ...panelRef.current.querySelectorAll('a[href], button:not([disabled])')]
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    const media = window.matchMedia('(min-width: 1280px)')
    const onChange = (e) => e.matches && setOpen(false)
    document.addEventListener('keydown', onKeyDown)
    media.addEventListener('change', onChange)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      media.removeEventListener('change', onChange)
    }
  }, [open, close])

  const go = (e, id) => {
    e.preventDefault()
    // Release the mobile menu's scroll lock first; a locked body would swallow the scroll below.
    document.body.style.overflow = ''
    setOpen(false)
    scrollToSection(id)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
          scrolled || open ? 'border-line bg-nav shadow-card' : 'border-transparent bg-nav/60'
        }`}
      >
        <Container className="flex h-16 items-center justify-between gap-4">
          <a
            href="#home"
            onClick={(e) => go(e, 'home')}
            className="group flex shrink-0 items-center gap-3 rounded-full"
            aria-label={`${profile.name} – back to top`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-sm font-semibold tracking-wide text-on-primary ring-1 ring-gold/70 ring-offset-2 ring-offset-canvas transition group-hover:ring-2">
              {profile.initials}
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[1.05rem] font-medium text-ink">{profile.name}</span>
              <span className="hidden whitespace-nowrap text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted 2xl:block">
                Veterinary doctor · Portfolio
              </span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => {
                const active = activeId === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => go(e, item.id)}
                      aria-current={active ? 'location' : undefined}
                      className={`relative block whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-sage/60 hover:text-ink ${
                        active ? 'text-ink' : 'text-muted'
                      }`}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-gold transition-transform duration-300 ${
                          active ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <CvButton size="sm">Download CV</CvButton>
            </div>
            <ThemeToggle />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition hover:border-gold xl:hidden"
            >
              {open ? <LuX className="h-5 w-5" aria-hidden="true" /> : <LuMenu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu is a sibling of the header (not a child) so the header's backdrop-filter cannot trap it. */}
      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="anim-fade fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-canvas px-4 pb-10 pt-6 xl:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="mx-auto max-w-md divide-y divide-line border-y border-line">
              {navigation.map((item) => {
                const active = activeId === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => go(e, item.id)}
                      aria-current={active ? 'location' : undefined}
                      className={`flex items-center justify-between py-4 font-display text-xl ${active ? 'text-gold-ink' : 'text-ink'}`}
                    >
                      {item.label}
                      {active && <span className="h-2 w-2 rounded-full bg-gold" aria-hidden="true" />}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="mx-auto mt-8 flex max-w-md justify-center">
            <CvButton size="lg" className="w-full sm:w-auto">Download Academic CV</CvButton>
          </div>
        </div>
      )}
    </>
  )
}
