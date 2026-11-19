import { useEffect, useMemo, useState } from 'react'
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles'

/* MUI THEME — the form controls follow the site's light/dark switch (the `dark` class on <html>) and use the
   same fonts as the rest of the site. `injectFirst` puts MUI's styles BEFORE Tailwind so utility classes win. */

const useIsDark = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return dark
}

export function MuiProvider({ children }) {
  const dark = useIsDark()
  const theme = useMemo(
    () =>
      createTheme({
        palette: dark
          ? { mode: 'dark', primary: { main: '#cfd4dc' }, background: { default: '#0d0f12', paper: '#15181d' }, text: { primary: '#eceef1', secondary: '#a5abb4' }, divider: 'rgba(255,255,255,0.12)' }
          : { mode: 'light', primary: { main: '#10243b' }, background: { default: '#f4f5f2', paper: '#fbfbf9' }, text: { primary: '#10243b', secondary: '#4b5d70' }, divider: 'rgba(16,36,59,0.14)' },
        shape: { borderRadius: 12 },
        typography: { fontFamily: "'Inter', system-ui, sans-serif" },
      }),
    [dark],
  )
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  )
}
