import { useEffect, useRef, useState } from 'react'
import { LuCircleCheck, LuInfo, LuLoaderCircle, LuSend } from 'react-icons/lu'
import Button from '../common/Button'
import { collaborationTypes } from '../../data/siteConfig'

const initialValues = { name: '', email: '', organization: '', subject: '', type: '', message: '' }

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (!v.subject.trim()) e.subject = 'Please add a subject.'
  else if (v.subject.trim().length < 4) e.subject = 'The subject should be at least 4 characters.'
  if (!v.type) e.type = 'Please choose a collaboration type.'
  if (!v.message.trim()) e.message = 'Please write a message.'
  else if (v.message.trim().length < 20) e.message = 'Please write at least 20 characters so the message has context.'
  return e
}

function Field({ id, label, optional, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-[#b3261e] dark:text-[#ff9b94]">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass = (error) =>
  `w-full rounded-xl border bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition focus:outline-none focus:ring-2 ${
    error ? 'border-[#b3261e] focus:ring-[#b3261e]/30 dark:border-[#ff9b94]' : 'border-line focus:border-gold focus:ring-gold/40'
  }`

export default function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const timer = useRef(0)
  const formRef = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const errors = validate(values)
  const shown = (name) => (touched[name] ? errors[name] : undefined)
  const bind = (name) => ({
    id: `cf-${name}`,
    name,
    value: values[name],
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    'aria-invalid': Boolean(shown(name)),
    'aria-describedby': shown(name) ? `cf-${name}-error` : undefined,
    disabled: status === 'submitting',
  })

  const onSubmit = (e) => {
    e.preventDefault()
    const all = Object.fromEntries(Object.keys(initialValues).map((k) => [k, true]))
    setTouched(all)
    const found = validate(values)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      formRef.current?.querySelector(`#cf-${firstInvalid}`)?.focus()
      return
    }
    setStatus('submitting')
    // Frontend demonstration only: no network request is made and nothing is stored or delivered.
    timer.current = setTimeout(() => setStatus('success'), 1400)
  }

  const reset = () => {
    setValues(initialValues)
    setTouched({})
    setStatus('idle')
  }

  if (status === 'success') {
    return (
      <div role="status" className="anim-pop rounded-3xl border border-line bg-surface p-8 text-center shadow-card sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage text-ink">
          <LuCircleCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-medium text-ink">Form submitted (demonstration)</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Thank you. This is a frontend preview, so <strong className="font-semibold text-ink">no message was sent</strong> and
          nothing was stored. Delivery will be connected in a later phase.
        </p>
        <Button variant="secondary" className="mt-6" onClick={reset}>Send another</Button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8">
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/10 p-3.5 text-xs leading-relaxed text-ink">
        <LuInfo className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />
        <p><strong className="font-semibold">Frontend demonstration.</strong> Submitting this form validates your input and shows a simulated result. No message is actually delivered yet.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="cf-name" label="Name" error={shown('name')}>
          <input type="text" autoComplete="name" placeholder="Your full name" className={inputClass(shown('name'))} {...bind('name')} />
        </Field>
        <Field id="cf-email" label="Email" error={shown('email')}>
          <input type="email" autoComplete="email" placeholder="name@institution.edu" className={inputClass(shown('email'))} {...bind('email')} />
        </Field>
        <Field id="cf-organization" label="Institution / Organization" optional>
          <input type="text" autoComplete="organization" placeholder="Where you work or study" className={inputClass()} {...bind('organization')} />
        </Field>
        <Field id="cf-type" label="Collaboration type" error={shown('type')}>
          <select className={inputClass(shown('type'))} {...bind('type')}>
            <option value="">Select a type</option>
            {collaborationTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field id="cf-subject" label="Subject" error={shown('subject')}>
            <input type="text" placeholder="What is this regarding?" className={inputClass(shown('subject'))} {...bind('subject')} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="cf-message" label="Message" error={shown('message')}>
            <textarea rows={6} placeholder="Describe your idea, question or collaboration proposal" className={`${inputClass(shown('message'))} resize-y`} {...bind('message')} />
          </Field>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-muted">All fields except institution are required.</p>
        <Button type="submit" size="lg" disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <LuLoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              <LuSend className="h-4 w-4" aria-hidden="true" /> Send inquiry
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
