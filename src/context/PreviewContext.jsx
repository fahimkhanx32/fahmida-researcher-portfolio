import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { publications, samplePublications } from '../data/publications'
import { projects, sampleProjects } from '../data/projects'
import { achievements, sampleAchievements } from '../data/achievements'

// Phase 1 review helper: lets the reviewer switch labelled SAMPLE placeholders on/off so both the
// populated UI and the empty states can be checked. Remove (or default to false) before launch.
const PreviewContext = createContext(null)
const KEY = 'folio-sample-content'

const readInitial = () => {
  try {
    const stored = localStorage.getItem(KEY)
    return stored === null ? true : stored === 'true'
  } catch {
    return true
  }
}

export function PreviewProvider({ children }) {
  const [showSamples, setShowSamplesState] = useState(readInitial)

  const setShowSamples = useCallback((value) => {
    setShowSamplesState(value)
    try {
      localStorage.setItem(KEY, String(value))
    } catch {
      /* storage unavailable – ignore */
    }
  }, [])

  const value = useMemo(
    () => ({
      showSamples,
      setShowSamples,
      publications: showSamples ? [...publications, ...samplePublications] : publications,
      projects: showSamples ? [...projects, ...sampleProjects] : projects,
      achievements: showSamples ? [...achievements, ...sampleAchievements] : achievements,
    }),
    [showSamples, setShowSamples],
  )

  return <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useContent = () => useContext(PreviewContext)
