import { useEffect, useRef, useState } from 'react'
import { LuDownload } from 'react-icons/lu'
import Button from './Button'
import { profile } from '../../data/siteConfig'

// Downloads the CV when a real file is configured; otherwise explains that it is not available yet.
export default function CvButton({ children = 'Download CV', variant = 'primary', size = 'md', className = '', onActivate }) {
  const [notice, setNotice] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  if (profile.cvUrl) {
    return (
      <Button href={profile.cvUrl} download variant={variant} size={size} className={className} onClick={onActivate}>
        <LuDownload className="h-4 w-4" aria-hidden="true" />
        {children}
      </Button>
    )
  }

  const show = () => {
    setNotice(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setNotice(false), 4000)
  }

  return (
    <span className="relative inline-flex">
      <Button variant={variant} size={size} className={className} aria-disabled="true" onClick={show}>
        <LuDownload className="h-4 w-4" aria-hidden="true" />
        {children}
      </Button>
      <span role="status" className="sr-only">
        {notice ? 'The CV is not available yet.' : ''}
      </span>
      {notice && (
        <span
          aria-hidden="true"
          className="anim-pop absolute left-1/2 top-full z-30 mt-2 w-56 -translate-x-1/2 rounded-xl border border-line bg-surface px-3 py-2 text-center text-xs font-normal leading-snug text-ink shadow-lift"
        >
          The CV file has not been added yet. It will be downloadable once supplied.
        </span>
      )}
    </span>
  )
}
