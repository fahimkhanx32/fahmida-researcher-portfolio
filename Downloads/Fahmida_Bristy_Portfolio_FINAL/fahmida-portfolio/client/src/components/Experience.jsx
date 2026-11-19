/* EXPERIENCE — timeline plus reserved categories. Everything for this section is in this ONE file. */
import { LuBriefcase, LuPlus } from 'react-icons/lu'
import { motion } from 'framer-motion'
import { EmptyState, Section, Timeline } from './ui'
import { useSite } from '../lib/site'

export default function Experience() {
  const { experience, experienceCategories } = useSite()
  return (
    <Section id="experience">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {experience.length ? <Timeline items={experience} icon={LuBriefcase} /> : <EmptyState compact message="Experience will be listed here once added." />}
        </div>
        {experienceCategories.length > 0 && (
        <div className="lg:col-span-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">Awaiting entries</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {experienceCategories.map((c, i) => (
              <motion.li key={c} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }} className="flex items-center gap-3 rounded-xl border border-dashed border-line bg-surface/60 px-4 py-3 text-sm text-muted">
                <LuPlus className="h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />
                {c}
              </motion.li>
            ))}
          </ul>
        </div>
        )}
      </div>
    </Section>
  )
}
