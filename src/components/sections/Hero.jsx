import { LuArrowRight, LuMail } from 'react-icons/lu'
import Container from '../Container/Container'
import Button from '../common/Button'
import CvButton from '../common/CvButton'
import ProfilePhoto from '../common/ProfilePhoto'
import { profile } from '../../data/siteConfig'
import { scrollToSection } from '../../utils/scroll'

export default function Hero() {
  const go = (id) => (e) => {
    e.preventDefault()
    scrollToSection(id)
  }

  return (
    <section id="home" data-nav="home" tabIndex={-1} aria-labelledby="home-heading" className="relative scroll-mt-16 overflow-hidden outline-none">
      <div className="folio-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-sage/60 blur-3xl" aria-hidden="true" />

      <Container className="relative grid items-center gap-14 py-16 sm:py-20 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:gap-10 lg:py-16">
        <div className="anim-rise lg:col-span-7">
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold-ink">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            {profile.eyebrow}
          </p>
          <h1 id="home-heading" className="font-display text-[2.75rem] font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl xl:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-4 font-display text-xl italic text-gold-ink sm:text-2xl">{profile.title}</p>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/90">{profile.heroIntro}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{profile.heroBio}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <CvButton size="lg">Download Academic CV</CvButton>
            <Button href="#research" variant="secondary" size="lg" onClick={go('research')}>
              Explore Research
              <LuArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href="#contact" variant="ghost" size="lg" onClick={go('contact')}>
              <LuMail className="h-4 w-4" aria-hidden="true" />
              Collaborate
            </Button>
          </div>

          <dl className="mt-12 grid max-w-2xl gap-6 border-t border-line pt-6 sm:grid-cols-3">
            {profile.heroFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{fact.label}</dt>
                <dd className="mt-1.5 text-sm font-medium leading-snug text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="anim-rise lg:col-span-5" style={{ animationDelay: '0.12s' }}>
          <ProfilePhoto />
        </div>
      </Container>
    </section>
  )
}
