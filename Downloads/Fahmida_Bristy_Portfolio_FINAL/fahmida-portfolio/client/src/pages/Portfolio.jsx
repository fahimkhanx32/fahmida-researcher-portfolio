import { lazy, Suspense, useEffect, useState } from 'react'
import { LuLoaderCircle, LuRefreshCw } from 'react-icons/lu'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Research from '../components/Research'
import Publications from '../components/Publications'
import Projects from '../components/Projects'
import Experience from '../components/Experience'
import Education from '../components/Education'
import Achievements from '../components/Achievements'
import Profiles from '../components/Profiles'
import Footer, { BackToTop } from '../components/Footer'
import { scrollToSection } from '../components/ui'
import { SiteProvider, useSite, useSiteState } from '../lib/site'

/* =====================================================================================
   PORTFOLIO PAGE — the main site (route "/"). Loads the site from the API, then renders the sections the
   dashboard has switched on, in the order the dashboard set. Also owns the scroll-spy for the navbar.
   ===================================================================================== */

// Contact pulls in the Material UI form kit, so it loads separately (and is fetched in the background once the page is idle).
const loadContact = () => import('../components/Contact')
const Contact = lazy(loadContact)

const REGISTRY = { home: Hero, about: About, research: Research, publications: Publications, projects: Projects, experience: Experience, education: Education, achievements: Achievements, profiles: Profiles, contact: Contact }

// Tracks which `[data-nav]` section is currently under the sticky header.
function useScrollSpy(offset, deps) {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const sections = [...document.querySelectorAll('[data-nav]')]
    if (!sections.length) return undefined
    let frame = 0

    const compute = () => {
      frame = 0
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      let current = sections[0].dataset.nav
      if (atBottom) {
        current = sections[sections.length - 1].dataset.nav
      } else {
        for (const el of sections) {
          if (el.getBoundingClientRect().top <= offset) current = el.dataset.nav
        }
      }
      setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [offset, deps])

  return active
}

function PortfolioContent() {
  const site = useSite()
  const order = site.shown.map((s) => s.key).join(',')
  const activeId = useScrollSpy(180, order)

  // Honour a #section in the URL on first load.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => scrollToSection(id, { updateHash: false }))
  }, [])

  useEffect(() => {
    const t = setTimeout(loadContact, 800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.title = `${site.profile.name} — ${site.profile.eyebrow || 'Academic Portfolio'}`
  }, [site.profile.name, site.profile.eyebrow])

  return (
    <div className="min-h-screen overflow-x-clip bg-canvas font-ui text-ink antialiased dark:bg-[radial-gradient(900px_520px_at_78%_0%,rgba(255,255,255,0.075),transparent_65%),radial-gradient(700px_480px_at_8%_38%,rgba(255,255,255,0.03),transparent_70%),linear-gradient(180deg,#0d0f12_0%,#121419_48%,#0d0f12_100%)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-on-primary"
      >
        Skip to content
      </a>
      <Navbar activeId={activeId} />
      <main id="main">
        {site.shown.map((s) => {
          const Section = REGISTRY[s.key]
          return <Suspense key={s.key} fallback={null}><Section /></Suspense>
        })}
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

function Gate() {
  const { data, error, reload } = useSiteState()
  if (data) return <PortfolioContent />
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas px-6 text-center font-ui text-ink">
      {error ? (
        <>
          <p className="font-display text-2xl">The site could not be loaded</p>
          <p className="max-w-sm text-sm text-muted">{error.message}</p>
          <button type="button" onClick={reload} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:border-gold">
            <LuRefreshCw aria-hidden="true" /> Try again
          </button>
        </>
      ) : (
        <LuLoaderCircle className="h-8 w-8 animate-spin text-gold-ink" aria-label="Loading" />
      )}
    </div>
  )
}

export default function Portfolio() {
  return (
    <SiteProvider>
      <Gate />
    </SiteProvider>
  )
}
