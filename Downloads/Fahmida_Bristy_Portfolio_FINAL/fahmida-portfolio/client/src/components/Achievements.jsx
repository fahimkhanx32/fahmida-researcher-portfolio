import { LuMapPin, LuPaperclip } from 'react-icons/lu'
import { motion } from 'framer-motion'
import { EmptyState, Icon, Section, glass } from './ui'
import { useSite } from '../lib/site'
import { achievementCategories } from '../data/achievements'

/* ACHIEVEMENTS — conferences, training and awards. Everything for this section is in this ONE file. */

export default function Achievements() {
  const { achievements } = useSite()
  return (
    <Section id="achievements">
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {achievementCategories.map((cat, ci) => {
          const items = achievements.filter((a) => a.category === cat.id)
          return (
            <motion.li key={cat.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -40px 0px' }} transition={{ duration: 0.5, delay: (ci % 3) * 0.08 }}>
              <section aria-labelledby={`ach-${cat.id}`} className={`${glass} flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-card`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-ink">
                    <Icon name={cat.icon} className="h-5 w-5" />
                  </span>
                  <h3 id={`ach-${cat.id}`} className="font-display text-lg font-medium text-ink">{cat.title}</h3>
                </div>
                <div className="mt-5 flex-1 space-y-4">
                  {items.length === 0 ? (
                    <EmptyState compact message={cat.empty} />
                  ) : (
                    items.map((a) => (
                      <article key={a.id} className="rounded-xl border border-line bg-canvas/60 p-4">
                        <h4 className="text-sm font-semibold text-ink">{a.title}</h4>
                        <p className="mt-1 text-xs text-muted">{a.organization} · {a.date}</p>
                        {a.location && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                            <LuMapPin className="h-3 w-3" aria-hidden="true" /> {a.location}
                          </p>
                        )}
                        {a.description && <p className="mt-2 text-xs leading-relaxed text-muted">{a.description}</p>}
                        {a.attachmentUrl && (
                          <a href={a.attachmentUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-ink underline decoration-gold underline-offset-4">
                            <LuPaperclip className="h-3 w-3" aria-hidden="true" /> Certificate / attachment
                          </a>
                        )}
                      </article>
                    ))
                  )}
                </div>
              </section>
            </motion.li>
          )
        })}
      </ul>
    </Section>
  )
}
