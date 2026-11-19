/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ApiError, api } from './api'

/* AUTH — who is signed in to the dashboard. The session itself is an httpOnly cookie set by the server. */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let live = true
    api.get('/auth/me').then((r) => live && setAdmin(r.admin)).catch(() => {}).finally(() => live && setReady(true))
    return () => { live = false }
  }, [])

  const login = useCallback(async (username, password, remember) => {
    const r = await api.post('/auth/login', { username, password, remember })
    setAdmin(r.admin)
    return r.admin
  }, [])
  const logout = useCallback(async () => {
    await api.post('/auth/logout').catch(() => {})
    setAdmin(null)
  }, [])
  const rename = useCallback((a) => setAdmin(a), [])

  // Any 401 from the dashboard (cookie expired, signed out elsewhere) returns to the login screen.
  const guard = useCallback((err) => {
    if (err instanceof ApiError && err.status === 401) setAdmin(null)
    return err
  }, [])

  const value = useMemo(() => ({ admin, ready, login, logout, rename, guard }), [admin, ready, login, logout, rename, guard])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
