import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { LuArrowLeft, LuCheck, LuLoaderCircle, LuLock } from 'react-icons/lu'
import AuthShell, { Alert, pillButton } from '../components/authShell'
import { Field } from '../components/forms'
import { api } from '../lib/api'

/* RESET PASSWORD — the page the e-mailed link opens (/reset-password?token=…&email=…).
   Everything for this screen is in this ONE file. */

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token') || ''
  const email = params.get('username') || params.get('email') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 10 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return setError('Use at least 10 characters, with letters and at least one number.')
    if (password !== confirm) return setError('The two passwords do not match.')
    setLoading(true)
    try {
      await api.post('/auth/reset', { token, username: email, password })
      setDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 1800)
    } catch (err) {
      setError(err.fields?.password || err.message)
      setLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <AuthShell title="Reset password">
        <div className="flex flex-col gap-5">
          <Alert>This reset link is incomplete. Please request a new one.</Alert>
          <Link to="/forgot-password" className={`${pillButton} h-11 text-sm !no-underline`}>Request a new link</Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Choose a new password" subtitle={`For ${email}`}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <Alert>{error}</Alert>
        <Alert tone="info">{done ? 'Password updated. Taking you to the login page…' : ''}</Alert>
        <Field pill label="New password" icon={LuLock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" autoFocus />
        <Field pill label="Confirm password" icon={LuLock} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        <button type="submit" disabled={loading || done} className={`${pillButton} h-11 text-[0.95rem]`}>
          {loading ? <LuLoaderCircle size={20} className="animate-spin" aria-hidden="true" /> : <LuCheck size={20} aria-hidden="true" />}
          Save new password
        </button>
        <Link to="/login" className={`${pillButton} h-11 text-sm !no-underline`}>
          <LuArrowLeft size={18} aria-hidden="true" /> Back to login
        </Link>
      </form>
    </AuthShell>
  )
}
