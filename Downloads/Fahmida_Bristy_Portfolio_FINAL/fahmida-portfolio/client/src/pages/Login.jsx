import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Checkbox } from '@mui/material'
import { LuKeyRound, LuLoaderCircle, LuLogIn, LuLock, LuUserRound } from 'react-icons/lu'
import AuthShell, { Alert, pillBorder, pillButton } from '../components/authShell'
import { Field } from '../components/forms'
import { useAuth } from '../lib/auth'

/* =====================================================================================
   LOGIN PAGE — everything for this screen lives in this ONE file (the shared silver-door page is in
   components/authShell.jsx). Signs the site owner in to the dashboard. The first username and password come from
   ADMIN_EMAIL / ADMIN_PASSWORD in server/.env; after that, change them any time in Dashboard > Account.
   ===================================================================================== */

const CONFIG = {
  emailLabel: 'Username',
  emailPlaceholder: 'Your username or email',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  rememberLabel: 'Remember me',
  forgotLabel: 'Forgot password ?',
  submitLabel: 'Login',
  submittingLabel: 'Signing in…',
  emptyError: 'Enter your username and password.',
  rememberStorageKey: 'portfolio_remembered_id', // only the username is remembered, never the password
}

const readRemembered = () => {
  try {
    return localStorage.getItem(CONFIG.rememberStorageKey) || ''
  } catch {
    return ''
  }
}
const writeRemembered = (value) => {
  try {
    if (value) localStorage.setItem(CONFIG.rememberStorageKey, value)
    else localStorage.removeItem(CONFIG.rememberStorageKey)
  } catch {
    /* storage unavailable – ignore */
  }
}

export default function Login() {
  const { admin, ready, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(readRemembered)
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => Boolean(readRemembered()))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (ready && admin) return <Navigate to="/admin" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) return setError(CONFIG.emptyError)
    setLoading(true)
    try {
      await login(email.trim(), password, remember)
      writeRemembered(remember ? email.trim() : '')
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Login" srOnlyTitle>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <Alert>{error}</Alert>

        <Field
          pill
          label={CONFIG.emailLabel}
          icon={LuUserRound}
          type="text"
          placeholder={CONFIG.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          autoFocus
        />

        <Field
          pill
          label={CONFIG.passwordLabel}
          icon={LuLock}
          type="password"
          placeholder={CONFIG.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
          <label
            className={`flex h-11 w-full cursor-pointer select-none items-center justify-between gap-1 rounded-full pl-2 pr-4 text-sm font-medium text-black hover:bg-black/5 ${pillBorder}`}
          >
            <Checkbox size="small" checked={remember} onChange={(e) => setRemember(e.target.checked)} sx={{ p: 0.75, color: '#000', '&.Mui-checked': { color: '#000' } }} />
            <span className="flex-1 whitespace-nowrap text-center">{CONFIG.rememberLabel}</span>
            <LuUserRound className="h-5 w-5 shrink-0" aria-hidden="true" />
          </label>

          <Link to="/forgot-password" className={`${pillButton} h-11 text-sm !no-underline`}>
            <LuKeyRound size={18} aria-hidden="true" />
            {CONFIG.forgotLabel}
          </Link>
        </div>

        <button type="submit" disabled={loading} aria-busy={loading} className={`${pillButton} h-11 text-[0.95rem]`}>
          {loading ? <LuLoaderCircle size={20} className="animate-spin" aria-hidden="true" /> : <LuLogIn size={20} aria-hidden="true" />}
          {loading ? CONFIG.submittingLabel : CONFIG.submitLabel}
        </button>
      </form>
    </AuthShell>
  )
}
