import { useEffect, useState } from 'react'

// Tracks which `[data-nav]` section is currently under the sticky header.
export default function useScrollSpy(offset = 120) {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const sections = [...document.querySelectorAll('[data-nav]')]
    if (!sections.length) return undefined
    let frame = 0

    const compute = () => {
      frame = 0
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      let current = sections[0].dataset.nav
      if (atBottom) {
        current = sections[sections.length - 1].dataset.nav
      } else {
        for (const el of sections) {
          if (el.getBoundingClientRect().top <= offset) current = el.dataset.nav
        }
      }
      setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [offset])

  return active
}
