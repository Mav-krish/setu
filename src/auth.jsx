import { createContext, useContext, useState } from 'react'
import { api } from './api'
const Ctx = createContext()
export const useAuth = () => useContext(Ctx)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('setu_user') || 'null'))
  const save = u => { setUser(u); u ? localStorage.setItem('setu_user', JSON.stringify(u)) : localStorage.removeItem('setu_user') }
  const ministryLogin = async ({ email, password }) => {
    const r = await api('/api/auth/login', { method: 'POST', body: { email, password } })
    const m = JSON.parse(localStorage.getItem('setu_min_' + email) || '{}')
    save({ ...r, portal: 'ministry', ministryName: m.ministryName || null })
  }
  const ministryRegister = async ({ name, email, password, ministryName }) => {
    await api('/api/auth/register', { method: 'POST', body: { name, email, password } })
    localStorage.setItem('setu_min_' + email, JSON.stringify({ ministryName }))
    await ministryLogin({ email, password })
  }
  // Field engineer and admin: frontend-only until the backend supports these roles.
  const placeholderLogin = (portal, { name, email }) => save({ portal, name: name || (portal === 'admin' ? 'Administrator' : 'Field Engineer'), email, token: null })
  return <Ctx.Provider value={{ user, ministryLogin, ministryRegister, placeholderLogin, logout: () => save(null) }}>{children}</Ctx.Provider>
}
