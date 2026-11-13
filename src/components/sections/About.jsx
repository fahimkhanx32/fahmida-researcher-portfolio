import Section from '../common/Section'
import Badge from '../common/Badge'
import { profile } from '../../data/siteConfig'

const blocks = [
  {
    title: 'Professional introduction',
    body: 'Dr. Fahmida Bristy is a registered veterinary doctor. She holds a Bachelor of Science in Veterinary Science and Animal Husbandry from Sher-e-Bangla Agricultural University and is registered with the Bangladesh Veterinary Council.',
  },
  {
    title: 'Academic journey',
    body: 'Her studies progressed from the Secondary School Certificate in 2016 and the Higher Secondary Certificate in 2018, both in Naogaon, to university enrollment on 10 December 2019 and graduation in 2026.',
  },
  {
    title: 'Veterinary science background',
    body: 'At Sher-e-Bangla Agricultural University she studied Animal Science and Veterinary Medicine, building a foundation across animal biology, health and husbandry.',
  },
  {
    title: 'Current academic and research development',
    body: 'Her research profile is at an early stage. The research areas listed on this site are suggestions that she can refine; they are not confirmed specializations, and verified publications and projects will be added as work progresses.',
  },
  {
    title: 'International academic exposure',
    body: 'Since 4 January 2026 she has been gaining academic experience at Prince of Songkla University in Thailand.',
  },
]

export default function About() {
  return (
    <Section id="about" eyebrow="About" title="An academic path in veterinary science">
      <div className="grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">Professional registration</p>
            <p className="mt-3 font-display text-2xl font-medium leading-snug text-ink">{profile.registration.body}</p>
            <p className="mt-1 text-sm text-muted">Registration number {profile.registration.number}</p>
            <hr className="my-5 border-line" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">Highest qualification</p>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              B.Sc. in Veterinary Science and Animal Husbandry, Sher-e-Bangla Agricultural University, 2026
            </p>
          </div>
        </aside>

        <div className="lg:col-span-8">
          <ol className="divide-y divide-line">
            {blocks.map((block, i) => (
              <li key={block.title} className="grid gap-3 py-7 first:pt-0 sm:grid-cols-[4rem_1fr] sm:gap-6">
                <span className="font-display text-3xl text-gold/80" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium text-ink">{block.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{block.body}</p>
                </div>
              </li>
            ))}
            <li className="grid gap-3 py-7 sm:grid-cols-[4rem_1fr] sm:gap-6">
              <span className="font-display text-3xl text-gold/80" aria-hidden="true">06</span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-xl font-medium text-ink">Professional goals</h3>
                  <Badge tone="outline">Placeholder</Badge>
                </div>
                <p className="mt-2 rounded-xl border border-dashed border-line bg-surface/60 p-4 text-sm leading-relaxed text-muted">
                  Dr. Bristy&rsquo;s own statement of her professional and research goals will be added here.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </Section>
  )
}
