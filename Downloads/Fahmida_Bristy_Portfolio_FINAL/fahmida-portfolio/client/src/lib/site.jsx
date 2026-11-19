/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from './api'

/* =====================================================================================
   SITE — loads everything the public website shows from the API (settings + visible content) and
   adapts it to the shapes the section components use. The dashboard calls `reload()` after saving.
   ===================================================================================== */

const SiteContext = createContext(null)

const adapt = (raw) => {
  const { settings: s } = raw
  const sections = s.sections
  const shown = sections.filter((x) => x.visible)

  // A section that is not in the navbar (Achievements, Profiles) highlights the nav item above it.
  const navIdFor = (key) => {
    let last = 'home'
    for (const x of sections) {
      if (x.inNav && x.visible) last = x.key
      if (x.key === key) return x.inNav ? key : last
    }
    return key
  }

  const photo = s.profile.photo
  const profile = {
    ...s.profile,
    photo: photo ? { src: photo.url, alt: photo.alt || `Portrait of ${s.profile.name}` } : null,
    cvUrl: s.profile.cv?.url ?? null,
  }
  const cta = shown.find((x) => x.key === s.navCta.target)

  return {
    sections, shown, navIdFor,
    sectionConfig: (key) => sections.find((x) => x.key === key),
    profile,
    about: s.about,
    contactDetails: { email: s.contact.email || null, phone: s.contact.phone || null, location: s.contact.location || null },
    formEnabled: s.contact.formEnabled,
    academicProfiles: s.academicProfiles.map((p) => ({ ...p, id: p.key, url: p.url || null })),
    collaborationTypes: s.collaborationTypes,
    footer: s.footer,
    experienceCategories: s.extras?.experienceCategories ?? [],
    navigation: shown.filter((x) => x.inNav).map((x) => ({ id: x.key, label: x.label, short: x.short, more: x.inMore })),
    navCta: cta ? { label: s.navCta.label, id: cta.key } : null,
    research: raw.research,
    publications: raw.publications.map((p) => ({ ...p, doi: p.doi || null, url: p.url || null, pdfUrl: p.pdf?.url ?? null })),
    projects: raw.projects.map((p) => ({ ...p, images: (p.images || []).map((i) => ({ src: i.url, alt: i.alt || p.title })) })),
    experience: raw.experience,
    education: raw.education,
    achievements: raw.achievements.map((a) => ({ ...a, attachmentUrl: a.attachment?.url ?? null })),
  }
}

export function SiteProvider({ children }) {
  const [state, setState] = useState({ data: null, error: null })

  const reload = useCallback(async () => {
    try {
      const raw = await api.get('/site')
      setState({ data: adapt(raw), error: null })
    } catch (e) {
      setState((s) => ({ ...s, error: e }))
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  const value = useMemo(() => ({ ...state, reload }), [state, reload])
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

// Components only render once the data exists (Portfolio shows a loader first), so `site` is never null here.
export const useSite = () => useContext(SiteContext).data
export const useSiteState = () => useContext(SiteContext)
