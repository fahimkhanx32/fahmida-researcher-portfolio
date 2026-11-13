import { LuBadgeCheck, LuGraduationCap } from 'react-icons/lu'
import Section from '../common/Section'
import Timeline from '../common/Timeline'
import { education } from '../../data/timeline'
import { profile } from '../../data/siteConfig'

export default function Education() {
  return (
    <Section id="education" tone="tint" eyebrow="Education" title="Academic qualifications">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Timeline items={education} icon={LuGraduationCap} />
        </div>
        <aside className="lg:col-span-5">
          <div className="rounded-2xl border border-gold/50 bg-surface p-6 shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage text-ink">
              <LuBadgeCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">Professional credential</p>
            <h3 className="mt-2 font-display text-xl font-medium text-ink">Registered Veterinary Doctor</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {profile.registration.body}
              <br />
              Registration number {profile.registration.number}
            </p>
          </div>
        </aside>
      </div>
    </Section>
  )
}
