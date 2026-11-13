import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu'
import Section from '../common/Section'
import Icon from '../common/Icon'
import ContactForm from '../contact/ContactForm'
import { academicProfiles, contactDetails } from '../../data/siteConfig'

export default function Contact() {
  const rows = [
    contactDetails.email && { icon: LuMail, label: 'Email', value: contactDetails.email, href: `mailto:${contactDetails.email}` },
    contactDetails.phone && { icon: LuPhone, label: 'Phone', value: contactDetails.phone, href: `tel:${contactDetails.phone}` },
    contactDetails.location && { icon: LuMapPin, label: 'Location', value: contactDetails.location },
  ].filter(Boolean)
  const links = academicProfiles.filter((p) => p.url)

  return (
    <Section
      id="contact"
      eyebrow="Contact & Collaboration"
      title="Start a conversation"
      intro="For research collaboration, academic invitations or questions about this work."
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {rows.length > 0 ? (
            <ul className="space-y-4">
              {rows.map(({ icon, label, value, href }) => {
                const RowIcon = icon
                return (
                <li key={label} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage text-ink">
                    <RowIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</span>
                    {href ? <a href={href} className="text-ink underline decoration-gold underline-offset-4">{value}</a> : <span className="text-ink">{value}</span>}
                  </span>
                </li>
                )
              })}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-surface/60 p-6">
              <p className="font-display text-lg font-medium text-ink">Direct contact details</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                A professional email address, phone number and location will be published here once confirmed. Until then, the collaboration form is the way to reach out.
              </p>
            </div>
          )}
          {links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3" aria-label="Academic profiles">
              {links.map((l) => (
                <li key={l.id}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" aria-label={l.label} className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition hover:border-gold hover:bg-sage/60">
                    <Icon name={l.icon} className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </Section>
  )
}
