import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LuChevronDown, LuLogIn, LuMail, LuMenu, LuMoon, LuPhone, LuSun, LuX } from 'react-icons/lu'
import { Button, Container, CvButton, anim, metal, scrollToSection, useScrolled } from './ui'
import { useSite } from '../lib/site'

/* =====================================================================================
   NAVBAR — everything that belongs to the navbar lives in this ONE file:
   top bar (phone · email · Light/Dark switch · Login) · main bar (logo · CV · nav · More · CTA)
   · spotlight beam · "More" dropdown · mobile menu · theme logic.
   Styling is Tailwind only. Links, CTA and contact details come from the dashboard.
   The full bar shows from 1024px up; below that the hamburger menu is used.
   ===================================================================================== */


/* ---------- style tokens ---------- */

const barBase =
  'border border-line backdrop-blur-[16px] backdrop-saturate-[1.4] shadow-card transition-colors duration-300'
const navLink =
  'relative z-[1] inline-flex items-center gap-[0.3rem] whitespace-nowrap rounded-full px-[0.62rem] py-2 font-display text-base text-muted transition-colors hover:text-ink aria-[current=location]:text-ink data-[active=true]:text-ink xl:px-[0.9rem] xl:py-[0.55rem] xl:text-[1.05rem]'
const contactLink =
  'inline-flex items-center gap-2 rounded-full p-2 text-sm text-ink transition-colors hover:text-gold-ink'
const outlinePill =
  'inline-flex items-center gap-2 rounded-full border border-pill bg-transparent text-ink transition hover:border-beam hover:bg-ink/8'
const divider = 'w-px flex-none bg-line'

/* ---------- theme (saved in localStorage; the first paint is handled by a script in index.html) ---------- */

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const choose = (wantDark) => {
    document.documentElement.classList.toggle('dark', wantDark)
    try {
      localStorage.setItem('theme', wantDark ? 'dark' : 'light')
    } catch {
      /* storage unavailable */
    }
    setDark(wantDark)
  }
  return [dark, choose]
}

/* ---------- segmented Light / Dark switch ---------- */

export function ThemeSwitch() {
  const [dark, choose] = useTheme()
  const seg = (on) =>
    `inline-flex min-h-8 items-center gap-1.5 rounded-full px-[0.7rem] py-1.5 text-xs font-medium transition ${
      on
        ? `${metal} text-on-primary shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_16px_var(--c-toggle-glow)]`
        : 'text-muted hover:text-ink'
    }`
  return (
    <div role="group" aria-label="Colour theme" className="inline-flex items-center rounded-full border border-pill bg-ink/6 p-0.5">
      <button type="button" aria-pressed={!dark} aria-label="Light theme" onClick={() => choose(false)} className={seg(!dark)}>
        <LuSun className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Light</span>
      </button>
      <button type="button" aria-pressed={dark} aria-label="Dark theme" onClick={() => choose(true)} className={seg(dark)}>
        <LuMoon className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  )
}

/* ---------- the navbar ---------- */

