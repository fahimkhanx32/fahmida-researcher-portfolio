import { LuArrowRight, LuBadgeCheck, LuMail } from 'react-icons/lu'
import { Button, Container, CvButton, scrollToSection, silverText } from './ui'
import { motion } from 'framer-motion'
import { useSite } from '../lib/site'

/* =====================================================================================
   HERO — the first screen. Includes the arch-framed profile photo (placeholder until a photo is set
   in the dashboard). Everything for the hero lives in this ONE file.
   ===================================================================================== */

function ProfilePhoto() {
  const { photo, initials, registration } = useSite().profile
  return (
    <figure className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
      <motion.div
        animate={{ x: [0, 6, 0], y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-3 -top-3 h-full w-full rounded-t-[999px] rounded-b-3xl border border-gold/70"
        aria-hidden="true"
      />
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl border border-line bg-linear-to-b from-sage to-surface-2 shadow-lift">
        {photo ? (
          <img src={photo.src} alt={photo.alt} width="800" height="1000" decoding="async" className="h-full w-full object-cover" />
        ) : (
          <div role="img" aria-label="Profile photograph placeholder" className="flex h-full w-full flex-col items-center justify-center text-ink/70">
            <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M40 420 C 140 300, 260 340, 360 200" />
                <path d="M30 360 C 150 260, 250 300, 370 150" />
                <circle cx="120" cy="330" r="6" fill="currentColor" />
                <circle cx="230" cy="310" r="4" fill="currentColor" />
                <circle cx="318" cy="228" r="7" fill="currentColor" />
                <circle cx="300" cy="140" r="3" fill="currentColor" />
                <path d="M120 330 L230 310 L318 228 L300 140" />
              </g>
            </svg>
            <span className="relative flex h-28 w-28 items-center justify-center rounded-full border border-gold/70 bg-canvas/60 font-display text-4xl font-medium text-ink">
              {initials}
            </span>
            <figcaption className="relative mt-5 text-center">
              <span className="block text-xs font-semibold uppercase tracking-[0.18em]">Profile photograph</span>
              <span className="mt-1 block text-xs text-muted">Placeholder · photo to be added</span>
            </figcaption>
          </div>
        )}
      </div>

      <div className="absolute -bottom-5 left-1/2 flex w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-line bg-surface/95 px-4 py-3 shadow-lift backdrop-blur sm:-left-6 sm:w-auto sm:translate-x-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage text-ink">
          <LuBadgeCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-xs leading-snug">
          <span className="block font-semibold text-ink">Registered Veterinary Doctor</span>
          <span className="text-muted">
            {registration.body} · No. {registration.number}
          </span>
        </span>
      </div>
    </figure>
  )
}

export default function Hero() {
  const { profile } = useSite()
  const go = (id) => (e) => {
    e.preventDefault()
    scrollToSection(id)
  }

  return (
    <section id="home" data-nav="home" tabIndex={-1} aria-labelledby="home-heading" className="relative scroll-mt-32 overflow-hidden outline-none">
      {/* dot grid + soft glow behind the hero */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--c-line)_1px,transparent_1px)] bg-[length:26px_26px] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -right-40 top-6 h-[30rem] w-[34rem] rounded-full bg-sage/60 blur-3xl" aria-hidden="true" />

      <Container className="relative grid items-center gap-14 py-16 sm:py-20 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-12 lg:gap-10 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-7">
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold-ink">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            {profile.eyebrow}
          </p>
          <h1 id="home-heading" className={`font-display text-[2.75rem] font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl xl:text-7xl ${silverText}`}>
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
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.94, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-5">
          <ProfilePhoto />
        </motion.div>
      </Container>
    </section>
  )
}
