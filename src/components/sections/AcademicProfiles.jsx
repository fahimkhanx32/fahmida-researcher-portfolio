import { LuArrowUpRight, LuLink } from 'react-icons/lu'
import Section from '../common/Section'
import Icon from '../common/Icon'
import EmptyState from '../common/EmptyState'
import { academicProfiles } from '../../data/siteConfig'

export default function AcademicProfiles() {
  const links = academicProfiles.filter((p) => p.url)
  return (
    <Section
      id="profiles"
      navId="contact"
      tone="tint"
      eyebrow="Academic Profiles"
      title="Find Dr. Bristy online"
    >
      {links.length === 0 ? (
        <EmptyState
          icon={LuLink}
          title="Profile links coming soon"
          message="Links to Google Scholar, ResearchGate, ORCID, LinkedIn and institutional profiles will appear here once they are confirmed."
        >
          <ul className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted" aria-label="Supported platforms">
            {academicProfiles.map((p) => (
              <li key={p.id} className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1">
                <Icon name={p.icon} className="h-3.5 w-3.5" />
                {p.label}
              </li>
            ))}
          </ul>
        </EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((p) => (
            <li key={p.id}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-lift"
              >
                <span className="flex items-center gap-3 font-medium text-ink">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage"><Icon name={p.icon} className="h-4 w-4" /></span>
                  {p.label}
                </span>
                <LuArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-ink" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
