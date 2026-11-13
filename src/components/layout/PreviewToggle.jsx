import { useContent } from '../../context/PreviewContext'

// Phase 1 review control. Switches labelled SAMPLE placeholders on/off so both the populated UI and the
// empty states can be reviewed. Remove this component before launch.
export default function PreviewToggle() {
  const { showSamples, setShowSamples } = useContent()
  return (
    <label className="fixed bottom-5 left-5 z-40 flex cursor-pointer items-center gap-3 rounded-full border border-line bg-surface/95 py-2 pl-4 pr-3 text-xs font-medium text-ink shadow-lift backdrop-blur">
      <span>
        <span className="block text-[0.6rem] uppercase tracking-[0.16em] text-gold-ink">Frontend review</span>
        Sample content
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={showSamples}
        onChange={(e) => setShowSamples(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 rounded-full bg-line transition peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-ink after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-canvas after:shadow after:transition-transform peer-checked:after:translate-x-5"
      />
    </label>
  )
}
