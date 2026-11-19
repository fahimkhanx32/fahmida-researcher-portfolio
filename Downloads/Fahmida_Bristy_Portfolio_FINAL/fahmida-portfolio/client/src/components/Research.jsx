/* RESEARCH INTERESTS — suggested research themes. Everything for this section is in this ONE file. */
import { LuInfo } from 'react-icons/lu'
import { motion } from 'framer-motion'
import { Badge, Icon, Section, glass } from './ui'
import { useSite } from '../lib/site'

export default function Research() {
  const { research } = useSite()
  return (
    <Section id="research" tone="tint">
      <div className="mb-10 flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm leading-relaxed text-ink">
        <LuInfo className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" aria-hidden="true" />
        <p>
          <strong className="font-semibold">Suggested, not confirmed.</strong> These areas are editable suggestions. They
          are not confirmed specializations and do not describe verified research experience.
        </p>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {research.map((area, i) => (
          <motion.li
            key={area.id}
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.09 }}
          >
            <article className={`${glass} group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-lift`}>
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-ink transition group-hover:bg-gold/25">
                  <Icon name={area.icon} className="h-6 w-6" />
                </span>
                <Badge tone="outline">Suggested</Badge>
              </div>
              <h3 className="mt-5 font-display text-xl font-medium leading-snug text-ink">{area.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{area.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Related topics for ${area.title}`}>
                {(area.topics || []).map((topic) => (
                  <li key={topic}>
                    <Badge tone="sage">{topic}</Badge>
                  </li>
                ))}
              </ul>
            </article>
          </motion.li>
        ))}
      </ul>
    </Section>
  )
}
