import { LuArrowUp } from 'react-icons/lu'
import Container from '../Container/Container'
import Icon from '../common/Icon'
import { academicProfiles, contactDetails, navigation, profile } from '../../data/siteConfig'
import { scrollToSection, scrollToTop } from '../../utils/scroll'

export default function Footer() {
  const links = academicProfiles.filter((p) => p.url)
  const hasContact = Object.values(contactDetails).some(Boolean)

  return (
    <footer className="border-t border-line bg-surface-2/70">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-2xl font-medium text-ink">{profile.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Academic portfolio of a registered veterinary doctor and graduate of Sher-e-Bangla Agricultural University.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">Navigate</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
              {navigation.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(item.id)
                    }}
                    className="text-muted transition hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">Profiles &amp; contact</h2>
            {links.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {links.map((l) => (
                  <li key={l.id}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={l.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition hover:border-gold hover:bg-sage/60"
                    >
                      <Icon name={l.icon} className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {hasContact ? (
              <ul className="mt-4 space-y-1.5 text-sm text-muted">
                {contactDetails.email && <li><a className="hover:text-ink" href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></li>}
                {contactDetails.phone && <li>{contactDetails.phone}</li>}
                {contactDetails.location && <li>{contactDetails.location}</li>}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Contact details and academic profile links will appear here once confirmed. In the meantime, use the{' '}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('contact')
                  }}
                  className="text-ink underline decoration-gold underline-offset-4"
                >
                  collaboration form
                </a>
                .
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-medium text-ink transition hover:border-gold hover:bg-sage/60"
          >
            <LuArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            Back to top
          </button>
        </div>
      </Container>
    </footer>
  )
}
