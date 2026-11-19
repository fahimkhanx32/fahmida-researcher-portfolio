/* eslint-disable react-refresh/only-export-components */
import { motion } from 'framer-motion'

/* AUTH SHELL — the silver-door page shared by Login, Forgot password and Reset password:
   background image (no overlay), a transparent form column, black pill controls. Edit the CONFIG here. */

export const AUTH = {
  background: '/silverdoor.webp', // file in /public (change to any image path or URL)
  fallbackColor: '#1b1a5c',
  fontHref: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
  fontFamily: "'Poppins', system-ui, sans-serif",
}

export const pillBorder = 'border-2 border-black/35 transition-colors hover:border-black/65'
export const pillButton =
  'flex w-full items-center justify-center gap-2 rounded-full bg-transparent font-semibold text-black whitespace-nowrap ' +
  `${pillBorder} hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-60`

export function Alert({ tone = 'error', children }) {
  if (!children) return null
  const styles = tone === 'error' ? 'border-[#c1121f]/60 bg-white/60 text-[#7a0c14]' : 'border-black/30 bg-white/60 text-black'
  return (
    <motion.p
      role={tone === 'error' ? 'alert' : 'status'}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}
    >
      {children}
    </motion.p>
  )
}

export default function AuthShell({ title, subtitle, srOnlyTitle = false, children }) {
  return (
    <>
      <link rel="stylesheet" href={AUTH.fontHref} precedence="default" />
      <main
        className="flex min-h-dvh items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8 text-black sm:px-6"
        style={{
          backgroundColor: AUTH.fallbackColor,
          backgroundImage: `url(${AUTH.background})`,
          fontFamily: AUTH.fontFamily,
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
        }}
      >
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[30rem] px-5 py-7 sm:px-9 sm:py-8"
          aria-labelledby="auth-title"
        >
          <h1 id="auth-title" className={srOnlyTitle ? 'sr-only' : 'mb-2 text-center text-2xl font-semibold text-black'}>
            {title}
          </h1>
          {subtitle && <p className="mb-7 text-center text-sm text-black/80">{subtitle}</p>}
          {children}
        </motion.section>
      </main>
    </>
  )
}
