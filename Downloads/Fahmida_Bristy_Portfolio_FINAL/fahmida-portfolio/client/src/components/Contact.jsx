import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LuCircleCheck, LuLoaderCircle, LuMail, LuMapPin, LuMessageSquare, LuPhone, LuSend, LuTag, LuUserRound, LuBuilding2, LuType } from 'react-icons/lu'
import { Button, Icon, Section, glass } from './ui'
import { Field } from './forms'
import { api } from '../lib/api'
import { useSite } from '../lib/site'

/* =====================================================================================
   CONTACT — contact details, profile links and the collaboration form (Material UI floating-label fields).
   Messages are saved to the dashboard inbox and e-mailed to the owner. Everything for this section is in this ONE file.
   ===================================================================================== */

const initialValues = { name: '', email: '', organization: '', subject: '', type: '', message: '', website: '' }

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.subject.trim().length < 3) e.subject = 'Please add a subject.'
  if (!v.type) e.type = 'Please choose a collaboration type.'
  if (v.message.trim().length < 20) e.message = 'Please write at least 20 characters so the message has context.'
  return e
}

function ContactForm() {
  const { collaborationTypes, formEnabled } = useSite()
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [serverError, setServerError] = useState('')

  const errors = validate(values)
  const bind = (name) => ({
    name,
    value: values[name],
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    error: touched[name] ? errors[name] : undefined,
    disabled: status === 'submitting',
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    setTouched(Object.fromEntries(Object.keys(initialValues).map((k) => [k, true])))
    if (Object.keys(errors).length) return
    setStatus('submitting')
    setServerError('')
    try {
      // the organization is folded into the message so the owner sees it in the inbox
      const org = values.organization.trim()
      await api.post('/contact', {
        name: values.name, email: values.email, subject: values.subject, type: values.type, website: values.website,
        message: org ? `Institution: ${org}\n\n${values.message}` : values.message,
      })
      setStatus('success')
    } catch (err) {
      setServerError(err.message)
      setStatus('idle')
    }
  }

  const reset = () => {
    setValues(initialValues)
    setTouched({})
    setStatus('idle')
  }

  if (!formEnabled) {
    return (
      <div className={`${glass} rounded-3xl border border-dashed border-line bg-surface/60 p-8 text-center`}>
        <p className="font-display text-xl font-medium text-ink">The contact form is paused</p>
        <p className="mt-2 text-sm text-muted">Please use the email address or phone number shown here to get in touch.</p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'success' ? (
        <motion.div key="ok" role="status" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`${glass} rounded-3xl border border-line bg-surface p-8 text-center shadow-card sm:p-10`}>
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }} className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage text-ink">
            <LuCircleCheck className="h-7 w-7" aria-hidden="true" />
          </motion.span>
          <h3 className="mt-5 font-display text-2xl font-medium text-ink">Message sent</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">Thank you. Your message has been delivered and you will hear back by email.</p>
          <Button variant="secondary" className="mt-6" onClick={reset}>Send another</Button>
        </motion.div>
      ) : (
        <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={onSubmit} noValidate className={`${glass} rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8`}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" icon={LuUserRound} autoComplete="name" {...bind('name')} />
            <Field label="Email" icon={LuMail} type="email" autoComplete="email" {...bind('email')} />
            <Field label="Institution / Organization (optional)" icon={LuBuilding2} autoComplete="organization" {...bind('organization')} />
            <Field label="Collaboration type" icon={LuTag} options={collaborationTypes} {...bind('type')} />
            <div className="sm:col-span-2">
              <Field label="Subject" icon={LuType} {...bind('subject')} />
            </div>
            <div className="sm:col-span-2">
              <Field label="Message" icon={LuMessageSquare} multiline minRows={5} {...bind('message')} />
            </div>
            {/* honeypot: invisible to people, tempting to bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>Website<input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))} /></label>
            </div>
          </div>

          {serverError && <p role="alert" className="mt-5 rounded-xl border border-[#b3261e]/50 bg-[#b3261e]/10 px-4 py-3 text-sm text-ink">{serverError}</p>}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-muted">All fields except institution are required.</p>
            <Button type="submit" size="lg" disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
              {status === 'submitting' ? (<><LuLoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…</>) : (<><LuSend className="h-4 w-4" aria-hidden="true" /> Send inquiry</>)}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

export default function Contact() {
  const { contactDetails, academicProfiles } = useSite()
  const rows = [
    contactDetails.email && { icon: LuMail, label: 'Email', value: contactDetails.email, href: `mailto:${contactDetails.email}` },
    contactDetails.phone && { icon: LuPhone, label: 'Phone', value: contactDetails.phone, href: `tel:${contactDetails.phone}` },
    contactDetails.location && { icon: LuMapPin, label: 'Location', value: contactDetails.location },
  ].filter(Boolean)
  const links = academicProfiles.filter((p) => p.url)

  return (
    <Section id="contact">
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
