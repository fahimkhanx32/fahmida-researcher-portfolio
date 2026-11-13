import { useEffect } from 'react'
import PortfolioNavbar from '../components/layout/PortfolioNavbar'
import Footer from '../components/layout/Footer'
import BackToTop from '../components/layout/BackToTop'
import PreviewToggle from '../components/layout/PreviewToggle'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import ResearchInterests from '../components/sections/ResearchInterests'
import Publications from '../components/sections/Publications'
import Projects from '../components/sections/Projects'
import Experience from '../components/sections/Experience'
import Education from '../components/sections/Education'
import Achievements from '../components/sections/Achievements'
import AcademicProfiles from '../components/sections/AcademicProfiles'
import Contact from '../components/sections/Contact'
import { PreviewProvider } from '../context/PreviewContext'
import useScrollSpy from '../hooks/useScrollSpy'
import { scrollToSection } from '../utils/scroll'

function PortfolioContent() {
  const activeId = useScrollSpy(140)

  // Honour a #section in the URL on first load.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => scrollToSection(id, { updateHash: false }))
  }, [])

  return (
    <div className="folio min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-on-primary"
      >
        Skip to content
      </a>
      <PortfolioNavbar activeId={activeId} />
      <main id="main">
        <Hero />
        <About />
        <ResearchInterests />
        <Publications />
        <Projects />
        <Experience />
        <Education />
        <Achievements />
        <AcademicProfiles />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <PreviewToggle />
    </div>
  )
}

export default function PortfolioPage() {
  return (
    <PreviewProvider>
      <PortfolioContent />
    </PreviewProvider>
  )
}
