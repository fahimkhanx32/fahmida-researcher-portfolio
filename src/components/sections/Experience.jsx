import { LuBriefcase, LuPlus } from 'react-icons/lu'
import Section from '../common/Section'
import Timeline from '../common/Timeline'
import { experience, futureExperienceCategories } from '../../data/timeline'

export default function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Academic and professional experience"
      intro="Verified experience appears in the timeline. Other categories are reserved for future entries."
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Timeline items={experience} icon={LuBriefcase} />
        </div>
        <div className="lg:col-span-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">Awaiting entries</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {futureExperienceCategories.map((c) => (
              <li key={c} className="flex items-center gap-3 rounded-xl border border-dashed border-line bg-surface/60 px-4 py-3 text-sm text-muted">
                <LuPlus className="h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
