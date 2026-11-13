const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function scrollToSection(id, { updateHash = true } = {}) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  if (updateHash) history.replaceState(null, '', `#${id}`)
  // Move keyboard/screen-reader focus to the section without a second scroll jump.
  el.focus({ preventScroll: true })
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  history.replaceState(null, '', window.location.pathname)
}
