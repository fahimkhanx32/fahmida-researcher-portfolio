/* ABOUT — profile text blocks and registration card. Everything for this section is in this ONE file. */
import { motion } from 'framer-motion'
import { Badge, Section, glass } from './ui'
import { useSite } from '../lib/site'

export default function About() {
  const { profile, about } = useSite()
  const blocks = about.blocks
  return (
    <Section id="about">
      <div className="grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`${glass} rounded-2xl border border-line bg-surface p-6 shadow-card lg:sticky lg:top-28`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">Professional registration</p>
            <p className="mt-3 font-display text-2xl font-medium leading-snug text-ink">{profile.registration.body}</p>
            <p className="mt-1 text-sm text-muted">Registration number {profile.registration.number}</p>
            {about.highestQualification && (
              <>
                <hr className="my-5 border-line" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">Highest qualification</p>
                <p className="mt-3 text-sm leading-relaxed text-ink">{about.highestQualification}</p>
              </>
            )}
          </motion.div>
        </aside>

        <div className="lg:col-span-8">
          <ol className="divide-y divide-line">
            {blocks.map((block, i) => (
              <motion.li
                key={`${block.title}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="grid gap-3 py-7 first:pt-0 sm:grid-cols-[4rem_1fr] sm:gap-6"
              >
                <span className="font-display text-3xl text-gold/80" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium text-ink">{block.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{block.body}</p>
                </div>
              </motion.li>
            ))}
            <li className="grid gap-3 py-7 sm:grid-cols-[4rem_1fr] sm:gap-6">
              <span className="font-display text-3xl text-gold/80" aria-hidden="true">
                {String(blocks.length + 1).padStart(2, '0')}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-xl font-medium text-ink">Professional goals</h3>
                  {!about.goals && <Badge tone="outline">Placeholder</Badge>}
                </div>
                {about.goals ? (
                  <p className="mt-2 leading-relaxed text-muted">{about.goals}</p>
                ) : (
                  <p className="mt-2 rounded-xl border border-dashed border-line bg-surface/60 p-4 text-sm leading-relaxed text-muted">
                    Dr. Bristy&rsquo;s own statement of her professional and research goals will be added here.
                  </p>
                )}
              </div>
            </li>
          </ol>
        </div>
      </div>
    </Section>
  )
}