export default function Navbar({ activeId }) {
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [panelTop, setPanelTop] = useState(112)
  const [beam, setBeam] = useState(null) // { x, w, instant }
  const scrolled = useScrolled(8)
  const headerRef = useRef(null)
  const barRef = useRef(null)
  const { contactDetails, navCta, navigation, profile } = useSite()
  const primaryItems = navigation.filter((n) => !n.more)
  const moreItems = navigation.filter((n) => n.more)
  const toggleRef = useRef(null)
  const panelRef = useRef(null)
  const moreRef = useRef(null)
  const itemRefs = useRef({})
  const introDone = useRef(false)

  const close = useCallback((returnFocus = false) => {
    setOpen(false)
    if (returnFocus) toggleRef.current?.focus()
  }, [])

  // The spotlight follows the active section. Experience / Education / Contact live under "More".
  const targetKey = !activeId
    ? null
    : primaryItems.some((n) => n.id === activeId)
      ? activeId
      : moreItems.some((n) => n.id === activeId)
        ? 'more'
        : null

  const measure = useCallback(() => {
    const bar = barRef.current
    const el = targetKey ? itemRefs.current[targetKey] : null
    if (!bar || !el) return
    const b = bar.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    if (r.width === 0) return // desktop nav hidden at this width
    const w = r.width + 12
    const x = r.left - b.left - 6
    if (!introDone.current) {
      // First paint: start off to the left, then sweep in.
      introDone.current = true
      setBeam({ x: -w - 40, w, instant: true })
      requestAnimationFrame(() => requestAnimationFrame(() => setBeam({ x, w, instant: false })))
    } else {
      setBeam({ x, w, instant: false })
    }
  }, [targetKey])

  // Measure after layout. Deferred one frame so state is set from a callback, not directly inside the effect.
  useLayoutEffect(() => {
    const id = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(id)
  }, [measure])

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return undefined
    const ro = new ResizeObserver(() => measure())
    ro.observe(bar)
    window.addEventListener('resize', measure)
    document.fonts?.ready?.then(measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

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
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && setOpen(false)
    document.addEventListener('keydown', onKeyDown)
    media.addEventListener('change', onChange)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      media.removeEventListener('change', onChange)
    }
  }, [open, close])

  // "More" dropdown: outside click and Esc close it.
  useEffect(() => {
    if (!moreOpen) return undefined
    const onDown = (e) => {
      if (!moreRef.current?.contains(e.target)) setMoreOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMoreOpen(false)
        itemRefs.current.more?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen])

  // The mobile panel starts right under the header, so read the header's bottom edge when opening it.
  const toggleMenu = () => {
    if (!open) setPanelTop(Math.round(headerRef.current?.getBoundingClientRect().bottom ?? 112))
    setOpen((v) => !v)
  }

  const go = (e, id) => {
    e.preventDefault()
    // Release the mobile menu's scroll lock first; a locked body would swallow the scroll below.
    document.body.style.overflow = ''
    setOpen(false)
    setMoreOpen(false)
    scrollToSection(id)
  }

  const setRef = (key) => (el) => {
    itemRefs.current[key] = el
  }

  const barBg = scrolled || open ? 'bg-nav-strong' : 'bg-nav'

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 pt-2 sm:pt-3">
        <Container className="flex flex-col gap-2">
          {/* Top bar: contact on the left, theme + login on the right */}
          <div className={`${barBase} ${barBg} flex min-h-11 items-center justify-between gap-3 rounded-full px-3 sm:px-4`}>
            <div className="hidden items-center gap-1 md:flex">
              {contactDetails.phone && (
                <a className={contactLink} href={`tel:${contactDetails.phone.replace(/[^+\d]/g, '')}`}>
                  <LuPhone className="h-4 w-4 text-gold-ink" aria-hidden="true" />
                  {contactDetails.phone}
                </a>
              )}
              {contactDetails.phone && contactDetails.email && <span className={`${divider} h-4`} aria-hidden="true" />}
              {contactDetails.email && (
                <a className={contactLink} href={`mailto:${contactDetails.email}`}>
                  <LuMail className="h-4 w-4 text-gold-ink" aria-hidden="true" />
                  {contactDetails.email}
                </a>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ThemeSwitch />
              <Link to="/login" className={`${outlinePill} min-h-9 px-3.5 py-1.5 text-sm font-medium`}>
                <LuLogIn className="h-4 w-4" aria-hidden="true" />
                Login
              </Link>
            </div>
          </div>

          {/* Main bar */}
          <div
            ref={barRef}
            className={`${barBase} ${barBg} relative flex h-16 items-center justify-between gap-3 rounded-full pl-3 pr-3 sm:pl-4 lg:pr-4`}
          >
            {/* Spotlight: one beam that glides to the active item (clipped to the pill shape) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
              {beam && (
                <div
                  className={`absolute inset-y-0 left-0 hidden will-change-transform lg:block ${
                    beam.instant
                      ? 'transition-none'
                      : 'transition-[transform,width] duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none'
                  }`}
                  style={{ width: beam.w, transform: `translateX(${beam.x}px)` }}
                >
                  {/* soft cone of light */}
                  <span className="absolute inset-y-0 left-1/2 w-[170%] -translate-x-1/2 bg-linear-to-b from-beam-soft to-transparent to-90% blur-[5px] [clip-path:polygon(41%_0,59%_0,100%_100%,0_100%)]" />
                  {/* bright lamp on the top edge */}
                  <span className="absolute left-1/2 top-0 h-[3px] w-[56%] -translate-x-1/2 rounded-b-full bg-beam shadow-[0_0_14px_2px_var(--c-beam-soft),0_0_4px_var(--c-beam)]" />
                  {/* glow line on the bottom edge */}
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 bg-linear-to-r from-transparent via-beam to-transparent shadow-[0_0_12px_var(--c-beam-soft)]" />
                </div>
              )}
            </div>

            <a
              href="#home"
              onClick={(e) => go(e, 'home')}
              className="group relative z-[1] flex shrink-0 items-center gap-3 rounded-full"
              aria-label={`${profile.name} – back to top`}
            >
              <span className={`${metal} flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-semibold tracking-wide text-on-primary ring-1 ring-gold/70 ring-offset-2 ring-offset-transparent transition group-hover:ring-2`}>
                {profile.initials}
              </span>
              <span className="leading-tight">
                <span className="block whitespace-nowrap font-display text-[1.05rem] font-medium text-ink">{profile.name}</span>
                <span className="hidden whitespace-nowrap text-[0.66rem] font-medium uppercase tracking-[0.14em] text-muted xl:block">
                  {profile.title}
                </span>
              </span>
            </a>

            <div className="relative z-[1] hidden items-center gap-2 lg:flex xl:gap-3">
              <span className={`${divider} h-8`} aria-hidden="true" />
              <CvButton size="sm">
                <span>
                  <span className="sr-only xl:not-sr-only">Download </span>CV
                </span>
              </CvButton>
              <nav aria-label="Primary">
                <ul className="flex items-center">
                  {primaryItems.map((item) => (
                    <li key={item.id}>
                      <a
                        ref={setRef(item.id)}
                        href={`#${item.id}`}
                        onClick={(e) => go(e, item.id)}
                        aria-current={activeId === item.id ? 'location' : undefined}
                        className={navLink}
                      >
                        {item.short || item.label}
                      </a>
                    </li>
                  ))}
                  <li ref={moreRef} className={`relative ${moreItems.length ? '' : 'hidden'}`}>
                    <button
                      ref={setRef('more')}
                      type="button"
                      aria-expanded={moreOpen}
                      aria-haspopup="true"
                      aria-controls="nav-more-menu"
                      data-active={targetKey === 'more'}
                      onClick={() => setMoreOpen((v) => !v)}
                      className={navLink}
                    >
                      More
                      <LuChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                    {moreOpen && (
                      <div
                        id="nav-more-menu"
                        className={`${anim.pop} absolute right-0 top-[calc(100%+0.85rem)] z-[5] min-w-56 rounded-[1.25rem] border border-line bg-nav-solid p-2 shadow-lift`}
                      >
                        {moreItems.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => go(e, item.id)}
                            aria-current={activeId === item.id ? 'location' : undefined}
                            className="block rounded-xl px-3.5 py-2.5 font-display text-[1.05rem] text-ink hover:bg-sage aria-[current=location]:bg-sage"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                </ul>
              </nav>
              <span className={`${divider} h-8`} aria-hidden="true" />
              {navCta && (
                <Button href={`#${navCta.id}`} onClick={(e) => go(e, navCta.id)} size="sm" variant="primary">
                  {navCta.label}
                </Button>
              )}
            </div>

            <button
              ref={toggleRef}
              type="button"
              onClick={toggleMenu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:border-gold lg:hidden"
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
          style={{ top: panelTop }}
          className={`${anim.fade} fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-canvas px-4 pb-28 pt-6 lg:hidden`}
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
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3">
            <CvButton size="lg" className="w-full">Download Academic CV</CvButton>
            {navCta && (
              <Button href={`#${navCta.id}`} onClick={(e) => go(e, navCta.id)} size="lg" variant="secondary" className="w-full">
                {navCta.label}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
