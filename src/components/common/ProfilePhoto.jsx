import { LuBadgeCheck } from 'react-icons/lu'
import { profile } from '../../data/siteConfig'

// Arch-framed portrait. Renders the real photo when configured; otherwise a clearly labelled placeholder.
export default function ProfilePhoto() {
  const { photo, initials, registration } = profile
  return (
    <figure className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
      <div className="absolute -right-3 -top-3 h-full w-full rounded-t-[999px] rounded-b-3xl border border-gold/70" aria-hidden="true" />
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl border border-line bg-gradient-to-b from-sage to-surface-2 shadow-lift">
        {photo ? (
          <img
            src={photo.src}
            alt={photo.alt}
            width="800"
            height="1000"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div role="img" aria-label="Profile photograph placeholder" className="flex h-full w-full flex-col items-center justify-center text-ink/70">
            <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M40 420 C 140 300, 260 340, 360 200" />
                <path d="M30 360 C 150 260, 250 300, 370 150" />
                <circle cx="120" cy="330" r="6" fill="currentColor" />
                <circle cx="230" cy="310" r="4" fill="currentColor" />
                <circle cx="318" cy="228" r="7" fill="currentColor" />
                <circle cx="300" cy="140" r="3" fill="currentColor" />
                <path d="M120 330 L230 310 L318 228 L300 140" />
              </g>
            </svg>
            <span className="relative flex h-28 w-28 items-center justify-center rounded-full border border-gold/70 bg-canvas/60 font-display text-4xl font-medium text-ink">
              {initials}
            </span>
            <figcaption className="relative mt-5 text-center">
              <span className="block text-xs font-semibold uppercase tracking-[0.18em]">Profile photograph</span>
              <span className="mt-1 block text-xs text-muted">Placeholder · photo to be added</span>
            </figcaption>
          </div>
        )}
      </div>

      <div className="absolute -bottom-5 left-1/2 flex w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-line bg-surface/95 px-4 py-3 shadow-lift backdrop-blur sm:-left-6 sm:w-auto sm:translate-x-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage text-ink">
          <LuBadgeCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-xs leading-snug">
          <span className="block font-semibold text-ink">Registered Veterinary Doctor</span>
          <span className="text-muted">
            {registration.body} · No. {registration.number}
          </span>
        </span>
      </div>
    </figure>
  )
}
