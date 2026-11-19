/* eslint-disable react-refresh/only-export-components */
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  LuBookOpen, LuDownload, LuImage, LuMapPin, LuX,
  LuStethoscope, LuHeartPulse, LuShieldCheck, LuPawPrint, LuGlobe, LuFlaskConical,
  LuUsers, LuPresentation, LuGraduationCap, LuBadgeCheck, LuAward,
} from 'react-icons/lu'
import { FaLinkedinIn, FaOrcid, FaResearchgate, FaGoogleScholar } from 'react-icons/fa6'
import { motion } from 'framer-motion'
import { useSite } from '../lib/site'

/* =====================================================================================
   SHARED UI — every small reusable piece lives in this ONE file:
   style tokens · helpers · Container · Section · Button · CvButton · Badge · Icon ·
   EmptyState · ImagePlaceholder · Modal · Timeline
   Styling is Tailwind only. Colours come from the design tokens in src/index.css.
   ===================================================================================== */

/* ---------- style tokens (Tailwind class strings reused across the site) ---------- */

// Primary surface: solid colour in light mode, brushed-silver gradient in dark mode.
export const metal = 'bg-primary dark:bg-linear-[135deg,#f4f5f7_0%,#c4c9d0_52%,#e4e6ea_100%]'
// Silver headline: white fading to cool grey (dark mode only; large text so contrast stays high).
export const silverText =
  'dark:bg-linear-to-b dark:from-white dark:from-0% dark:via-[#cdd2d9] dark:via-[48%] dark:to-[#959ba5] dark:to-100% dark:bg-clip-text dark:text-transparent'
// Frosted-glass blur for cards (dark mode).
export const glass = 'dark:backdrop-blur-[14px] dark:backdrop-saturate-[1.25]'
// Fade-in animations (keyframes are declared in index.css). Disabled for reduced motion.
export const anim = {
  rise: 'animate-rise motion-reduce:animate-none',
  pop: 'animate-pop motion-reduce:animate-none',
  fade: 'animate-fade motion-reduce:animate-none',
}

/* ---------- helpers ---------- */

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function scrollToSection(id, { updateHash = true } = {}) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  if (updateHash) history.replaceState(null, '', `#${id}`)
  // Move keyboard / screen-reader focus to the section without a second scroll jump.
  el.focus({ preventScroll: true })
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  history.replaceState(null, '', window.location.pathname)
}

// True once the page has scrolled past `threshold` pixels.
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

/* ---------- Container: the one width/padding every section and the navbar share ---------- */

export function Container({ children, className = '' }) {
  return <div className={`mx-auto max-w-7xl px-4 lg:px-8 ${className}`}>{children}</div>
}

/* ---------- Section: anchor id, scroll-spy hook-up, heading block and background tone ---------- */

export function Section({ id, tone = 'plain', children, headingAside }) {
  const site = useSite()
  const cfg = site.sectionConfig(id) ?? {}
  const { eyebrow, title, intro } = cfg // headings come from the dashboard (Sections manager)
  const headingId = `${id}-heading`
  return (
    <section
      id={id}
      data-nav={site.navIdFor(id)}
      tabIndex={-1}
      aria-labelledby={headingId}
      className={`scroll-mt-32 py-20 outline-none lg:py-28 ${tone === 'tint' ? 'border-y border-line bg-surface-2/60' : ''}`}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold-ink">
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ originX: 0 }}
                  className="h-px w-8 bg-gold"
                  aria-hidden="true"
                />
                {eyebrow}
              </p>
            )}
            <h2 id={headingId} className={`font-display text-3xl font-medium leading-tight text-ink sm:text-4xl ${silverText}`}>
              {title}
            </h2>
            {intro && <p className="mt-4 text-base leading-relaxed text-muted">{intro}</p>}
          </div>
          {headingAside}
        </motion.div>
        {children}
      </Container>
    </section>
  )
}

/* ---------- Button: renders an <a> when `href` is supplied, otherwise a <button> ---------- */

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60'
const buttonVariants = {
  primary: `${metal} text-on-primary shadow-card hover:-translate-y-0.5 hover:shadow-lift hover:brightness-110`,
  secondary: 'border border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-gold hover:shadow-card',
  ghost: 'text-ink hover:bg-sage/70',
}
const buttonSizes = { sm: 'px-4 py-2 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-[0.95rem]' }

