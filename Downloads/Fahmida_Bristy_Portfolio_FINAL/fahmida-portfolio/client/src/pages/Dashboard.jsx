import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, Reorder, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import {
  Alert, Button as MuiButton, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Tab, Tabs,
} from '@mui/material'
import {
  LuAward, LuBadgeCheck, LuBookOpen, LuBriefcase, LuCircleUser, LuExternalLink, LuEye, LuEyeOff, LuFileText, LuFlaskConical,
  LuFolderKanban, LuGraduationCap, LuGripVertical, LuHouse, LuInbox, LuKeyRound, LuLayoutList, LuLink, LuLoaderCircle,
  LuLogOut, LuMail, LuMapPin, LuMenu, LuPencil, LuPhone, LuPlus, LuSave, LuTrash2, LuUserRound, LuX, LuArrowUp, LuArrowDown,
  LuLock, LuPanelLeftClose, LuPanelLeftOpen, LuType, LuHash, LuAlignLeft, LuTag, LuCalendar, LuBuilding2, LuGlobe, LuQuote, LuUsers, LuTarget, LuImage, LuSparkles,
} from 'react-icons/lu'
import { Field, ChipsField, SwitchField, UploadField } from '../components/forms'
import { ThemeSwitch } from '../components/Navbar'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { glass, metal } from '../components/ui'

/* =====================================================================================
   DASHBOARD — everything for the owner's control panel lives in this ONE file (route /admin).
   Parts, in order:  1 helpers & shared pieces · 2 layout · 3 overview · 4 site settings panels
   (profile, about, sections, contact) · 5 content lists (research, publications, projects, experience,
   education, achievements) · 6 messages · 7 account · 8 routes.
   Forms use the Material UI floating-label kit in components/forms.jsx.
   ===================================================================================== */

/* ============================== 1. helpers & shared pieces ============================== */

const ICON_CHOICES = [
  { value: 'stethoscope', label: 'Stethoscope' }, { value: 'heart', label: 'Heart' }, { value: 'shield', label: 'Shield' },
  { value: 'paw', label: 'Paw' }, { value: 'globe', label: 'Globe' }, { value: 'flask', label: 'Flask' },
]
const PROFILE_ICON_CHOICES = [
  { value: 'scholar', label: 'Google Scholar' }, { value: 'researchgate', label: 'ResearchGate' }, { value: 'orcid', label: 'ORCID' },
  { value: 'linkedin', label: 'LinkedIn' }, { value: 'globe', label: 'Website' },
]
const PUB_TYPES = [
  { value: 'journal', label: 'Journal article' }, { value: 'conference', label: 'Conference paper' }, { value: 'review', label: 'Review article' },
  { value: 'abstract', label: 'Research abstract' }, { value: 'chapter', label: 'Book chapter' }, { value: 'preprint', label: 'Preprint' },
]
const PROJECT_STATUS = [{ value: 'ongoing', label: 'Ongoing' }, { value: 'completed', label: 'Completed' }, { value: 'planned', label: 'Planned' }]
const ACH_CATEGORIES = [
  { value: 'conferences', label: 'Academic conference' }, { value: 'presentations', label: 'Research presentation' }, { value: 'workshops', label: 'Scientific workshop' },
  { value: 'training', label: 'Professional training' }, { value: 'certifications', label: 'Certification' }, { value: 'awards', label: 'Award or achievement' },
]

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const pick = (obj, keys) => Object.fromEntries(keys.map((k) => [k, structuredClone(obj[k])]))
const cleanAsset = (a) => (a?.url ? { url: a.url, publicId: a.publicId || '', resourceType: a.resourceType || 'image', name: a.name || '', alt: a.alt || '' } : null)
const when = (iso) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

/* ----- toast messages ----- */
const ToastContext = createContext(null)
const useToast = () => useContext(ToastContext)

function ToastProvider({ children }) {
  const [t, setT] = useState(null)
  const api2 = useMemo(() => ({ ok: (m) => setT({ m, s: 'success', k: Date.now() }), err: (m) => setT({ m, s: 'error', k: Date.now() }) }), [])
  return (
    <ToastContext.Provider value={api2}>
      {children}
      <Snackbar key={t?.k} open={Boolean(t)} autoHideDuration={t?.s === 'error' ? 7000 : 3200} onClose={(_, r) => r !== 'clickaway' && setT(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {t ? <Alert severity={t.s} variant="filled" onClose={() => setT(null)} sx={{ width: '100%' }}>{t.m}</Alert> : undefined}
      </Snackbar>
    </ToastContext.Provider>
  )
}

/* ----- settings are loaded once and shared by the panels ----- */
const SettingsContext = createContext(null)
const useSettings = () => useContext(SettingsContext)

function SettingsProvider({ children }) {
  const { guard } = useAuth()
  const [settings, setSettings] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    api.get('/admin/settings').then(setSettings).catch((e) => { guard(e); setError(e.message) })
  }, [guard])
  useEffect(() => { load() }, [load])

  const save = useCallback(async (patch) => {
    const next = await api.put('/admin/settings', patch)
    setSettings(next)
    return next
  }, [])

  const value = useMemo(() => ({ settings, save }), [settings, save])
  if (error) return <Centered><p className="text-sm text-muted">{error}</p><button type="button" onClick={load} className="mt-3 rounded-full border border-line px-4 py-2 text-sm">Try again</button></Centered>
  if (!settings) return <Centered><LuLoaderCircle className="h-7 w-7 animate-spin text-gold-ink" aria-label="Loading" /></Centered>
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

function Centered({ children }) {
  return <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">{children}</div>
}

/* A draft copy of some settings blocks with Save / dirty tracking. */
function usePanel(keys) {
  const { settings, save } = useSettings()
  const toast = useToast()
  const { guard } = useAuth()
  const saved = useMemo(() => pick(settings, keys), [settings, keys])
  const [draft, setDraft] = useState(saved)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const dirty = !same(draft, saved)
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }))
  // sets one key inside an object block, e.g. setIn('profile', 'name', 'x')
  const setIn = (k, field, v) => setDraft((d) => ({ ...d, [k]: { ...d[k], [field]: v } }))

  const submit = async () => {
    setSaving(true)
    setErrors({})
    try {
      const next = await save(draft)
      setDraft(pick(next, keys))
      toast.ok('Saved. The website is updated.')
    } catch (e) {
      guard(e)
      setErrors(e.fields || {})
      toast.err(e.fields && Object.keys(e.fields).length ? `${e.message}: ${Object.entries(e.fields)[0].join(' — ')}` : e.message)
    } finally {
      setSaving(false)
    }
  }
  return { draft, set, setIn, dirty, saving, submit, errors, discard: () => setDraft(saved) }
}

/* ----- small layout pieces ----- */
function PageHeader({ icon: IconC, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage text-ink"><IconC className="h-6 w-6" aria-hidden="true" /></span>
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>}
        </div>
      </div>
      {actions}
    </div>
  )
}

function Card({ title, hint, children, className = '' }) {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={`${glass} rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6 ${className}`}>
      {title && <h2 className="font-display text-xl font-medium text-ink">{title}</h2>}
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className={title ? 'mt-5' : ''}>{children}</div>
    </motion.section>
  )
}

const Grid = ({ children, cols = 2 }) => <div className={`grid gap-5 ${cols === 2 ? 'sm:grid-cols-2' : cols === 3 ? 'sm:grid-cols-3' : ''}`}>{children}</div>

function PrimaryButton({ children, className = '', ...p }) {
  return <button type="button" {...p} className={`${metal} inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-on-primary shadow-card transition hover:-translate-y-0.5 hover:shadow-lift disabled:translate-y-0 disabled:opacity-50 ${className}`}>{children}</button>
}
function GhostButton({ children, className = '', ...p }) {
  return <button type="button" {...p} className={`inline-flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-gold disabled:opacity-50 ${className}`}>{children}</button>
}

