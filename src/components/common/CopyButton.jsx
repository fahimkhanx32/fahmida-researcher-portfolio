import { useEffect, useRef, useState } from 'react'
import { LuCheck, LuCopy } from 'react-icons/lu'

export default function CopyButton({ text, label = 'Copy citation' }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const area = document.createElement('textarea')
      area.value = text
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink transition hover:border-gold hover:bg-sage/50"
    >
      {copied ? <LuCheck className="h-3.5 w-3.5" aria-hidden="true" /> : <LuCopy className="h-3.5 w-3.5" aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </button>
  )
}
