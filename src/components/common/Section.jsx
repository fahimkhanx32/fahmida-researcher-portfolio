import Container from '../Container/Container'

// Shared section shell: anchor id, scroll-spy hook-up, heading block and background tone.
export default function Section({ id, navId, eyebrow, title, intro, tone = 'plain', children, headingAside }) {
  const headingId = `${id}-heading`
  return (
    <section
      id={id}
      data-nav={navId ?? id}
      tabIndex={-1}
      aria-labelledby={headingId}
      className={`scroll-mt-16 py-20 outline-none lg:py-28 ${tone === 'tint' ? 'border-y border-line bg-surface-2/60' : ''}`}
    >
      <Container>
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold-ink">
                <span className="h-px w-8 bg-gold" aria-hidden="true" />
                {eyebrow}
              </p>
            )}
            <h2 id={headingId} className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
              {title}
            </h2>
            {intro && <p className="mt-4 text-base leading-relaxed text-muted">{intro}</p>}
          </div>
          {headingAside}
        </div>
        {children}
      </Container>
    </section>
  )
}