// Sticky bar at the bottom of a settings panel: appears (animated) once something has changed.
function SaveBar({ panel }) {
  return (
    <AnimatePresence>
      {panel.dirty && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 lg:pl-[var(--sb)]">
          <div className="flex items-center gap-3 rounded-full border border-line bg-surface px-4 py-2.5 shadow-lift">
            <span className="text-sm text-ink">You have unsaved changes</span>
            <GhostButton onClick={panel.discard} disabled={panel.saving}>Discard</GhostButton>
            <PrimaryButton onClick={panel.submit} disabled={panel.saving}>
              {panel.saving ? <LuLoaderCircle className="animate-spin" aria-hidden="true" /> : <LuSave aria-hidden="true" />} Save changes
            </PrimaryButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ConfirmDialog({ open, title, body, confirmLabel = 'Delete', busy, onCancel, onConfirm }) {
  return (
    <Dialog open={open} onClose={busy ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent><p className="text-sm text-muted">{body}</p></DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <MuiButton onClick={onCancel} disabled={busy} color="inherit">Cancel</MuiButton>
        <MuiButton onClick={onConfirm} disabled={busy} color="error" variant="contained">{confirmLabel}</MuiButton>
      </DialogActions>
    </Dialog>
  )
}

function CountUp({ to }) {
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => Math.round(v))
  useEffect(() => {
    const c = animate(mv, to, { duration: 1.1, ease: 'easeOut' })
    return () => c.stop()
  }, [to, mv])
  return <motion.span>{rounded}</motion.span>
}

/* ============================== 2. layout ============================== */

const StatsContext = createContext(null)
const useStats = () => useContext(StatsContext)

const NAV = [
  { group: null, items: [{ to: '/admin', label: 'Overview', icon: LuHouse, end: true }, { to: '/admin/messages', label: 'Messages', icon: LuInbox, badge: true }] },
  {
    group: 'Website',
    items: [
      { to: '/admin/profile', label: 'Profile & hero', icon: LuCircleUser },
      { to: '/admin/about', label: 'About', icon: LuUserRound },
      { to: '/admin/sections', label: 'Sections & menu', icon: LuLayoutList },
      { to: '/admin/contact', label: 'Contact & links', icon: LuMail },
    ],
  },
  {
    group: 'Content',
    items: [
      { to: '/admin/research', label: 'Research interests', icon: LuFlaskConical },
      { to: '/admin/publications', label: 'Publications', icon: LuBookOpen },
      { to: '/admin/projects', label: 'Projects', icon: LuFolderKanban },
      { to: '/admin/experience', label: 'Experience', icon: LuBriefcase },
      { to: '/admin/education', label: 'Education', icon: LuGraduationCap },
      { to: '/admin/achievements', label: 'Achievements', icon: LuAward },
    ],
  },
  { group: 'Account', items: [{ to: '/admin/account', label: 'Account & password', icon: LuKeyRound }] },
]

function SidebarContent({ onNavigate, collapsed = false }) {
  const { stats } = useStats()
  const { admin, logout } = useAuth()
  return (
    <div className="flex h-full flex-col">
      <Link to="/" className={`mb-6 flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-2'}`} onClick={onNavigate} title="View website">
        <span className={`${metal} flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-semibold text-on-primary`}>FB</span>
        <span className={`leading-tight ${collapsed ? 'hidden' : ''}`}>
          <span className="block font-display text-lg text-ink">Dashboard</span>
          <span className="block text-xs text-muted">View website <LuExternalLink className="inline h-3 w-3" aria-hidden="true" /></span>
        </span>
      </Link>
      <nav aria-label="Dashboard" className="flex-1 flex flex-col gap-5 overflow-y-auto pr-1">
        {NAV.map((g, gi) => (
          <div key={gi}>
            {g.group && !collapsed && <p className="mb-1.5 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{g.group}</p>}
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <li key={it.to}>
                  <NavLink to={it.to} end={it.end} onClick={onNavigate} title={collapsed ? it.label : undefined} aria-label={collapsed ? it.label : undefined} className="relative block rounded-xl">
                    {({ isActive }) => (
                      <span className={`relative flex items-center rounded-xl py-2.5 text-sm font-medium transition ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`}>
                        {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl bg-sage" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                        <it.icon className="relative h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
                        {!collapsed && <span className="relative flex-1">{it.label}</span>}
                        {it.badge && stats?.unreadMessages > 0 && collapsed && <span className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full bg-gold" aria-hidden="true" />}
                        {it.badge && stats?.unreadMessages > 0 && !collapsed && <span className="relative rounded-full bg-primary px-2 py-0.5 text-[0.68rem] font-semibold text-on-primary">{stats.unreadMessages}</span>}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-4 border-t border-line pt-4">
        {!collapsed && (
          <>
            <p className="truncate px-2 text-xs text-muted">Signed in as</p>
            <p className="truncate px-2 text-sm font-medium text-ink">{admin?.name || admin?.username}</p>
          </>
        )}
        <button type="button" onClick={logout} title="Sign out" aria-label="Sign out" className={`flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-muted transition hover:bg-sage hover:text-ink ${collapsed ? 'justify-center' : 'mt-3 gap-2 px-3'}`}>
          <LuLogOut aria-hidden="true" /> {!collapsed && 'Sign out'}
        </button>
      </div>
    </div>
  )
}

const COLLAPSE_KEY = 'dashboard_sidebar_collapsed'

function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(COLLAPSE_KEY) === '1' } catch { return false }
  })
  const toggleCollapsed = () => setCollapsed((c) => {
    try { localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1') } catch { /* storage unavailable */ }
    return !c
  })
  const [stats, setStats] = useState(null)
  const { guard } = useAuth()
  const location = useLocation()

  const refresh = useCallback(() => api.get('/admin/stats').then(setStats).catch(guard), [guard])
  useEffect(() => { refresh() }, [refresh])
  const value = useMemo(() => ({ stats, refresh }), [stats, refresh])

  return (
    <StatsContext.Provider value={value}>
      <div style={{ '--sb': collapsed ? '5rem' : '18rem' }} className="min-h-dvh bg-canvas font-ui text-ink antialiased dark:bg-[radial-gradient(900px_520px_at_78%_0%,rgba(255,255,255,0.06),transparent_65%)]">
        <aside style={{ width: 'var(--sb)' }} className={`fixed inset-y-0 left-0 z-40 hidden overflow-hidden border-r border-line bg-surface/80 backdrop-blur transition-[width] duration-300 lg:block ${collapsed ? 'p-3' : 'p-5'}`}>
          <SidebarContent collapsed={collapsed} />
        </aside>

        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-canvas/85 px-4 py-3 backdrop-blur lg:pl-[calc(var(--sb)+1.5rem)] transition-[padding] duration-300">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden">
            <LuMenu aria-hidden="true" />
          </button>
          <button type="button" onClick={toggleCollapsed} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-pressed={collapsed} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="hidden h-10 w-10 items-center justify-center rounded-full border border-line transition hover:border-gold lg:flex">
            {collapsed ? <LuPanelLeftOpen aria-hidden="true" /> : <LuPanelLeftClose aria-hidden="true" />}
          </button>
          <p className="hidden text-sm text-muted lg:block">Changes you save appear on the website straight away.</p>
          <div className="ml-auto flex items-center gap-2">
            <ThemeSwitch />
            <Link to="/" target="_blank" className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm font-medium hover:border-gold">
              <LuExternalLink aria-hidden="true" /> <span className="hidden sm:inline">View site</span>
            </Link>
          </div>
        </header>

        <AnimatePresence>
          {open && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/60 lg:hidden" aria-hidden="true" />
              <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.25 }} className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-line bg-surface p-5 lg:hidden">
                <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-line"><LuX aria-hidden="true" /></button>
                <SidebarContent onNavigate={() => setOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="px-4 pb-32 pt-8 transition-[padding] duration-300 lg:pl-[calc(var(--sb)+1.5rem)] lg:pr-8">
          {/* A new key per page replays the entrance animation. (No exit animation on purpose: waiting for an exit made pages remount.) */}
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="mx-auto max-w-5xl">
            {children}
          </motion.div>
        </main>
      </div>
    </StatsContext.Provider>
  )
}

/* ============================== 3. overview ============================== */

function BarChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.count))
  const total = data.reduce((n, d) => n + d.count, 0)
  return (
    <figure>
      <div className="flex h-32 items-end gap-1.5" role="img" aria-label={`Messages received per day over the last 14 days: ${total} in total`}>
        {data.map((d, i) => (
          <div key={d.date} className="group relative flex h-full flex-1 items-end" title={`${d.date}: ${d.count}`}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: d.count ? `${(d.count / max) * 100}%` : '3px' }}
              transition={{ duration: 0.6, delay: i * 0.03, ease: 'easeOut' }}
              className={`w-full rounded-t-md ${d.count ? 'bg-gold' : 'bg-line'}`}
            />
          </div>
        ))}
      </div>
      <figcaption className="mt-2 flex justify-between text-[0.7rem] text-muted"><span>{data[0]?.date.slice(5)}</span><span>{total} message{total === 1 ? '' : 's'} in 14 days</span><span>{data.at(-1)?.date.slice(5)}</span></figcaption>
    </figure>
  )
}

function Overview() {
  const { stats } = useStats()
  const { settings } = useSettings()
  const { admin } = useAuth()
  const tiles = stats && [
    { label: 'Research areas', n: stats.counts.research, to: '/admin/research', icon: LuFlaskConical },
    { label: 'Publications', n: stats.counts.publications, to: '/admin/publications', icon: LuBookOpen },
    { label: 'Projects', n: stats.counts.projects, to: '/admin/projects', icon: LuFolderKanban },
    { label: 'Experience', n: stats.counts.experience, to: '/admin/experience', icon: LuBriefcase },
    { label: 'Education', n: stats.counts.education, to: '/admin/education', icon: LuGraduationCap },
    { label: 'Achievements', n: stats.counts.achievements, to: '/admin/achievements', icon: LuAward },
  ]
  return (
    <>
      <PageHeader icon={LuSparkles} title={`Welcome back${admin?.name ? `, ${admin.name.split(' ').slice(0, 2).join(' ')}` : ''}`} description="Everything on the website is controlled from here. Pick a section on the left, change it, and save." />
      {!stats ? <Centered><LuLoaderCircle className="h-6 w-6 animate-spin text-gold-ink" aria-label="Loading" /></Centered> : (
        <div className="space-y-6">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {tiles.map((t, i) => (
              <motion.li key={t.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link to={t.to} className={`${glass} group flex items-center justify-between rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-lift`}>
                  <span>
                    <span className="block font-display text-4xl text-ink"><CountUp to={t.n} /></span>
                    <span className="text-sm text-muted">{t.label}</span>
                  </span>
                  <t.icon className="h-7 w-7 text-gold-ink transition group-hover:scale-110" aria-hidden="true" />
                </Link>
              </motion.li>
            ))}
          </ul>

          <div className="grid gap-6 lg:grid-cols-5">
            <Card title="Messages" hint="Received through the contact form" className="lg:col-span-3">
              <BarChart data={stats.messagesPerDay} />
            </Card>
            <Card title="Inbox" className="lg:col-span-2">
              <p className="font-display text-4xl text-ink"><CountUp to={stats.unreadMessages} /></p>
              <p className="text-sm text-muted">unread of {stats.counts.messages} total</p>
              <ul className="mt-4 space-y-2">
                {stats.recentMessages.slice(0, 3).map((m) => (
                  <li key={m.id} className="truncate text-sm text-ink"><span className={m.status === 'new' ? 'font-semibold' : 'text-muted'}>{m.name}</span> <span className="text-muted">— {m.subject}</span></li>
                ))}
              </ul>
              <Link to="/admin/messages" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-gold underline-offset-4">Open inbox</Link>
            </Card>
          </div>

          <Card title="Website sections" hint="What visitors see right now, in order. Change this under Sections & menu.">
            <ul className="flex flex-wrap gap-2">
              {settings.sections.map((s) => (
                <li key={s.key} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${s.visible ? 'border-gold/50 bg-gold/15 text-gold-ink' : 'border-line text-muted line-through'}`}>
                  {s.visible ? <LuEye aria-hidden="true" /> : <LuEyeOff aria-hidden="true" />} {s.label}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </>
  )
}

/* ============================== 4. site settings panels ============================== */

const move = (arr, i, d) => {
  const j = i + d
  if (j < 0 || j >= arr.length) return arr
  const next = [...arr]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}
const upd = (arr, i, patch) => arr.map((x, k) => (k === i ? { ...x, ...patch } : x))

function RowActions({ i, n, onMove, onRemove }) {
  return (
    <div className="flex shrink-0 items-center">
      <IconButton size="small" aria-label="Move up" disabled={i === 0} onClick={() => onMove(-1)}><LuArrowUp size={16} /></IconButton>
      <IconButton size="small" aria-label="Move down" disabled={i === n - 1} onClick={() => onMove(1)}><LuArrowDown size={16} /></IconButton>
      <IconButton size="small" aria-label="Remove" onClick={onRemove}><LuTrash2 size={16} /></IconButton>
    </div>
  )
}

const PROFILE_KEYS = ['profile']
function ProfilePanel() {
  const p = usePanel(PROFILE_KEYS)
  const toast = useToast()
  const pr = p.draft.profile
  const e = (f) => p.errors[`profile.${f}`]
  const facts = pr.heroFacts
  return (
    <>
      <PageHeader icon={LuCircleUser} title="Profile & hero" description="The first screen of the website: name, title, introduction, photograph, CV and the three key facts." />
      <div className="space-y-6">
        <Card title="Identity">
          <Grid>
            <Field label="Full name" icon={LuUserRound} value={pr.name} onChange={(ev) => p.setIn('profile', 'name', ev.target.value)} error={e('name')} />
            <Field label="Initials (logo badge)" icon={LuHash} value={pr.initials} onChange={(ev) => p.setIn('profile', 'initials', ev.target.value)} error={e('initials')} slotProps={{ htmlInput: { maxLength: 4 } }} />
            <Field label="Title under the name" icon={LuBadgeCheck} value={pr.title} onChange={(ev) => p.setIn('profile', 'title', ev.target.value)} />
            <Field label="Small line above the name" icon={LuTag} value={pr.eyebrow} onChange={(ev) => p.setIn('profile', 'eyebrow', ev.target.value)} />
          </Grid>
          <div className="mt-5 flex flex-col gap-5">
            <Field label="Introduction" icon={LuAlignLeft} multiline minRows={3} value={pr.heroIntro} onChange={(ev) => p.setIn('profile', 'heroIntro', ev.target.value)} />
            <Field label="Short bio" icon={LuAlignLeft} multiline minRows={3} value={pr.heroBio} onChange={(ev) => p.setIn('profile', 'heroBio', ev.target.value)} />
          </div>
        </Card>

        <Card title="Photograph & CV" hint="Uploads go to Cloudinary. Until you add Cloudinary keys, paste a link instead.">
          <div className="grid gap-5 md:grid-cols-2">
            <UploadField label="Profile photograph" kind="image" folder="profile" aspect="aspect-[4/5]" value={pr.photo} onChange={(a) => p.setIn('profile', 'photo', a)} onError={toast.err} />
            <UploadField label="Academic CV (PDF)" kind="pdf" folder="cv" value={pr.cv} onChange={(a) => p.setIn('profile', 'cv', a)} onError={toast.err} />
          </div>
        </Card>

        <Card title="Professional registration" hint="Shown in the About and Education sections.">
          <Grid>
            <Field label="Registering body" icon={LuBuilding2} value={pr.registration.body} onChange={(ev) => p.setIn('profile', 'registration', { ...pr.registration, body: ev.target.value })} />
            <Field label="Registration number" icon={LuHash} value={pr.registration.number} onChange={(ev) => p.setIn('profile', 'registration', { ...pr.registration, number: ev.target.value })} />
          </Grid>
        </Card>

        <Card title="Key facts" hint="Up to six short facts under the introduction.">
          <div className="flex flex-col gap-4">
            {facts.map((f, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="grid flex-1 gap-4 sm:grid-cols-[1fr_2fr]">
                  <Field label="Label" icon={LuTag} value={f.label} onChange={(ev) => p.setIn('profile', 'heroFacts', upd(facts, i, { label: ev.target.value }))} />
                  <Field label="Value" icon={LuType} value={f.value} onChange={(ev) => p.setIn('profile', 'heroFacts', upd(facts, i, { value: ev.target.value }))} />
                </div>
                <RowActions i={i} n={facts.length} onMove={(d) => p.setIn('profile', 'heroFacts', move(facts, i, d))} onRemove={() => p.setIn('profile', 'heroFacts', facts.filter((_, k) => k !== i))} />
              </div>
            ))}
            {facts.length < 6 && <GhostButton onClick={() => p.setIn('profile', 'heroFacts', [...facts, { label: '', value: '' }])}><LuPlus aria-hidden="true" /> Add a fact</GhostButton>}
          </div>
        </Card>
      </div>
      <SaveBar panel={p} />
    </>
  )
}

const ABOUT_KEYS = ['about']
function AboutPanel() {
  const p = usePanel(ABOUT_KEYS)
  const a = p.draft.about
  return (
    <>
      <PageHeader icon={LuUserRound} title="About" description="The numbered story blocks and the professional goals statement. The section heading is edited under Sections & menu." />
      <div className="space-y-6">
        <Card title="Highlights">
          <div className="flex flex-col gap-5">
            <Field label="Highest qualification (side card)" icon={LuGraduationCap} multiline minRows={2} value={a.highestQualification} onChange={(ev) => p.setIn('about', 'highestQualification', ev.target.value)} />
            <Field label="Professional goals" icon={LuTarget} multiline minRows={4} value={a.goals} onChange={(ev) => p.setIn('about', 'goals', ev.target.value)} helperText="Leave empty to show the 'coming soon' placeholder." />
          </div>
        </Card>
        <Card title="Story blocks" hint="Shown as 01, 02, 03… in this order. Use the arrows to reorder.">
          <div className="flex flex-col gap-4">
            {a.blocks.map((b, i) => (
              <div key={i} className="rounded-xl border border-line bg-canvas/40 p-4">
                <div className="flex items-start gap-2">
                  <span className="mt-3 w-6 text-center font-display text-gold-ink" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex-1 flex flex-col gap-4">
                    <Field label="Block title" icon={LuType} value={b.title} onChange={(ev) => p.setIn('about', 'blocks', upd(a.blocks, i, { title: ev.target.value }))} />
                    <Field label="Text" icon={LuAlignLeft} multiline minRows={3} value={b.body} onChange={(ev) => p.setIn('about', 'blocks', upd(a.blocks, i, { body: ev.target.value }))} />
                  </div>
                  <RowActions i={i} n={a.blocks.length} onMove={(d) => p.setIn('about', 'blocks', move(a.blocks, i, d))} onRemove={() => p.setIn('about', 'blocks', a.blocks.filter((_, k) => k !== i))} />
                </div>
              </div>
            ))}
          </div>
          <GhostButton className="mt-4" onClick={() => p.setIn('about', 'blocks', [...a.blocks, { title: '', body: '' }])}><LuPlus aria-hidden="true" /> Add a block</GhostButton>
        </Card>
      </div>
      <SaveBar panel={p} />
    </>
  )
}

const SECTION_KEYS_ = ['sections', 'navCta']
function SectionsPanel() {
  const p = usePanel(SECTION_KEYS_)
  const [open, setOpen] = useState(null)
  const sections = p.draft.sections
  const home = sections.find((s) => s.key === 'home')
  const rest = sections.filter((s) => s.key !== 'home')
  const setSection = (key, patch) => p.set('sections', sections.map((s) => (s.key === key ? { ...s, ...patch } : s)))
  const visibleTargets = sections.filter((s) => s.visible).map((s) => ({ value: s.key, label: s.label }))

  const row = (s, pinned) => (
    <div className="rounded-xl border border-line bg-canvas/40">
      <div className="flex flex-wrap items-center gap-3 p-3">
        <span className={`text-muted ${pinned ? 'opacity-30' : 'cursor-grab'}`} aria-hidden="true"><LuGripVertical /></span>
        <button type="button" onClick={() => setOpen(open === s.key ? null : s.key)} className="flex min-w-0 flex-1 items-center gap-2 text-left" aria-expanded={open === s.key}>
          <span className={`font-medium ${s.visible ? 'text-ink' : 'text-muted line-through'}`}>{s.label}</span>
          {pinned && <span className="text-xs text-muted">always first</span>}
          <LuPencil className="ml-auto h-4 w-4 text-muted" aria-hidden="true" />
        </button>
        <SwitchField label="Show" checked={s.visible} onChange={(v) => !pinned && setSection(s.key, { visible: v })} />
        <SwitchField label="In menu" checked={s.inNav} onChange={(v) => setSection(s.key, { inNav: v })} />
        {s.inNav && <SwitchField label="Under “More”" checked={s.inMore} onChange={(v) => setSection(s.key, { inMore: v })} />}
      </div>
      <AnimatePresence initial={false}>
        {open === s.key && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-2">
              <Field label="Menu name" icon={LuType} value={s.label} onChange={(ev) => setSection(s.key, { label: ev.target.value })} />
              <Field label="Short menu name (optional)" icon={LuType} value={s.short} onChange={(ev) => setSection(s.key, { short: ev.target.value })} />
              {s.key !== 'home' && (
                <>
                  <Field label="Small line above the heading" icon={LuTag} value={s.eyebrow} onChange={(ev) => setSection(s.key, { eyebrow: ev.target.value })} />
                  <Field label="Heading" icon={LuType} value={s.title} onChange={(ev) => setSection(s.key, { title: ev.target.value })} />
                  <div className="sm:col-span-2"><Field label="Intro text under the heading" icon={LuAlignLeft} multiline minRows={2} value={s.intro} onChange={(ev) => setSection(s.key, { intro: ev.target.value })} /></div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <>
      <PageHeader icon={LuLayoutList} title="Sections & menu" description="Turn sections on or off, drag them into a new order, rename headings, and choose what appears in the top menu." />
      <div className="space-y-6">
        <Card title="Sections" hint="Drag a row by its handle to reorder the page. “Home” always stays first.">
          <div className="space-y-3">
            {home && row(home, true)}
            <Reorder.Group axis="y" values={rest} onReorder={(v) => p.set('sections', [home, ...v])} className="space-y-3">
              {rest.map((s) => (
                <Reorder.Item key={s.key} value={s}>{row(s, false)}</Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </Card>
        <Card title="Menu button" hint="The highlighted button at the right of the top menu.">
          <Grid>
            <Field label="Button text" icon={LuType} value={p.draft.navCta.label} onChange={(ev) => p.set('navCta', { ...p.draft.navCta, label: ev.target.value })} />
            <Field label="Scrolls to" icon={LuTarget} options={visibleTargets} value={p.draft.navCta.target} onChange={(ev) => p.set('navCta', { ...p.draft.navCta, target: ev.target.value })} />
          </Grid>
        </Card>
      </div>
      <SaveBar panel={p} />
    </>
  )
}

const CONTACT_KEYS = ['contact', 'academicProfiles', 'collaborationTypes', 'footer', 'extras']
function ContactPanel() {
  const p = usePanel(CONTACT_KEYS)
  const { contact, academicProfiles: links } = p.draft
  const e = (f) => p.errors[`contact.${f}`]
  return (
    <>
      <PageHeader icon={LuMail} title="Contact & links" description="Contact details, the contact form, academic profile links, the footer text and the experience placeholders." />
      <div className="space-y-6">
        <Card title="Contact details" hint="Leave a box empty to hide it on the website.">
          <Grid cols={3}>
            <Field label="Email" icon={LuMail} type="email" value={contact.email} onChange={(ev) => p.set('contact', { ...contact, email: ev.target.value })} error={e('email')} />
            <Field label="Phone" icon={LuPhone} value={contact.phone} onChange={(ev) => p.set('contact', { ...contact, phone: ev.target.value })} />
            <Field label="Location" icon={LuMapPin} value={contact.location} onChange={(ev) => p.set('contact', { ...contact, location: ev.target.value })} />
          </Grid>
          <div className="mt-4"><SwitchField label="Contact form is on" checked={contact.formEnabled} onChange={(v) => p.set('contact', { ...contact, formEnabled: v })} hint="Turn off to hide the form and show a short notice instead." /></div>
        </Card>

        <Card title="Academic profiles" hint="Only profiles with a link are shown on the website.">
          <div className="flex flex-col gap-4">
            {links.map((l, i) => (
              <div key={l.key} className="flex items-start gap-2">
                <div className="grid flex-1 gap-4 sm:grid-cols-[1fr_1fr_2fr]">
                  <Field label="Name" icon={LuType} value={l.label} onChange={(ev) => p.set('academicProfiles', upd(links, i, { label: ev.target.value }))} />
                  <Field label="Icon" icon={LuGlobe} options={PROFILE_ICON_CHOICES} value={l.icon} onChange={(ev) => p.set('academicProfiles', upd(links, i, { icon: ev.target.value }))} />
                  <Field label="Link (https://…)" icon={LuLink} value={l.url} onChange={(ev) => p.set('academicProfiles', upd(links, i, { url: ev.target.value }))} error={p.errors[`academicProfiles.${i}.url`]} />
                </div>
                <RowActions i={i} n={links.length} onMove={(d) => p.set('academicProfiles', move(links, i, d))} onRemove={() => p.set('academicProfiles', links.filter((_, k) => k !== i))} />
              </div>
            ))}
            {links.length < 12 && <GhostButton onClick={() => p.set('academicProfiles', [...links, { key: `link-${Date.now()}`, label: '', icon: 'globe', url: '' }])}><LuPlus aria-hidden="true" /> Add a profile</GhostButton>}
          </div>
        </Card>

        <Card title="Lists & footer">
          <div className="flex flex-col gap-5">
            <ChipsField label="Collaboration types (contact form dropdown)" icon={LuUsers} value={p.draft.collaborationTypes} onChange={(v) => p.set('collaborationTypes', v)} />
            <ChipsField label="Experience placeholders (“Awaiting entries” list)" icon={LuBriefcase} value={p.draft.extras.experienceCategories} onChange={(v) => p.set('extras', { ...p.draft.extras, experienceCategories: v })} helperText="Leave empty to hide that list." />
            <Field label="Footer text" icon={LuQuote} multiline minRows={2} value={p.draft.footer.blurb} onChange={(ev) => p.set('footer', { blurb: ev.target.value })} />
          </div>
        </Card>
      </div>
      <SaveBar panel={p} />
    </>
  )
}

/* ============================== 5. content lists ============================== */

const label = (list, v) => list.find((x) => x.value === v)?.label ?? v
const join = (...parts) => parts.filter(Boolean).join(' · ')

// One form per kind of entry. `d` is the draft, `set(field, value)` changes it, `er` holds the server's field errors.
const FORMS = {
  research: ({ d, set, er }) => (
    <>
      <Grid>
        <Field label="Title" icon={LuType} value={d.title} onChange={(e) => set('title', e.target.value)} error={er.title} autoFocus />
        <Field label="Icon" icon={LuSparkles} options={ICON_CHOICES} value={d.icon} onChange={(e) => set('icon', e.target.value)} />
      </Grid>
      <Field label="Description" icon={LuAlignLeft} multiline minRows={3} value={d.description} onChange={(e) => set('description', e.target.value)} />
      <ChipsField label="Related topics" icon={LuTag} value={d.topics} onChange={(v) => set('topics', v)} />
    </>
  ),
  publications: ({ d, set, er, toast }) => (
    <>
      <Field label="Title" icon={LuType} value={d.title} onChange={(e) => set('title', e.target.value)} error={er.title} autoFocus />
      <Grid>
        <Field label="Type" icon={LuBookOpen} options={PUB_TYPES} value={d.type} onChange={(e) => set('type', e.target.value)} />
        <Field label="Year" icon={LuCalendar} type="number" value={d.year} onChange={(e) => set('year', e.target.value)} error={er.year} />
        <Field label="Journal / conference / publisher" icon={LuBuilding2} value={d.venue} onChange={(e) => set('venue', e.target.value)} />
        <Field label="DOI (e.g. 10.1000/xyz123)" icon={LuHash} value={d.doi} onChange={(e) => set('doi', e.target.value)} />
      </Grid>
      <ChipsField label="Authors" icon={LuUsers} value={d.authors} onChange={(v) => set('authors', v)} placeholder="Type a name and press Enter" />
      <ChipsField label="Keywords" icon={LuTag} value={d.keywords} onChange={(v) => set('keywords', v)} />
      <Field label="Abstract" icon={LuAlignLeft} multiline minRows={4} value={d.abstract} onChange={(e) => set('abstract', e.target.value)} />
      <Field label="Link to the paper (https://…)" icon={LuLink} value={d.url} onChange={(e) => set('url', e.target.value)} error={er.url} />
      <UploadField label="Full text (PDF)" kind="pdf" folder="publications" value={d.pdf} onChange={(a) => set('pdf', a)} onError={toast.err} />
    </>
  ),
  projects: ({ d, set, er, toast, pubs }) => (
    <>
      <Grid>
        <Field label="Title" icon={LuType} value={d.title} onChange={(e) => set('title', e.target.value)} error={er.title} autoFocus />
        <Field label="Status" icon={LuFlaskConical} options={PROJECT_STATUS} value={d.status} onChange={(e) => set('status', e.target.value)} />
      </Grid>
      <Field label="Research area" icon={LuTag} value={d.area} onChange={(e) => set('area', e.target.value)} />
      <Field label="Overview" icon={LuAlignLeft} multiline minRows={3} value={d.overview} onChange={(e) => set('overview', e.target.value)} />
      <ChipsField label="Objectives" icon={LuTarget} value={d.objectives} onChange={(v) => set('objectives', v)} placeholder="Type an objective and press Enter" />
      <Field label="Methodology" icon={LuAlignLeft} multiline minRows={3} value={d.methodology} onChange={(e) => set('methodology', e.target.value)} />
      <ChipsField label="Collaborators" icon={LuUsers} value={d.collaborators} onChange={(v) => set('collaborators', v)} />
      <Field label="Outcomes and findings" icon={LuAlignLeft} multiline minRows={3} value={d.outcomes} onChange={(e) => set('outcomes', e.target.value)} />
      <Field
        label="Related publications"
        icon={LuBookOpen}
        options={pubs.map((p) => ({ value: p.id, label: p.title }))}
        value={d.relatedPublications}
        onChange={(e) => set('relatedPublications', e.target.value)}
        slotProps={{ select: { multiple: true } }}
        helperText={pubs.length ? undefined : 'Add publications first, then link them here.'}
      />
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Images</p>
        {d.images.map((img, i) => (
          <UploadField key={i} label={`Image ${i + 1}`} kind="image" folder="projects" value={img} onChange={(a) => set('images', a ? upd(d.images, i, a) : d.images.filter((_, k) => k !== i))} onError={toast.err} />
        ))}
        {d.images.length < 12 && <GhostButton onClick={() => set('images', [...d.images, { url: '', publicId: '', resourceType: 'image', name: '', alt: '' }])}><LuImage aria-hidden="true" /> Add an image</GhostButton>}
      </div>
    </>
  ),
  timeline: ({ d, set, er }) => (
    <>
      <Field label="Title / role / degree" icon={LuType} value={d.title} onChange={(e) => set('title', e.target.value)} error={er.title} autoFocus />
      <Grid>
        <Field label="Organization / institution" icon={LuBuilding2} value={d.organization} onChange={(e) => set('organization', e.target.value)} />
        <Field label="Location" icon={LuMapPin} value={d.location} onChange={(e) => set('location', e.target.value)} />
      </Grid>
      <Field label="Dates (e.g. 2019 – 2026)" icon={LuCalendar} value={d.dateLabel} onChange={(e) => set('dateLabel', e.target.value)} />
      <Field label="Description" icon={LuAlignLeft} multiline minRows={3} value={d.description} onChange={(e) => set('description', e.target.value)} />
    </>
  ),
  achievements: ({ d, set, er, toast }) => (
    <>
      <Grid>
        <Field label="Title" icon={LuType} value={d.title} onChange={(e) => set('title', e.target.value)} error={er.title} autoFocus />
        <Field label="Category" icon={LuAward} options={ACH_CATEGORIES} value={d.category} onChange={(e) => set('category', e.target.value)} />
        <Field label="Organization" icon={LuBuilding2} value={d.organization} onChange={(e) => set('organization', e.target.value)} />
        <Field label="Date" icon={LuCalendar} value={d.date} onChange={(e) => set('date', e.target.value)} />
      </Grid>
      <Field label="Location" icon={LuMapPin} value={d.location} onChange={(e) => set('location', e.target.value)} />
      <Field label="Description" icon={LuAlignLeft} multiline minRows={3} value={d.description} onChange={(e) => set('description', e.target.value)} />
      <UploadField label="Certificate / attachment (PDF)" kind="pdf" folder="achievements" value={d.attachment} onChange={(a) => set('attachment', a)} onError={toast.err} />
    </>
  ),
}

const TIMELINE_BLANK = { dateLabel: '', title: '', organization: '', location: '', description: '', visible: true }

const RESOURCES = {
  research: {
    section: 'research', icon: LuFlaskConical, title: 'Research interests', noun: 'research area', form: 'research',
    description: 'The cards in the Research Interests section.',
    blank: { icon: 'globe', title: '', description: '', topics: [], visible: true },
    describe: (i) => ({ title: i.title, sub: join(...(i.topics || [])) }),
  },
  publications: {
    section: 'publications', icon: LuBookOpen, title: 'Publications', noun: 'publication', form: 'publications',
    description: 'Journal articles, conference papers, reviews, abstracts, chapters and preprints.',
    blank: { type: 'journal', title: '', authors: [], venue: '', year: '', doi: '', url: '', keywords: [], abstract: '', pdf: null, visible: true },
    describe: (i) => ({ title: i.title, sub: join(label(PUB_TYPES, i.type), i.year, i.venue) }),
  },
  projects: {
    section: 'projects', icon: LuFolderKanban, title: 'Projects', noun: 'project', form: 'projects', needsPubs: true,
    description: 'Ongoing, completed and planned research projects.',
    blank: { title: '', status: 'ongoing', area: '', overview: '', objectives: [], methodology: '', collaborators: [], images: [], outcomes: '', relatedPublications: [], visible: true },
    describe: (i) => ({ title: i.title, sub: join(label(PROJECT_STATUS, i.status), i.area) }),
  },
  experience: {
    section: 'experience', icon: LuBriefcase, title: 'Experience', noun: 'experience entry', form: 'timeline',
    description: 'Roles and appointments on the Experience timeline.',
    blank: TIMELINE_BLANK,
    describe: (i) => ({ title: i.title, sub: join(i.dateLabel, i.organization) }),
  },
  education: {
    section: 'education', icon: LuGraduationCap, title: 'Education', noun: 'qualification', form: 'timeline',
    description: 'Degrees and certificates on the Education timeline.',
    blank: TIMELINE_BLANK,
    describe: (i) => ({ title: i.title, sub: join(i.dateLabel, i.organization) }),
  },
  achievements: {
    section: 'achievements', icon: LuAward, title: 'Achievements', noun: 'achievement', form: 'achievements',
    description: 'Conferences, presentations, workshops, training, certifications and awards.',
    blank: { category: 'awards', title: '', organization: '', date: '', location: '', description: '', attachment: null, visible: true },
    describe: (i) => ({ title: i.title, sub: join(label(ACH_CATEGORIES, i.category), i.organization, i.date) }),
  },
}

// What gets sent to the server: assets cleaned, an empty year becomes null.
const prepare = (d) => {
  const out = { ...d }
  if ('year' in out) out.year = out.year === '' || out.year == null ? null : Number(out.year)
  for (const k of ['pdf', 'attachment']) if (k in out) out[k] = cleanAsset(out[k])
  if (Array.isArray(out.images)) out.images = out.images.map(cleanAsset).filter(Boolean)
  return out
}

function ResourcePanel({ name }) {
  const cfg = RESOURCES[name]
  const toast = useToast()
  const { guard } = useAuth()
  const { refresh } = useStats()
  const { settings } = useSettings()
  const Form = FORMS[cfg.form]
  const [items, setItems] = useState(null)
  const [pubs, setPubs] = useState([])
  const [editing, setEditing] = useState(null) // draft being edited (has `id` when it already exists)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const itemsRef = useRef([])

  useEffect(() => {
    let live = true
    api.get(`/admin/${name}`).then((r) => live && setItems(r)).catch((e) => { guard(e); toast.err(e.message) })
    if (cfg.needsPubs) api.get('/admin/publications').then((r) => live && setPubs(r)).catch(() => {})
    return () => { live = false }
  }, [name, cfg.needsPubs, guard, toast])
  useEffect(() => { itemsRef.current = items || [] }, [items, itemsRef])

  const sectionHidden = settings.sections.find((s) => s.key === cfg.section)?.visible === false
  const setField = (k, v) => setEditing((d) => ({ ...d, [k]: v }))
  const openNew = () => { setErrors({}); setEditing({ ...structuredClone(cfg.blank) }) }
  const openEdit = (it) => { setErrors({}); setEditing({ ...structuredClone(cfg.blank), ...structuredClone(it), year: it.year ?? '' }) }

  const submit = async () => {
    setSaving(true)
    setErrors({})
    try {
      const body = prepare(editing)
      const saved = editing.id ? await api.put(`/admin/${name}/${editing.id}`, body) : await api.post(`/admin/${name}`, body)
      setItems((list) => (editing.id ? list.map((x) => (x.id === saved.id ? saved : x)) : [...list, saved]))
      setEditing(null)
      toast.ok(editing.id ? 'Saved.' : `Added. It is live on the website${editing.visible ? '' : ' once you show it'}.`)
      refresh()
    } catch (e) {
      guard(e)
      setErrors(e.fields || {})
      toast.err(e.fields && Object.keys(e.fields).length ? `${e.message}: ${Object.entries(e.fields)[0].join(' — ')}` : e.message)
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (it) => {
    const next = { ...it, visible: !it.visible }
    setItems((l) => l.map((x) => (x.id === it.id ? next : x)))
    try {
      await api.patch(`/admin/${name}/${it.id}/visibility`, { visible: next.visible })
    } catch (e) {
      guard(e)
      setItems((l) => l.map((x) => (x.id === it.id ? it : x)))
      toast.err(e.message)
    }
  }

  const persistOrder = async () => {
    try {
      await api.patch(`/admin/${name}/reorder`, { ids: itemsRef.current.map((x) => x.id) })
    } catch (e) {
      guard(e)
      toast.err(`Could not save the new order: ${e.message}`)
    }
  }
  const moveBy = (i, d) => {
    const next = move(items, i, d)
    setItems(next)
    itemsRef.current = next
    persistOrder()
  }

  const remove = async () => {
    setSaving(true)
    try {
      await api.del(`/admin/${name}/${deleting.id}`)
      setItems((l) => l.filter((x) => x.id !== deleting.id))
      toast.ok('Deleted.')
      setDeleting(null)
      refresh()
    } catch (e) {
      guard(e)
      toast.err(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader icon={cfg.icon} title={cfg.title} description={cfg.description} actions={<PrimaryButton onClick={openNew}><LuPlus aria-hidden="true" /> Add {cfg.noun}</PrimaryButton>} />
      {sectionHidden && (
        <p className="mb-5 flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
          <LuEyeOff aria-hidden="true" /> This whole section is switched off on the website.
          <Link to="/admin/sections" className="ml-auto font-medium underline decoration-gold underline-offset-4">Turn it on</Link>
        </p>
      )}
      {!items ? (
        <Centered><LuLoaderCircle className="h-6 w-6 animate-spin text-gold-ink" aria-label="Loading" /></Centered>
      ) : items.length === 0 ? (
        <Card><div className="py-8 text-center"><p className="font-display text-xl text-ink">Nothing here yet</p><p className="mt-1 text-sm text-muted">Add your first {cfg.noun} and it appears on the website.</p><PrimaryButton className="mt-5" onClick={openNew}><LuPlus aria-hidden="true" /> Add {cfg.noun}</PrimaryButton></div></Card>
      ) : (
        <>
          <p className="mb-3 text-xs text-muted">Drag the handle or use the arrows to change the order on the website. Use the eye to hide an entry without deleting it.</p>
          <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
            {items.map((it, i) => {
              const d = cfg.describe(it)
              return (
                <Reorder.Item key={it.id} value={it} onDragEnd={persistOrder} whileDrag={{ scale: 1.02, boxShadow: '0 18px 40px -12px rgba(0,0,0,.35)' }} className={`${glass} flex items-center gap-2 rounded-2xl border border-line bg-surface p-3 shadow-card sm:gap-3 sm:p-4 ${it.visible ? '' : 'opacity-60'}`}>
                  <span className="cursor-grab touch-none text-muted" aria-hidden="true"><LuGripVertical /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{d.title || 'Untitled'}</p>
                    {d.sub && <p className="truncate text-xs text-muted">{d.sub}</p>}
                  </div>
                  {!it.visible && <span className="hidden rounded-full border border-line px-2 py-0.5 text-[0.7rem] text-muted sm:inline">Hidden</span>}
                  <div className="hidden sm:flex"><IconButton size="small" aria-label="Move up" disabled={i === 0} onClick={() => moveBy(i, -1)}><LuArrowUp size={16} /></IconButton><IconButton size="small" aria-label="Move down" disabled={i === items.length - 1} onClick={() => moveBy(i, 1)}><LuArrowDown size={16} /></IconButton></div>
                  <IconButton aria-label={it.visible ? 'Hide from website' : 'Show on website'} onClick={() => toggle(it)}>{it.visible ? <LuEye size={18} /> : <LuEyeOff size={18} />}</IconButton>
                  <IconButton aria-label="Edit" onClick={() => openEdit(it)}><LuPencil size={18} /></IconButton>
                  <IconButton aria-label="Delete" onClick={() => setDeleting(it)}><LuTrash2 size={18} /></IconButton>
                </Reorder.Item>
              )
            })}
          </Reorder.Group>
        </>
      )}

      <Dialog open={Boolean(editing)} onClose={saving ? undefined : () => setEditing(null)} fullWidth maxWidth="md" scroll="paper">
        {editing && (
          <>
            <DialogTitle sx={{ fontFamily: "'Source Serif 4', serif" }}>{editing.id ? `Edit ${cfg.noun}` : `Add ${cfg.noun}`}</DialogTitle>
            <DialogContent dividers>
              <div className="flex flex-col gap-5 pt-1">
                <Form d={editing} set={setField} er={errors} toast={toast} pubs={pubs} />
                <SwitchField label="Show on the website" checked={editing.visible} onChange={(v) => setField('visible', v)} />
              </div>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <MuiButton color="inherit" onClick={() => setEditing(null)} disabled={saving}>Cancel</MuiButton>
              <MuiButton variant="contained" onClick={submit} disabled={saving} startIcon={saving ? <LuLoaderCircle className="animate-spin" /> : <LuSave />}>{editing.id ? 'Save changes' : `Add ${cfg.noun}`}</MuiButton>
            </DialogActions>
          </>
        )}
      </Dialog>
      <ConfirmDialog open={Boolean(deleting)} title={`Delete this ${cfg.noun}?`} body={`“${deleting ? cfg.describe(deleting).title : ''}” will be removed from the website for good. To hide it instead, cancel and use the eye button.`} busy={saving} onCancel={() => setDeleting(null)} onConfirm={remove} />
    </>
  )
}

/* ============================== 6. messages ============================== */

const STATUS_TABS = [{ v: '', l: 'All' }, { v: 'new', l: 'New' }, { v: 'read', l: 'Read' }, { v: 'archived', l: 'Archived' }]

function MessagesPanel() {
  const toast = useToast()
  const { guard } = useAuth()
  const { refresh } = useStats()
  const [status, setStatus] = useState('')
  const [items, setItems] = useState(null)
  const [openId, setOpenId] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    let live = true
    api.get(`/admin/messages${status ? `?status=${status}` : ''}`).then((r) => live && setItems(r)).catch((e) => { guard(e); toast.err(e.message) })
    return () => { live = false }
  }, [status, guard, toast])

  const setMsgStatus = async (m, next) => {
    try {
      const saved = await api.patch(`/admin/messages/${m.id}`, { status: next })
      setItems((l) => (status && saved.status !== status ? l.filter((x) => x.id !== m.id) : l.map((x) => (x.id === m.id ? saved : x))))
      refresh()
    } catch (e) { guard(e); toast.err(e.message) }
  }
  const open = (m) => {
    setOpenId(openId === m.id ? null : m.id)
    if (m.status === 'new') setMsgStatus(m, 'read')
  }
  const readAll = async () => {
    try {
      await api.patch('/admin/messages/read-all')
      setItems((l) => l.map((x) => (x.status === 'new' ? { ...x, status: 'read' } : x)))
      refresh()
      toast.ok('All messages marked as read.')
    } catch (e) { guard(e); toast.err(e.message) }
  }
  const remove = async () => {
    try {
      await api.del(`/admin/messages/${deleting.id}`)
      setItems((l) => l.filter((x) => x.id !== deleting.id))
      setDeleting(null)
      refresh()
      toast.ok('Message deleted.')
    } catch (e) { guard(e); toast.err(e.message) }
  }

  return (
    <>
      <PageHeader icon={LuInbox} title="Messages" description="Everything sent through the website's contact form. A copy is also e-mailed to you when e-mail is set up." actions={<GhostButton onClick={readAll}>Mark all as read</GhostButton>} />
      <Tabs value={status} onChange={(_, v) => { setItems(null); setStatus(v) }} sx={{ mb: 3 }} variant="scrollable" scrollButtons="auto">
        {STATUS_TABS.map((t) => <Tab key={t.v} value={t.v} label={t.l} />)}
      </Tabs>
      {!items ? <Centered><LuLoaderCircle className="h-6 w-6 animate-spin text-gold-ink" aria-label="Loading" /></Centered> : items.length === 0 ? (
        <Card><p className="py-8 text-center text-sm text-muted">No messages here.</p></Card>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((m) => (
              <motion.li key={m.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }} className={`${glass} overflow-hidden rounded-2xl border bg-surface shadow-card ${m.status === 'new' ? 'border-gold/70' : 'border-line'}`}>
                <button type="button" onClick={() => open(m)} aria-expanded={openId === m.id} className="flex w-full items-center gap-3 p-4 text-left">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${m.status === 'new' ? 'bg-gold' : 'bg-transparent'}`} aria-label={m.status === 'new' ? 'Unread' : undefined} />
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-ink ${m.status === 'new' ? 'font-semibold' : ''}`}>{m.name} <span className="font-normal text-muted">— {m.subject}</span></span>
                    <span className="block truncate text-xs text-muted">{m.email} · {when(m.createdAt)}{m.type ? ` · ${m.type}` : ''}</span>
                  </span>
                  {m.status === 'archived' && <span className="rounded-full border border-line px-2 py-0.5 text-[0.7rem] text-muted">Archived</span>}
                </button>
                <AnimatePresence initial={false}>
                  {openId === m.id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="border-t border-line p-4">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">{m.message}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className={`${metal} inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-on-primary`}><LuMail aria-hidden="true" /> Reply</a>
                          {m.status !== 'archived' ? <GhostButton onClick={() => setMsgStatus(m, 'archived')}>Archive</GhostButton> : <GhostButton onClick={() => setMsgStatus(m, 'read')}>Move to inbox</GhostButton>}
                          {m.status === 'read' && <GhostButton onClick={() => setMsgStatus(m, 'new')}>Mark unread</GhostButton>}
                          <GhostButton onClick={() => setDeleting(m)}><LuTrash2 aria-hidden="true" /> Delete</GhostButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      <ConfirmDialog open={Boolean(deleting)} title="Delete this message?" body="It will be removed from the inbox for good." onCancel={() => setDeleting(null)} onConfirm={remove} />
    </>
  )
}

/* ============================== 7. account ============================== */

function AccountPanel() {
  const { admin, rename, guard } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ name: admin.name || '', username: admin.username || '', email: admin.email || '', currentPassword: '' })
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState({})
  const setF = (k) => (e) => setForm((v) => ({ ...v, [k]: e.target.value }))
  const setP = (k) => (e) => setPw((v) => ({ ...v, [k]: e.target.value }))
  const loginChanged = form.username.trim().toLowerCase() !== (admin.username || '') || form.email.trim().toLowerCase() !== (admin.email || '')
  const detailsChanged = loginChanged || form.name !== (admin.name || '')

  const saveDetails = async (ev) => {
    ev.preventDefault()
    setBusy(true)
    setErrors({})
    try {
      const r = await api.put('/admin/account', { name: form.name, username: form.username, email: form.email, currentPassword: form.currentPassword })
      rename(r.admin)
      setForm({ name: r.admin.name || '', username: r.admin.username || '', email: r.admin.email || '', currentPassword: '' })
      toast.ok(loginChanged ? 'Saved. Use your new username next time you sign in.' : 'Saved.')
    } catch (e) {
      guard(e)
      setErrors(e.fields || {})
      toast.err(e.message)
    } finally { setBusy(false) }
  }

  const changePassword = async (ev) => {
    ev.preventDefault()
    if (pw.newPassword !== pw.confirm) return setErrors({ confirm: 'The two passwords do not match' })
    setBusy(true)
    setErrors({})
    try {
      const r = await api.post('/auth/change-password', { currentPassword: pw.currentPassword, newPassword: pw.newPassword })
      setPw({ currentPassword: '', newPassword: '', confirm: '' })
      toast.ok(r.message)
    } catch (e) {
      guard(e)
      setErrors(e.fields || {})
      toast.err(e.fields?.newPassword || e.message)
    } finally { setBusy(false) }
  }

  return (
    <>
      <PageHeader icon={LuKeyRound} title="Account & password" description="Change your username, email and password whenever you like. Your username can be an email, a user id or any name you choose." />
      <div className="flex flex-col gap-6">
        <Card title="Login details" hint="Your username is what you type on the login page. The email is optional and only receives password-reset links.">
          <form onSubmit={saveDetails} className="flex flex-col gap-5">
            <Grid>
              <Field label="Username" icon={LuUserRound} value={form.username} onChange={setF('username')} error={errors.username} autoComplete="username" helperText="3–60 characters; not case-sensitive." />
              <Field label="Email (for password reset)" icon={LuMail} type="email" value={form.email} onChange={setF('email')} error={errors.email} autoComplete="email" helperText="Leave empty to remove it." />
              <Field label="Display name" icon={LuType} value={form.name} onChange={setF('name')} error={errors.name} />
            </Grid>
            {loginChanged && (
              <Field label="Current password (needed to change username or email)" icon={LuLock} type="password" autoComplete="current-password" value={form.currentPassword} onChange={setF('currentPassword')} error={errors.currentPassword} />
            )}
            <div>
              <button type="submit" disabled={busy || !detailsChanged || (loginChanged && !form.currentPassword)} className={`${metal} inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-on-primary disabled:opacity-50`}>
                {busy ? <LuLoaderCircle className="animate-spin" aria-hidden="true" /> : <LuSave aria-hidden="true" />} Save login details
              </button>
            </div>
          </form>
        </Card>
        <Card title="Change password" hint="At least 10 characters, with letters and at least one number. Other devices are signed out.">
          <form onSubmit={changePassword} className="flex flex-col gap-5">
            <Field label="Current password" icon={LuLock} type="password" autoComplete="current-password" value={pw.currentPassword} onChange={setP('currentPassword')} error={errors.currentPassword} />
            <Grid>
              <Field label="New password" icon={LuLock} type="password" autoComplete="new-password" value={pw.newPassword} onChange={setP('newPassword')} error={errors.newPassword} />
              <Field label="Confirm new password" icon={LuLock} type="password" autoComplete="new-password" value={pw.confirm} onChange={setP('confirm')} error={errors.confirm} />
            </Grid>
            <div>
              <button type="submit" disabled={busy || !pw.currentPassword || !pw.newPassword} className={`${metal} inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-on-primary disabled:opacity-50`}>
                {busy ? <LuLoaderCircle className="animate-spin" aria-hidden="true" /> : <LuKeyRound aria-hidden="true" />} Change password
              </button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}

/* ============================== 8. routes ============================== */

export default function Dashboard() {
  const { admin, ready } = useAuth()
  const navigate = useNavigate()
  if (!ready) return <div className="flex min-h-dvh items-center justify-center bg-canvas"><LuLoaderCircle className="h-8 w-8 animate-spin text-gold-ink" aria-label="Loading" /></div>
  if (!admin) return <Navigate to="/login" replace />
  return (
    <ToastProvider>
      <SettingsProvider>
        <Layout>
          <Routes>
            <Route index element={<Overview />} />
            <Route path="messages" element={<MessagesPanel />} />
            <Route path="profile" element={<ProfilePanel />} />
            <Route path="about" element={<AboutPanel />} />
            <Route path="sections" element={<SectionsPanel />} />
            <Route path="contact" element={<ContactPanel />} />
            {Object.keys(RESOURCES).map((n) => <Route key={n} path={n} element={<ResourcePanel key={n} name={n} />} />)}
            <Route path="account" element={<AccountPanel />} />
            <Route path="*" element={<Navigate to="/admin" replace onClick={() => navigate('/admin')} />} />
          </Routes>
        </Layout>
      </SettingsProvider>
    </ToastProvider>
  )
}