export function Button({ href, variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const classes = `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}

/* ---------- CvButton: downloads the CV when a file is configured, else explains it is pending ---------- */

export function CvButton({ children = 'Download CV', variant = 'primary', size = 'md', className = '', onActivate }) {
  const { profile } = useSite()
  const [notice, setNotice] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  if (profile.cvUrl) {
    return (
      <Button href={profile.cvUrl} target="_blank" rel="noopener noreferrer" download variant={variant} size={size} className={className} onClick={onActivate}>
        <LuDownload className="h-4 w-4" aria-hidden="true" />
        {children}
      </Button>
    )
  }

  const show = () => {
    setNotice(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setNotice(false), 4000)
  }

  return (
    <span className="relative inline-flex">
      <Button variant={variant} size={size} className={className} aria-disabled="true" onClick={show}>
        <LuDownload className="h-4 w-4" aria-hidden="true" />
        {children}
      </Button>
      <span role="status" className="sr-only">
        {notice ? 'The CV is not available yet.' : ''}
      </span>
      {notice && (
        <span
          aria-hidden="true"
          className={`${anim.pop} absolute left-1/2 top-full z-30 mt-2 w-56 -translate-x-1/2 rounded-xl border border-line bg-surface px-3 py-2 text-center text-xs font-normal leading-snug text-ink shadow-lift`}
        >
          The CV file has not been added yet. It will be downloadable once supplied.
        </span>
      )}
    </span>
  )
}

/* ---------- Badge ---------- */

const badgeTones = {
  neutral: 'border-line bg-surface-2 text-muted',
  gold: 'border-gold/50 bg-gold/15 text-gold-ink',
  sage: 'border-transparent bg-sage text-ink',
  outline: 'border-line bg-transparent text-muted',
}

export function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium tracking-wide ${badgeTones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

/* ---------- Icon: resolves an icon by key so data files stay free of component imports ---------- */

const iconMap = {
  stethoscope: LuStethoscope,
  heart: LuHeartPulse,
  shield: LuShieldCheck,
  paw: LuPawPrint,
  globe: LuGlobe,
  flask: LuFlaskConical,
  users: LuUsers,
  presentation: LuPresentation,
  graduation: LuGraduationCap,
  badge: LuBadgeCheck,
  award: LuAward,
  linkedin: FaLinkedinIn,
  orcid: FaOrcid,
  researchgate: FaResearchgate,
  scholar: FaGoogleScholar,
}

export function Icon({ name, className = 'h-5 w-5', ...rest }) {
  const Component = iconMap[name] ?? LuGlobe
  return <Component className={className} aria-hidden="true" {...rest} />
}

/* ---------- EmptyState ---------- */

export function EmptyState({ title, message, icon = LuBookOpen, compact = false, children }) {
  const IconComponent = icon
  return (
    <div className={`rounded-2xl border border-dashed border-line bg-surface/60 text-center ${compact ? 'px-5 py-6' : 'px-6 py-14'}`}>
      <span className={`mx-auto flex items-center justify-center rounded-full bg-sage text-ink ${compact ? 'h-9 w-9' : 'h-12 w-12'}`}>
        <IconComponent className={compact ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden="true" />
      </span>
      {title && <h3 className="mt-4 font-display text-lg font-medium text-ink">{title}</h3>}
      <p className={`mx-auto max-w-md text-sm leading-relaxed text-muted ${title ? 'mt-1.5' : 'mt-3'}`}>{message}</p>
      {children}
    </div>
  )
}

/* ---------- ImagePlaceholder: neutral stand-in for imagery not supplied yet ---------- */

export function ImagePlaceholder({ label = 'Image to be added', className = '' }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex flex-col items-center justify-center gap-2 overflow-hidden bg-linear-to-br from-sage to-surface-2 text-muted ${className}`}
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
        <defs>
          <pattern id="folio-hex" width="28" height="24" patternUnits="userSpaceOnUse">
            <path d="M7 0l7 4v8l-7 4-7-4V4zM21 12l7 4v8l-7 4-7-4v-8z" fill="none" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#folio-hex)" />
      </svg>
      <LuImage className="relative h-6 w-6" aria-hidden="true" />
      <span className="relative text-xs font-medium tracking-wide">{label}</span>
    </div>
  )
}

/* ---------- Modal: focus trap, Esc to close, scroll lock, focus restored on close ---------- */

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function Modal({ open, onClose, eyebrow, title, children }) {
  const panelRef = useRef(null)
  const closeRef = useRef(onClose)
  const titleId = useId()

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    const items = () => [...panel.querySelectorAll(FOCUSABLE)]
    ;(items()[0] ?? panel).focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
      } else if (e.key === 'Tab') {
        const list = items()
        if (!list.length) return e.preventDefault()
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center font-ui text-ink antialiased sm:items-center sm:p-6">
      <div className={`${anim.fade} absolute inset-0 bg-black/70 backdrop-blur-sm`} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`${anim.pop} ${glass} relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-lift outline-none sm:rounded-3xl`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
          <div className="min-w-0">
            {eyebrow && <div className="mb-2 flex flex-wrap items-center gap-2">{eyebrow}</div>}
            <h2 id={titleId} className="font-display text-xl font-medium leading-snug text-ink sm:text-2xl">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:border-gold hover:bg-sage/60"
          >
            <LuX className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>
        <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

/* ---------- Timeline: vertical academic timeline. Items: { id, dateLabel, title, organization, location, description } ---------- */

export function Timeline({ items, icon }) {
  const IconComponent = icon
  return (
    <ol className="relative space-y-6 pl-8 sm:pl-10">
      {/* the spine draws itself downward as the timeline scrolls into view */}
      <motion.span
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        style={{ originY: 0 }}
        className="absolute bottom-0 left-0 top-0 w-px bg-line"
      />
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.08 }}
          className="relative"
        >
          <span
            aria-hidden="true"
            className="absolute -left-[2.85rem] top-5 flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 bg-canvas text-gold-ink sm:-left-[3.35rem]"
          >
            <IconComponent className="h-4 w-4" />
          </span>
          <article className={`${glass} rounded-2xl border border-line bg-surface p-6 shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-lift`}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">{item.dateLabel}</p>
            <h3 className="mt-2 font-display text-xl font-medium leading-snug text-ink">{item.title}</h3>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span className="font-medium text-ink">{item.organization}</span>
              {item.location && (
                <span className="inline-flex items-center gap-1">
                  <LuMapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.location}
                </span>
              )}
            </p>
            {item.description && <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>}
          </article>
        </motion.li>
      ))}
    </ol>
  )
}
