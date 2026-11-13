import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { LuX } from 'react-icons/lu'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

// Accessible dialog: focus trap, Esc to close, scroll lock, focus restored to the trigger on close.
export default function Modal({ open, onClose, eyebrow, title, children }) {
  const panelRef = useRef(null)
  const closeRef = useRef(onClose)
  const titleId = useId()

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    const items = () => [...panel.querySelectorAll(FOCUSABLE)]
    ;(items()[0] ?? panel).focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
      } else if (e.key === 'Tab') {
        const list = items()
        if (!list.length) return e.preventDefault()
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="folio-portal fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <div className="anim-fade absolute inset-0 bg-[#0a1726]/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="anim-pop relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-lift outline-none sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
          <div className="min-w-0">
            {eyebrow && <div className="mb-2 flex flex-wrap items-center gap-2">{eyebrow}</div>}
            <h2 id={titleId} className="font-display text-xl font-medium leading-snug text-ink sm:text-2xl">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:border-gold hover:bg-sage/60"
          >
            <LuX className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>
        <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
