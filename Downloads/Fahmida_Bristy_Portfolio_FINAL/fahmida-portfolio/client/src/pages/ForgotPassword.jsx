import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LuArrowLeft, LuLoaderCircle, LuSend, LuUserRound } from 'react-icons/lu'
import AuthShell, { Alert, pillButton } from '../components/authShell'
import { Field } from '../components/forms'
import { api } from '../lib/api'

/* FORGOT PASSWORD — asks the server to e-mail a reset link. The answer is always the same, so it never reveals
   whether an address belongs to the dashboard. Everything for this screen is in this ONE file. */

const CONFIG = {
  title: 'Forgot password',
  subtitle: 'Enter your username and we will e-mail a reset link to the address saved on the account.',
  emailLabel: 'Username',
  emailPlaceholder: 'Your username or email',
  submitLabel: 'Send reset link',
  submittingLabel: 'Sending…',
  backLabel: 'Back to login',
  emptyError: 'Enter your username.',
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    if (!email.trim()) return setError(CONFIG.emptyError)
    setLoading(true)
    try {
      const r = await api.post('/auth/forgot', { username: email.trim() })
      setNotice(r.message)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title={CONFIG.title} subtitle={CONFIG.subtitle}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <Alert>{error}</Alert>
        <Alert tone="info">{notice}</Alert>
        <Field pill label={CONFIG.emailLabel} icon={LuUserRound} type="text" placeholder={CONFIG.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" autoFocus />
        <button type="submit" disabled={loading} aria-busy={loading} className={`${pillButton} h-11 text-[0.95rem]`}>
          {loading ? <LuLoaderCircle size={20} className="animate-spin" aria-hidden="true" /> : <LuSend size={20} aria-hidden="true" />}
          {loading ? CONFIG.submittingLabel : CONFIG.submitLabel}
        </button>
        <Link to="/login" className={`${pillButton} h-11 text-sm !no-underline`}>
          <LuArrowLeft size={18} aria-hidden="true" />
          {CONFIG.backLabel}
        </Link>
      </form>
    </AuthShell>
  )
}
